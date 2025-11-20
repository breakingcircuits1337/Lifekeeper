import React, { useState, useMemo } from 'react';
import type { TabData, WidgetData } from '../types';

interface EnhancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  data: TabData[];
  onResultClick: (tabId: string) => void;
}

type SearchResult = {
  tab: { id: string; name: string };
  widget: WidgetData;
  score: number;
};

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ isOpen, onClose, data, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<WidgetData['type'] | 'all'>('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    data.forEach(tab => {
      tab.widgets.forEach(widget => {
        if (filterType !== 'all' && widget.type !== filterType) {
          return;
        }

        let contentString = '';
        let score = 0;

        if (widget.title.toLowerCase().includes(lowerQuery)) {
          score += 10;
        }

        switch (widget.type) {
          case 'generic':
            contentString = widget.content;
            break;
          case 'appointment':
            contentString = Object.values(widget.content).join(' ');
            break;
          case 'schedule':
            contentString = Object.values(widget.content).join(' ');
            break;
          case 'checklist':
            contentString = widget.content.items.map(i => i.text).join(' ');
            break;
        }

        if (contentString.toLowerCase().includes(lowerQuery)) {
          score += 5;
        }
        
        if (score > 0) {
          results.push({ tab: { id: tab.id, name: tab.name }, widget, score });
        }
      });
    });

    return results.sort((a, b) => b.score - a.score);
  }, [query, data, filterType]);

  const handleResultClick = (tabId: string) => {
    onResultClick(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col" style={{ height: '70vh' }}>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Enhanced Search</h2>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search across all widgets..."
            autoFocus
          />
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value as any)}
            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="generic">Notes</option>
            <option value="appointment">Appointments</option>
            <option value="schedule">Schedules</option>
            <option value="checklist">Checklists</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {searchResults.length > 0 ? (
            <ul className="space-y-3">
              {searchResults.map(({ tab, widget }) => (
                <li key={widget.id}>
                  <button 
                    onClick={() => handleResultClick(tab.id)}
                    className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-600/80 rounded-lg transition-colors"
                  >
                    <p className="font-bold text-slate-200">{widget.title}</p>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {widget.type === 'generic' ? widget.content : 
                       widget.type === 'checklist' ? `${widget.content.items.length} items` :
                       'Structured data widget'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Found in: {tab.name} Tab</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            query.trim() && <p className="text-slate-400 text-center mt-8">No results found.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearch;
