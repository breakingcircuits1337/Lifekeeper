import React, { useEffect, useState } from 'react';

const LS_KEYS = {
  geminiApiKey: 'settings.geminiApiKey',
  elevenApiKey: 'settings.elevenApiKey',
  elevenVoiceId: 'settings.elevenVoiceId',
  elevenStability: 'settings.elevenStability',
  elevenSimilarity: 'settings.elevenSimilarity',
  elevenStyle: 'settings.elevenStyle',
};

const SettingsWidget: React.FC = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [elevenApiKey, setElevenApiKey] = useState('');
  const [elevenVoiceId, setElevenVoiceId] = useState('');
  const [elevenStability, setElevenStability] = useState<number>(0.4);
  const [elevenSimilarity, setElevenSimilarity] = useState<number>(0.7);
  const [elevenStyle, setElevenStyle] = useState<number>(0.5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from localStorage or env
    setGeminiApiKey(localStorage.getItem(LS_KEYS.geminiApiKey) || import.meta.env.VITE_GEMINI_API_KEY || '');
    setElevenApiKey(localStorage.getItem(LS_KEYS.elevenApiKey) || import.meta.env.VITE_ELEVENLABS_API_KEY || '');
    setElevenVoiceId(localStorage.getItem(LS_KEYS.elevenVoiceId) || import.meta.env.VITE_ELEVENLABS_VOICE_ID || '');

    const stabilityEnv = parseFloat(String(import.meta.env.VITE_ELEVENLABS_STABILITY || '0.4'));
    const similarityEnv = parseFloat(String(import.meta.env.VITE_ELEVENLABS_SIMILARITY || '0.7'));
    const styleEnv = parseFloat(String(import.meta.env.VITE_ELEVENLABS_STYLE || '0.5'));

    setElevenStability(parseFloat(localStorage.getItem(LS_KEYS.elevenStability) || String(stabilityEnv)));
    setElevenSimilarity(parseFloat(localStorage.getItem(LS_KEYS.elevenSimilarity) || String(similarityEnv)));
    setElevenStyle(parseFloat(localStorage.getItem(LS_KEYS.elevenStyle) || String(styleEnv)));
  }, []);

  const save = () => {
    localStorage.setItem(LS_KEYS.geminiApiKey, geminiApiKey.trim());
    localStorage.setItem(LS_KEYS.elevenApiKey, elevenApiKey.trim());
    localStorage.setItem(LS_KEYS.elevenVoiceId, elevenVoiceId.trim());
    localStorage.setItem(LS_KEYS.elevenStability, String(elevenStability));
    localStorage.setItem(LS_KEYS.elevenSimilarity, String(elevenSimilarity));
    localStorage.setItem(LS_KEYS.elevenStyle, String(elevenStyle));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Gemini (AI Assistant)</h3>
        <label className="block text-xs text-slate-400 mt-2">API Key</label>
        <input
          value={geminiApiKey}
          onChange={(e) => setGeminiApiKey(e.target.value)}
          placeholder="Enter Gemini API key"
          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          type="password"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-200">ElevenLabs (Voice Reminders)</h3>
        <label className="block text-xs text-slate-400 mt-2">API Key</label>
        <input
          value={elevenApiKey}
          onChange={(e) => setElevenApiKey(e.target.value)}
          placeholder="Enter ElevenLabs API key"
          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          type="password"
        />
        <label className="block text-xs text-slate-400 mt-3">Voice ID</label>
        <input
          value={elevenVoiceId}
          onChange={(e) => setElevenVoiceId(e.target.value)}
          placeholder="e.g., 21m00Tcm4TlvDq8ikWAM"
          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          <div>
            <label className="block text-xs text-slate-400">Stability ({elevenStability.toFixed(2)})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={elevenStability}
              onChange={(e) => setElevenStability(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400">Similarity ({elevenSimilarity.toFixed(2)})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={elevenSimilarity}
              onChange={(e) => setElevenSimilarity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400">Style ({elevenStyle.toFixed(2)})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={elevenStyle}
              onChange={(e) => setElevenStyle(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>

      {saved && <p className="text-xs text-green-400">Saved.</p>}

      <p className="text-[11px] text-slate-500">
        These settings are stored only in your browser (localStorage) and override environment variables.
      </p>
    </div>
  );
};

export default SettingsWidget;