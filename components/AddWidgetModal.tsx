
import React, { useState, useEffect } from 'react';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, type: 'generic' | 'appointment' | 'schedule' | 'checklist') => void;
}

type Step = 'select' | 'title';

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [step, setStep] = useState<Step>('select');
  const [widgetType, setWidgetType] = useState<'generic' | 'appointment' | 'schedule' | 'checklist'>('generic');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setTitle('');
      setStep('select');
    }
  }, [isOpen]);

  const handleTypeSelect = (type: 'generic' | 'appointment' | 'schedule' | 'checklist') => {
    setWidgetType(type);
    setStep('title');
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), widgetType);
    }
  };

  if (!isOpen) return null;
  
  const SelectionView = () => (
    <>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Choose Widget Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => handleTypeSelect('generic')} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <h3 className="font-bold text-lg text-slate-200">Custom Note</h3>
                <p className="text-sm text-slate-400">A blank slate for your thoughts, lists, and ideas.</p>
            </button>
            <button onClick={() => handleTypeSelect('appointment')} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <h3 className="font-bold text-lg text-slate-200">Appointment</h3>
                <p className="text-sm text-slate-400">A structured note for events, automatically shown on the calendar.</p>
            </button>
            <button onClick={() => handleTypeSelect('checklist')} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <h3 className="font-bold text-lg text-slate-200">Checklist</h3>
                <p className="text-sm text-slate-400">Interactive to-do list with checkable items.</p>
            </button>
            <button onClick={() => handleTypeSelect('schedule')} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <h3 className="font-bold text-lg text-slate-200">Weekly Schedule</h3>
                <p className="text-sm text-slate-400">Organize activities by day of the week.</p>
            </button>
        </div>
        <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 bg-slate-900/50 hover:bg-slate-700/80 transition-colors">
                Cancel
            </button>
        </div>
    </>
  );

  const TitleView = () => (
    <>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Add New {widgetType === 'appointment' ? 'Appointment' : widgetType === 'checklist' ? 'Checklist' : widgetType === 'schedule' ? 'Schedule' : 'Widget'}</h2>
        <div>
            <label htmlFor="widget-title" className="block text-sm font-medium text-slate-300 mb-2">
                {widgetType === 'appointment' ? 'Appointment Title' : widgetType === 'checklist' ? 'Checklist Name' : widgetType === 'schedule' ? 'Schedule Name' : 'Widget Title'}
            </label>
            <input
                type="text"
                id="widget-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={widgetType === 'appointment' ? "e.g., Dentist Check-up" : widgetType === 'checklist' ? "e.g., Weekly Tasks" : widgetType === 'schedule' ? "e.g., Work Schedule" : "e.g., Grocery List"}
                autoFocus
            />
        </div>
        <div className="mt-6 flex justify-between items-center">
            <button onClick={() => setStep('select')} className="text-sm text-slate-400 hover:text-white">
                &larr; Back
            </button>
            <div className="space-x-3">
                <button onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
                    Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!title.trim()}>
                    Save Widget
                </button>
            </div>
        </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        {step === 'select' ? <SelectionView /> : <TitleView />}
      </div>
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddWidgetModal;
