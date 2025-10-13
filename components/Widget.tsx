import React, { useRef, useCallback } from 'react';
import type { WidgetData } from '../types';
import AppointmentWidgetEditor from './AppointmentWidgetEditor';
import ScheduleWidgetEditor from './ScheduleWidgetEditor';

interface WidgetProps {
  widget: WidgetData;
  onChange: (newContent: WidgetData['content']) => void;
  onRemove: () => void;
  onResize: (newSize: { colSpan: number; rowSpan: number }) => void;
}

const Widget: React.FC<WidgetProps> = ({ widget, onChange, onRemove, onResize }) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleRemoveClick = () => {
    if (window.confirm(`Are you sure you want to remove the "${widget.title}" widget? This action cannot be undone.`)) {
      onRemove();
    }
  };

  const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const grid = widgetRef.current?.parentElement?.parentElement;
    const widgetEl = widgetRef.current;
    if (!grid || !widgetEl) return;

    const startRect = widgetEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    const gridStyle = window.getComputedStyle(grid);
    const gridColsCount = gridStyle.getPropertyValue('grid-template-columns').split(' ').length;
    const gap = parseFloat(gridStyle.getPropertyValue('gap'));
    
    const gridRect = grid.getBoundingClientRect();
    const colWidth = (gridRect.width - (gridColsCount - 1) * gap) / gridColsCount;

    const rowHeightString = gridStyle.getPropertyValue('grid-auto-rows');
    const match = rowHeightString.match(/(\d+)px/);
    const rowHeight = match ? parseFloat(match[1]) : 260; // Fallback to min height

    const onMouseMove = (moveEvent: MouseEvent) => {
      // This function could be used for live visual feedback during resizing
    };

    const onMouseUp = (upEvent: MouseEvent) => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        const newWidth = startRect.width + (upEvent.clientX - startX);
        const newHeight = startRect.height + (upEvent.clientY - startY);

        const newColSpan = Math.max(1, Math.min(gridColsCount, Math.round((newWidth + gap) / (colWidth + gap))));
        const newRowSpan = Math.max(1, Math.round((newHeight + gap) / (rowHeight + gap)));

        if (newColSpan !== (widget.colSpan || 1) || newRowSpan !== (widget.rowSpan || 1)) {
            onResize({ colSpan: newColSpan, rowSpan: newRowSpan });
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [widget.colSpan, widget.rowSpan, onResize]);

  return (
    <div ref={widgetRef} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg flex flex-col transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10 group h-full relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200">{widget.title}</h3>
        <button 
          onClick={handleRemoveClick} 
          className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-full -mr-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Remove widget"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {widget.type === 'appointment' ? (
          <AppointmentWidgetEditor 
            content={widget.content} 
            onChange={onChange} 
          />
        ) : widget.type === 'schedule' ? (
          <ScheduleWidgetEditor
            content={widget.content}
            onChange={onChange}
          />
        ) : (
          <textarea
            value={widget.content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start typing here..."
            className="w-full h-full bg-transparent text-slate-300 placeholder-slate-500 resize-none focus:outline-none focus:ring-0 text-base"
          />
        )}
      </div>
       <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 p-2 cursor-se-resize text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
          title="Resize widget"
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 10L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 10L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
    </div>
  );
};

export default Widget;