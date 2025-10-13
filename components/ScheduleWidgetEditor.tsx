
import React from 'react';
import type { ScheduleWidgetContent } from '../types';

interface DayInputProps {
  day: keyof ScheduleWidgetContent;
}

interface ScheduleWidgetEditorProps {
  content: ScheduleWidgetContent;
  onChange: (newContent: ScheduleWidgetContent) => void;
}

const DayInput: React.FC<DayInputProps & { value: string; handleChange: (day: keyof ScheduleWidgetContent, value: string) => void; }> = ({ day, value, handleChange }) => (
    <div>
      <label htmlFor={day} className="block text-sm font-medium text-slate-400 mb-1 capitalize">{day}</label>
      <textarea
        id={day}
        name={day}
        value={value}
        onChange={(e) => handleChange(day, e.target.value)}
        placeholder={`Enter schedule for ${day}...`}
        rows={2}
        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
      />
    </div>
);

const ScheduleWidgetEditor: React.FC<ScheduleWidgetEditorProps> = ({ content, onChange }) => {
  
  const handleChange = (day: keyof ScheduleWidgetContent, value: string) => {
    onChange({
      ...content,
      [day]: value,
    });
  };

  const days: (keyof ScheduleWidgetContent)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-3">
      {days.map(day => <DayInput key={day} day={day} value={content[day]} handleChange={handleChange} />)}
    </div>
  );
};

export default ScheduleWidgetEditor;