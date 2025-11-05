<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hmDTOeTnZVaSFVhQONIGPVhp-bXM_CN-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Environment variables in [.env.local](.env.local):
   - `VITE_GEMINI_API_KEY` — Gemini API key (required for the AI Assistant)
   - `VITE_ELEVENLABS_API_KEY` — ElevenLabs API key (optional, for voice reminders)
   - `VITE_ELEVENLABS_VOICE_ID` — ElevenLabs voice ID (e.g., `21m00Tcm4TlvDq8ikWAM`) for the voice you want to use
3. Run the app:
   `npm run dev`

Notes:
- Voice reminders use the ElevenLabs TTS API. Browsers may block autoplay audio without a user gesture. If you don’t hear audio, click the “Play voice” button on the notification.
