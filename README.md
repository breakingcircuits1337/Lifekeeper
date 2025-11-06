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
2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in:
     - `VITE_GEMINI_API_KEY` — Gemini API key (required for the AI Assistant)
     - `VITE_ELEVENLABS_API_KEY` — ElevenLabs API key (optional, for voice reminders)
     - `VITE_ELEVENLABS_VOICE_ID` — ElevenLabs voice ID (e.g., `21m00Tcm4TlvDq8ikWAM`) for the voice you want to use
     - Optional tuning:
       - `VITE_ELEVENLABS_STABILITY` (default 0.40)
       - `VITE_ELEVENLABS_SIMILARITY` (default 0.70)
       - `VITE_ELEVENLABS_STYLE` (default 0.50)
3. Run the app:
   `npm run dev`

Notes:
- Voice reminders use the ElevenLabs TTS API. Browsers may block autoplay audio without a user gesture. If you don’t hear audio, click the “Play voice” button on the notification.
- You can manage and override keys and voice settings from the “Settings” tab. Values saved there are stored in your browser (localStorage) and override the environment variables.

Python requirements:
- This project is a Vite + React app and does not use Python. `requirements.txt` is provided for convenience and documents that there are no Python dependencies.
