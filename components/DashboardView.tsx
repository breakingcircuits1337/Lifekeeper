import React, { useMemo, useState } from 'react';
import type { TabData, CalendarEvent, WidgetData, ScheduleWidgetContent } from '../types';
import Clock from './Clock';
import Calendar from './Calendar';

const parseTimeRange = (text: string, baseDate: Date): { startTime: Date | null, endTime: Date | null, description: string } => {
    const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi;
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
        startTime = createDate(firstMatch[1], firstMatch[2], firstMatch[3]);
        
        // Remove time string from description for cleaner display
        description = text.replace(firstMatch[0], '').trim();

        if (matches.length > 1) {
            const secondMatch = matches[1];
            endTime = createDate(secondMatch[1], secondMatch[2], secondMatch[3]);
             // Further clean description
            description = description.replace(secondMatch[0], '').replace(/[-to]+/i, '').trim();
        }
    }
    
    return { startTime, endTime, description: description || text };
};

const parseEventsFromData = (data: TabData[]): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  data.forEach(tab => {
    tab.widgets.forEach(widget => {
      if (widget.type === 'appointment' && widget.content.date) {
        const parsedDate = new Date(`${widget.content.date}T00:00:00`);
        if (isNaN(parsedDate.getTime())) return;

        const createEventForDate = (date: Date): CalendarEvent => {
          let startTime: Date | null = null;
          if (widget.content.time) {
              const [hours, minutes] = widget.content.time.split(':');
              startTime = new Date(date);
              startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
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

        // Handle recurrence
        const recurrence = widget.content.recurrence;
        if (recurrence && recurrence !== 'none') {
            if (recurrence === 'daily' || recurrence === 'weekly') {
                const occurrences = 180; // Generate recurring events for the next ~6 months
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
                    // Only add the event if the date is valid for that month (e.g., skips Feb 30th)
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

  data.forEach(tab => {
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

interface DashboardViewProps {
  data: TabData[];
  setActiveTab: (tabId: string) => void;
}

const formatTime = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, setActiveTab }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const allEvents = useMemo(() => parseEventsFromData(data), [data]);
  
  const eventsForSelectedDay = useMemo(() => {
    return allEvents
      .filter(event => 
        event.date.getFullYear() === selectedDate.getFullYear() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getDate() === selectedDate.getDate()
      )
      .sort((a, b) => {
        if (!a.startTime) return -1; // All-day events first
        if (!b.startTime) return 1;
        return a.startTime.getTime() - b.startTime.getTime();
      });
  }, [allEvents, selectedDate]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold text-slate-100 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div className="lg:col-span-3">
          <Calendar events={allEvents} onDayClick={setSelectedDate} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <Clock />
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-6 flex-grow transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-3 mb-3">
              Schedule for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
              {eventsForSelectedDay.length > 0 ? (
                eventsForSelectedDay.map((event, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-2 rounded-md cursor-pointer hover:bg-slate-700/80 transition-colors" 
                    onClick={() => setActiveTab(event.tabId)}
                  >
                    <div className="w-24 text-right text-slate-400 font-mono text-sm shrink-0 pt-1">
                      {event.startTime ? formatTime(event.startTime) : 'All Day'}
                      {event.endTime && (
                        <>
                          <br />
                          <span className="text-xs opacity-70">to {formatTime(event.endTime)}</span>
                        </>
                      )}
                    </div>
                    <div className="border-l-2 border-slate-600 pl-4 flex-grow">
                      <p className="font-semibold text-slate-200">{event.description}</p>
                      <p className="text-xs text-slate-500">From: {data.find(t=>t.id === event.tabId)?.name} Tab</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-24">
                    <p className="text-slate-400">No events scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;