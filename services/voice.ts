export const speakReminder = async (text: string) => {
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      console.warn('ElevenLabs API key or voice ID missing. Set VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID in .env.local');
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
          stability: 0.4,
          similarity_boost: 0.7,
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
    // Try to play; user gesture may be required depending on browser autoplay policies
    audio.play().catch((err) => {
      console.warn('Audio playback blocked or failed:', err);
    });
    // Cleanup when finished
    audio.addEventListener('ended', () => URL.revokeObjectURL(url));
  } catch (err) {
    console.warn('Failed to speak reminder:', err);
  }
};