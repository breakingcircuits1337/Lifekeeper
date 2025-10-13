
import React from 'react';
import type { AppointmentWidgetContent } from '../types';

interface InputFieldProps {
  label: string;
  id: keyof AppointmentWidgetContent;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
    />
  </div>
);

interface AppointmentWidgetEditorProps {
  content: AppointmentWidgetContent;
  onChange: (newContent: AppointmentWidgetContent) => void;
}

const AppointmentWidgetEditor: React.FC<AppointmentWidgetEditorProps> = ({ content, onChange }) => {
  
  const handleChange = (field: keyof AppointmentWidgetContent, value: string) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  return (
    <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
            <InputField label="Date" id="date" type="date" value={content.date} onChange={(e) => handleChange('date', e.target.value)} />
            <InputField label="Time" id="time" type="time" value={content.time} onChange={(e) => handleChange('time', e.target.value)} />
        </div>
        <InputField label="Person / Contact" id="person" value={content.person} onChange={(e) => handleChange('person', e.target.value)} placeholder="e.g., Dr. Smith"/>
        <InputField label="Location" id="location" value={content.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="e.g., City Clinic"/>
        <InputField label="Description / Reason" id="description" value={content.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="e.g., Annual Check-up"/>
        <div>
          <label htmlFor="recurrence" className="block text-sm font-medium text-slate-400 mb-1">Repeats</label>
          <select
            id="recurrence"
            name="recurrence"
            value={content.recurrence || 'none'}
            onChange={(e) => handleChange('recurrence', e.target.value as AppointmentWidgetContent['recurrence'])}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="none">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
    </div>
  );
};

export default AppointmentWidgetEditor;