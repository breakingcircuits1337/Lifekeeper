export const speakReminder = async (text: string) => {
  try {
    const apiKey =
      localStorage.getItem('settings.elevenApiKey') || import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceId =
      localStorage.getItem('settings.elevenVoiceId') || import.meta.env.VITE_ELEVENLABS_VOICE_ID;

    const stability =
      parseFloat(localStorage.getItem('settings.elevenStability') || '') ||
      parseFloat(String(import.meta.env.VITE_ELEVENLABS_STABILITY || '0.4'));
    const similarity =
      parseFloat(localStorage.getItem('settings.elevenSimilarity') || '') ||
      parseFloat(String(import.meta.env.VITE_ELEVENLABS_SIMILARITY || '0.7'));
    const style =
      parseFloat(localStorage.getItem('settings.elevenStyle') || '') ||
      parseFloat(String(import.meta.env.VITE_ELEVENLABS_STYLE || '0.5'));

    if (!apiKey || !voiceId) {
      console.warn('ElevenLabs API key or voice ID missing. Set VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID in .env.local or via Settings.');
      return;
    }

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability,
          similarity_boost: similarity,
          style,
        },
      }),
    });

    if (!res.ok) {
      console.warn('ElevenLabs TTS request failed:', res.status, res.statusText);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.warn('Audio playback blocked or failed:', err);
    });
    audio.addEventListener('ended', () => URL.revokeObjectURL(url));
  } catch (err) {
    console.warn('Failed to speak reminder:', err);
  }
};