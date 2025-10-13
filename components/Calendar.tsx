import React, { useState } from 'react';
import type { CalendarEvent } from '../types';

interface CalendarProps {
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const monthData: (Date | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      monthData.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      monthData.push(new Date(year, month, i));
    }

    return monthData;
  };

  const monthData = getMonthData();
  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-lg font-semibold text-slate-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-400 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthData.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;
          
          const isToday = isSameDay(day, today);
          const eventsForDay = events.filter(e => isSameDay(e.date, day));

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={`relative p-2 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                isToday ? 'bg-blue-600/50 text-white font-bold' : 'hover:bg-slate-700/50'
              }`}
            >
              <span>{day.getDate()}</span>
              {eventsForDay.length > 0 && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-0.5">
                   {eventsForDay.slice(0, 3).map((event, i) => (
                      <div key={i} className="h-1.5 w-1.5 bg-green-400 rounded-full" title={event.title}></div>
                   ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
