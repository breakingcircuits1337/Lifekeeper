import React, { useMemo, useState } from 'react';
import type { TabData } from '../types';

interface AIAssistantProps {
  data: TabData[];
  onCreateChecklist: (tabId: string, title: string, items: string[]) => void;
}

type ChatMessage = { role: 'user' | 'assistant'; text: string };

const AIAssistant: React.FC<AIAssistantProps> = ({ data, onCreateChecklist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinTabId, setPinTabId] = useState<string>(data[0]?.id || 'dashboard');
  const [pinTitle, setPinTitle] = useState<string>('Checklist');

  // Build a compact context from the dashboard data to help the AI be useful
  const context = useMemo(() => {
    const lines: string[] = [];
    const MAX_WIDGETS = 60;
    let count = 0;

    for (const tab of data) {
      lines.push(`# Tab: ${tab.name}`);
      for (const w of tab.widgets) {
        if (count >= MAX_WIDGETS) break;
        const header = `- ${w.title} (${w.type})`;
        let content = '';
        if (w.type === 'generic') {
          content = (w.content || '').toString().slice(0, 400);
        } else if (w.type === 'appointment') {
          const c = w.content;
          content = `date=${c.date} time=${c.time} person=${c.person} location=${c.location} description=${c.description} recurrence=${c.recurrence}`;
        } else if (w.type === 'schedule') {
          const c = w.content;
          content = `mon=${c.monday} tue=${c.tuesday} wed=${c.wednesday} thu=${c.thursday} fri=${c.friday} sat=${c.saturday} sun=${c.sunday}`;
        }
        lines.push(`${header}: ${content}`);
        count++;
      }
    }

    return lines.join('\n');
  }, [data]);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const sendPrompt = async (prompt: string) => {
    if (!apiKey) {
      setMessages(m => [
        ...m,
        { role: 'assistant', text: 'Gemini API key is missing. Set VITE_GEMINI_API_KEY in .env.local and restart the app.' },
      ]);
      return;
    }
    const userText = prompt.trim();
    if (!userText) return;

    setMessages(m => [...m, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const fullPrompt = [
        'You are an organized, kind assistant embedded in a personal Life Dashboard.',
        'The user has memory difficulties—be concrete, clear, and actionable.',
        'Use short lists, dates, and times when relevant. If there are obvious next steps, propose them.',
        'If asked, produce a simple checklist of steps, each on a new line starting with "- ".',
        'Here is the current dashboard context:',
        context,
        '',
        'User request:',
        userText,
      ].join('\n');

      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();

      const text =
        json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('\n').trim() ||
        'No response text received from Gemini.';

      setMessages(m => [...m, { role: 'assistant', text }]);
    } catch (err: any) {
      setMessages(m => [
        ...m,
        { role: 'assistant', text: `Sorry, I had trouble reaching Gemini: ${err?.message || String(err)}` },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const quickPrompts = [
    'Summarize my schedule for today and the next 3 days.',
    'List upcoming appointments and their details.',
    'Suggest a simple prioritized to-do list based on my notes.',
    'Help me plan the week. What should I focus on first?',
  ];

  const lastAssistantMessage = messages.slice().reverse().find(m => m.role === 'assistant')?.text || '';

  const extractChecklistItems = (text: string): string[] => {
    const lines = text.split('\n').map(l => l.trim());
    const items: string[] = [];
    for (const l of lines) {
      const m = l.match(/^([-*]|\\d+\\.)\\s+(.*)$/);
      if (m && m[2]) {
        items.push(m[2]);
      }
    }
    // Fallback: heuristically split sentences
    if (items.length === 0) {
      const sentences = text.split(/[\\n\\.;]+/).map(s => s.trim()).filter(Boolean);
      return sentences.slice(0, 10);
    }
    return items.slice(0, 20);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 flex items-center"
        title="Open AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        AI Assistant
      </button>

      {!isOpen ? null : (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl m-4 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-100">AI Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close AI Assistant"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => sendPrompt(qp)}
                  className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto bg-slate-900/40 border border-slate-700 rounded-md p-3 space-y-3">
              {messages.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  Ask me to summarize your schedule, extract action items from notes, or plan your week.
                </p>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-md ${m.role === 'user' ? 'bg-slate-700/60 text-slate-200' : 'bg-slate-700/30 text-slate-100'}`}
                  >
                    <p className="text-xs mb-1 opacity-70">{m.role === 'user' ? 'You' : 'Assistant'}</p>
                    <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="text-slate-400 text-sm">Thinking...</div>
              )}
            </div>

            {/* Pin checklist from last response */}
            <div className="mt-3 bg-slate-900/40 border border-slate-700 rounded-md p-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs text-slate-400">Pin as Checklist to</label>
                <select
                  value={pinTabId}
                  onChange={(e) => setPinTabId(e.target.value)}
                  className="text-xs bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white"
                >
                  {data.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <input
                  value={pinTitle}
                  onChange={(e) => setPinTitle(e.target.value)}
                  className="text-xs bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white flex-1"
                  placeholder="Checklist title"
                />
                <button
                  className="text-xs px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    const items = extractChecklistItems(lastAssistantMessage);
                    if (items.length === 0) return;
                    onCreateChecklist(pinTabId, pinTitle.trim() || 'Checklist', items);
                  }}
                  disabled={!lastAssistantMessage.trim()}
                >
                  Create Checklist
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Tip: Ask me for “break down my notes into actionable steps” then pin them.</p>
            </div>

            {/* Input */}
            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendPrompt(input)}
                placeholder="Type a request (e.g., “Create a simple to-do list for today”)"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => sendPrompt(input)}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Tip: For best results, keep appointments and schedules up to date. I use them as context.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;