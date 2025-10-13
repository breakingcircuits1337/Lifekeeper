import React, { useState, useEffect, useMemo } from 'react';
import type { TabData, WidgetData, AppointmentWidgetContent, ScheduleWidgetContent } from './types';
import Widget from './components/Widget';
import DashboardView from './components/DashboardView';
import { DEFAULT_DASHBOARD_DATA } from './constants';
import AddWidgetModal from './components/AddWidgetModal';

const App: React.FC = () => {
  const [data, setData] = useState<TabData[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);

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

                return widget;
              }),
            }
          : tab
      )
    );
  };
  
  const handleAddNewWidget = (tabId: string, title: string, type: 'generic' | 'appointment') => {
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