import React from 'react';
import type { Suggestion } from '../services/TaskSuggester';

interface SmartTaskSuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (prompt: string) => void;
}

const SmartTaskSuggestions: React.FC<SmartTaskSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
        <h3 className="text-xs text-slate-400 font-semibold mb-2 px-1">✨ Smart Suggestions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map(suggestion => (
                <button
                    key={suggestion.id}
                    onClick={() => onSuggestionClick(suggestion.prompt)}
                    className="p-3 bg-slate-700/50 hover:bg-slate-600/80 rounded-lg text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <div className="flex items-start">
                        <div className="text-xl mr-3">{suggestion.icon}</div>
                        <div>
                            <p className="font-semibold text-sm text-slate-200">{suggestion.title}</p>
                            <p className="text-xs text-slate-400">{suggestion.description}</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default SmartTaskSuggestions;
