import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const day = date.toLocaleDateString([], { weekday: 'long' });
  const fullDate = date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10">
      <div className="text-5xl font-bold text-slate-100 tracking-wider mb-2">
        {time}
      </div>
      <div className="text-xl text-slate-300">{day}</div>
      <div className="text-md text-slate-400">{fullDate}</div>
    </div>
  );
};

export default Clock;
