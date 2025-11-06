import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { TabData, WidgetData, AppointmentWidgetContent, ScheduleWidgetContent, ChecklistWidgetContent, CalendarEvent } from './types';
import Widget from './components/Widget';
import DashboardView from './components/DashboardView';
import { DEFAULT_DASHBOARD_DATA } from './constants';
import AddWidgetModal from './components/AddWidgetModal';
import AIAssistant from './components/AIAssistant';
import Notifications, { Notification } from './components/Notifications';
import { speakReminder } from './services/voice';

const App: React.FC = () => {
  const [data, setData] = useState<TabData[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('lifeDashboardData');
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        setData(DEFAULT_DASHBOARD_DATA);
      }
      const savedTab = localStorage.getItem('lifeDashboardActiveTab');
      if(savedTab) {
        setActiveTabId(savedTab);
      } else {
        setActiveTabId('dashboard');
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setData(DEFAULT_DASHBOARD_DATA);
      setActiveTabId('dashboard');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if(isInitialized) {
      try {
        localStorage.setItem('lifeDashboardData', JSON.stringify(data));
        localStorage.setItem('lifeDashboardActiveTab', activeTabId);
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [data, activeTabId, isInitialized]);

  const handleExportData = () => {
    const payload = {
      version: 1,
      timestamp: new Date().toISOString(),
      activeTabId,
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-dashboard-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (Array.isArray(parsed)) {
          setData(parsed);
          setActiveTabId('dashboard');
        } else if (parsed && parsed.data && Array.isArray(parsed.data)) {
          setData(parsed.data);
          setActiveTabId(typeof parsed.activeTabId === 'string' ? parsed.activeTabId : 'dashboard');
        }
      } catch (err) {
        console.error('Failed to import file', err);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Reset dashboard to default data? This will overwrite current data.')) {
      setData(DEFAULT_DASHBOARD_DATA);
      setActiveTabId('dashboard');
    }
  };
  
  const handleWidgetChange = (tabId: string, widgetId: string, newContent: WidgetData['content']) => {
    setData(prevData =>
      prevData.map(tab =>
        tab.id === tabId
          ? {
              ...tab,
              widgets: tab.widgets.map(widget => {
                if (widget.id !== widgetId) {
                  return widget;
                }

                if (widget.type === 'generic' && typeof newContent === 'string') {
                  return { ...widget, content: newContent };
                }
                
                if (widget.type === 'appointment' && typeof newContent === 'object' && newContent !== null && 'date' in newContent) {
                  return { ...widget, content: newContent as AppointmentWidgetContent };
                }
                
                if (widget.type === 'schedule' && typeof newContent === 'object' && newContent !== null && 'monday' in newContent) {
                   return { ...widget, content: newContent as ScheduleWidgetContent };
                }

                if (widget.type === 'checklist' && typeof newContent === 'object' && newContent !== null && 'items' in newContent) {
                  return { ...widget, content: newContent as ChecklistWidgetContent };
                }

                return widget;
              }),
            }
          : tab
      )
    );
  };
  
  const handleAddNewWidget = (tabId: string, title: string, type: 'generic' | 'appointment' | 'checklist') => {
    if (!tabId || !title.trim()) return;

    let newWidget: WidgetData;
    const baseWidget = {
        id: `${tabId}_${type}_${Date.now()}`,
        title: title.trim(),
        colSpan: 1,
        rowSpan: 1,
    };

    if (type === 'appointment') {
        newWidget = {
            ...baseWidget,
            type: 'appointment',
            content: { date: '', time: '', person: '', location: '', description: '', recurrence: 'none' },
        };
    } else if (type === 'checklist') {
        newWidget = {
          ...baseWidget,
          type: 'checklist',
          content: { items: [] },
        };
    } else {
         newWidget = {
            ...baseWidget,
            type: 'generic',
            content: '',
        };
    }

    setData(prevData =>
        prevData.map(tab =>
            tab.id === tabId
                ? {
                    ...tab,
                    widgets: [...tab.widgets, newWidget],
                }
                : tab
        )
    );
  };
  
  const handleRemoveWidget = (tabId: string, widgetId: string) => {
    setData(prevData =>
        prevData.map(tab =>
            tab.id === tabId
                ? {
                    ...tab,
                    widgets: tab.widgets.filter(widget => widget.id !== widgetId),
                }
                : tab
        )
    );
  };
  
  const handleWidgetResize = (tabId: string, widgetId: string, newSize: { colSpan: number; rowSpan: number }) => {
    setData(prevData =>
      prevData.map(tab =>
        tab.id === tabId
          ? {
              ...tab,
              widgets: tab.widgets.map(widget =>
                widget.id === widgetId
                  ? { ...widget, colSpan: newSize.colSpan, rowSpan: newSize.rowSpan }
                  : widget
              ),
            }
          : tab
      )
    );
  };

  const activeTabData = useMemo(() => data.find(tab => tab.id === activeTabId), [data, activeTabId]);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  // Event parsing (copied from DashboardView to reuse for reminders)
  const parseTimeRange = (text: string, baseDate: Date): { startTime: Date | null, endTime: Date | null, description: string } => {
    const timeRegex = /((\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)?)/gi;
    const matches = [...text.matchAll(timeRegex)];

    let startTime: Date | null = null;
    let endTime: Date | null = null;
    let description = text;

    const createDate = (hourStr: string, minuteStr: string | undefined, ampm: string | undefined) => {
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr ? parseInt(minuteStr, 10) : 0;

        if (ampm?.toLowerCase() === 'pm' && hour < 12) {
            hour += 12;
        }
        if (ampm?.toLowerCase() === 'am' && hour === 12) {
            hour = 0; // Midnight case
        }

        const newDate = new Date(baseDate);
        newDate.setHours(hour, minute, 0, 0);
        return newDate;
    };

    if (matches.length > 0) {
        const firstMatch = matches[0];
        startTime = createDate(firstMatch[2], firstMatch[3], firstMatch[4]);
        
        // Remove time string from description for cleaner display
        description = text.replace(firstMatch[0], '').trim();

        if (matches.length > 1) {
            const secondMatch = matches[1];
            endTime = createDate(secondMatch[2], secondMatch[3], secondMatch[4]);
             // Further clean description
            description = description.replace(secondMatch[0], '').replace(/[-to]+/i, '').trim();
        }
    }
    
    return { startTime, endTime, description: description || text };
  };

  const parseEventsFromData = (dataArg: TabData[]): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    dataArg.forEach(tab => {
      tab.widgets.forEach(widget => {
        if (widget.type === 'appointment' && widget.content.date) {
          const parsedDate = new Date(`${widget.content.date}T00:00:00`);
          if (isNaN(parsedDate.getTime())) return;

          const createEventForDate = (date: Date): CalendarEvent => {
            let startTime: Date | null = null;
            if (widget.content.time) {
                const [hours, minutes] = widget.content.time.split(':');
                startTime = new Date(date);
                startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            }

            let description = widget.content.description || widget.title;
            if (widget.content.person) description += ` w/ ${widget.content.person}`;
            if (widget.content.location) description += ` at ${widget.content.location}`;

            return {
              date: date,
              startTime,
              endTime: null,
              title: widget.title,
              description,
              tabId: tab.id,
            };
          };
          
          // Add the primary event
          events.push(createEventForDate(parsedDate));

          // Handle recurrence (simple expansion window ~6 months)
          const recurrence = widget.content.recurrence;
          if (recurrence && recurrence !== 'none') {
              if (recurrence === 'daily' || recurrence === 'weekly') {
                  const occurrences = 180;
                  for (let i = 1; i <= occurrences; i++) {
                      const nextDate = new Date(parsedDate);
                      const increment = recurrence === 'daily' ? i : i * 7;
                      nextDate.setDate(parsedDate.getDate() + increment);
                      events.push(createEventForDate(nextDate));
                  }
              } else if (recurrence === 'monthly') {
                  const monthlyOccurrences = 6;
                  for (let i = 1; i <= monthlyOccurrences; i++) {
                      const nextDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + i, parsedDate.getDate());
                      if (nextDate.getDate() === parsedDate.getDate()) {
                          events.push(createEventForDate(nextDate));
                      }
                  }
              }
          }
        }
      });
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayKeyMap: (keyof ScheduleWidgetContent)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    dataArg.forEach(tab => {
      tab.widgets.forEach(widget => {
        if (widget.type === 'schedule') {
          const scheduleContent = widget.content;
          
          for (let i = 0; i < 180; i++) {
            const currentDateInLoop = new Date(today);
            currentDateInLoop.setDate(today.getDate() + i);
            
            const dayOfWeekIndex = currentDateInLoop.getDay();
            const dayKey = dayKeyMap[dayOfWeekIndex];
            
            const scheduleForDay = scheduleContent[dayKey];
            if (scheduleForDay && scheduleForDay.trim() !== '') {
              const { startTime, endTime, description } = parseTimeRange(scheduleForDay.trim(), currentDateInLoop);
              events.push({
                date: currentDateInLoop,
                startTime,
                endTime,
                title: widget.title,
                description,
                tabId: tab.id,
              });
            }
          }
        }
      });
    });

    return events;
  };

  // On app start: show upcoming events and schedule 15-min-before reminders
  useEffect(() => {
    if (!isInitialized) return;

    // Clear previous timers
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    const allEvents = parseEventsFromData(data);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const threeDaysAhead = new Date(startOfToday);
    threeDaysAhead.setDate(startOfToday.getDate() + 3);

    const upcoming = allEvents
      .filter(e => e.date >= startOfToday && e.date <= threeDaysAhead)
      .sort((a, b) => {
        const at = a.startTime ? a.startTime.getTime() : a.date.getTime();
        const bt = b.startTime ? b.startTime.getTime() : b.date.getTime();
        return at - bt;
      });

    if (upcoming.length > 0) {
      const body = upcoming.slice(0, 8).map(e => {
        const dateStr = e.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' });
        const timeStr = e.startTime ? e.startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'All Day';
        return `• ${dateStr} — ${timeStr}: ${e.description}`;
      }).join('\\n');

      setNotifications(prev => [
        ...prev,
        {
          id: `start_${Date.now()}`,
          title: 'Upcoming events (next 3 days)',
          body,
        },
      ]);
    }

    // Schedule reminders 15 minutes before events with a startTime
    const FIFTEEN_MIN = 15 * 60 * 1000;
    allEvents.forEach(e => {
      if (!e.startTime) return;
      const reminderTime = new Date(e.startTime.getTime() - FIFTEEN_MIN);
      const msUntil = reminderTime.getTime() - now.getTime();
      if (msUntil <= 0) return;
      // Avoid scheduling too far in future (limit ~7 days to prevent too many timers)
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (msUntil > oneWeek) return;

      const timeoutId = window.setTimeout(() => {
        const msg = `Reminder in 15 minutes: ${e.description}${e.startTime ? ' at ' + e.startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}.`;
        setNotifications(prev => [
          ...prev,
          {
            id: `rem_${e.tabId}_${e.title}_${reminderTime.getTime()}`,
            title: 'Reminder (15 min)',
            body: `${e.description} at ${e.startTime?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`,
            time: e.startTime || e.date,
          },
        ]);
        // Speak the reminder if ElevenLabs is configured
        speakReminder(msg);
      }, msUntil);
      timeoutsRef.current.push(timeoutId);
    });

    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [isInitialized, data]);
  

  return (
    <>
      <div 
        className="fixed inset-0 -z-10 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://picsum.photos/seed/space/1920/1080')" }}
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      </div>
      
      <div className="min-h-screen text-white flex flex-col md:flex-row">
        <header className="md:hidden p-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-100">Life Dashboard</h1>
        </header>
        <aside className="w-full md:w-64 bg-slate-900/60 backdrop-blur-md border-r border-slate-800 flex-shrink-0">
          <div className="p-4 border-b border-slate-800 hidden md:block">
            <h1 className="text-2xl font-bold text-slate-100">Life Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Your personal command center.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={handleExportData}
                className="text-xs px-2 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                title="Download your dashboard data as a JSON file"
              >
                Save Data
              </button>
              <button
                onClick={handleImportClick}
                className="text-xs px-2 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                title="Import data from a JSON file"
              >
                Load Data
              </button>
              <button
                onClick={handleResetData}
                className="col-span-2 text-xs px-2 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                title="Reset to default tabs and widgets"
              >
                Reset to Defaults
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>
          </div>
          <nav className="p-2">
            <ul className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
              {data.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTabId(tab.id)}
                    className={`w-full flex items-center p-3 my-1 rounded-md text-left text-sm font-medium transition-colors duration-200 ${
                      activeTabId === tab.id
                        ? 'bg-blue-600/30 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span className="whitespace-nowrap">{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTabId === 'dashboard' ? (
            <DashboardView data={data} setActiveTab={setActiveTabId} />
          ) : activeTabData ? (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-4xl font-bold text-slate-100">{activeTabData.name}</h2>
                <button 
                    onClick={() => setIsAddWidgetModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Widget
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-auto-rows-[minmax(260px,_auto)]">
                {activeTabData.widgets.map(widget => (
                  <div
                    key={widget.id}
                    style={{
                      gridColumn: `span ${widget.colSpan || 1}`,
                      gridRow: `span ${widget.rowSpan || 1}`,
                    }}
                    className="min-h-0"
                  >
                    <Widget
                      widget={widget}
                      onChange={(newContent) => handleWidgetChange(activeTabData.id, widget.id, newContent)}
                      onRemove={() => handleRemoveWidget(activeTabData.id, widget.id)}
                      onResize={(newSize) => handleWidgetResize(activeTabData.id, widget.id, newSize)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
             !isInitialized ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">Loading Dashboard...</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">Select a tab to get started.</p>
              </div>
            )
          )}
        </main>
      </div>

      {/* AI Assistant floating helper */}
      <AIAssistant
        data={data}
        onCreateChecklist={(tabId, title, items) => {
          const content: ChecklistWidgetContent = { items: items.map(text => ({ text, done: false })) };
          const id = `${tabId}_checklist_${Date.now()}`;
          setData(prev =>
            prev.map(t =>
              t.id === tabId
                ? { ...t, widgets: [...t.widgets, { id, title, type: 'checklist', content, colSpan: 1, rowSpan: 1 }] }
                : t
            )
          );
          setActiveTabId(tabId);
        }}
      />

      {/* Notifications */}
      <Notifications
        notifications={notifications}
        onDismiss={(id) => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }}
        onSpeak={(n) => {
          const msg = n.title.includes('Reminder')
            ? n.body ? `Reminder: ${n.body}` : 'Reminder.'
            : n.body;
          if (msg) speakReminder(msg);
        }}
      />
      
      <AddWidgetModal 
        isOpen={isAddWidgetModalOpen} 
        onClose={() => setIsAddWidgetModalOpen(false)}
        onSave={(title, type) => {
            if (activeTabId) {
                handleAddNewWidget(activeTabId, title, type);
            }
            setIsAddWidgetModalOpen(false);
        }}
      />
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default App;