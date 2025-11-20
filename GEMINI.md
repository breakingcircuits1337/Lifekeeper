# Project Overview

This project is a personal dashboard application called "Life Dashboard". It is built with React and Vite. The application provides a customizable interface with tabs and widgets to organize various aspects of a user's life.

## Key Features

- **Customizable Dashboard:** Users can create and manage multiple tabs, each containing a collection of widgets.
- **Widget Types:** The application supports several widget types, including:
    - `Generic`: A simple text-based widget.
    - `Appointment`: To track appointments with details like date, time, person, and location.
    - `Schedule`: To manage weekly schedules.
    - `Checklist`: To create and manage to-do lists.
    - `Settings`: To configure API keys and voice settings.
- **Local Storage Persistence:** The dashboard layout, content, and settings are saved in the browser's local storage, so the user's data persists across sessions.
- **Data Export/Import:** Users can export their dashboard data to a JSON file and import it back, allowing for backups and data migration.
- **AI Assistant:** The application includes an AI assistant that can help with tasks like creating checklists.
- **Voice Reminders:** The application can provide voice reminders for upcoming events using the ElevenLabs API.

## Architecture

The application follows a component-based architecture using React. 
- The main `App.tsx` component manages the application's state, including tabs, widgets, and notifications.
- `types.ts` defines the data structures for the application, ensuring type safety.
- `constants.tsx` provides the default data for the dashboard.
- Components are organized in the `components` directory.
- Services for interacting with external APIs (like `voice.ts` for ElevenLabs) are in the `services` directory.

# Building and Running

## Prerequisites

- Node.js

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required API keys:
     - `VITE_GEMINI_API_KEY`: Your Gemini API key (required for the AI Assistant).
     - `VITE_ELEVENLABS_API_KEY`: Your ElevenLabs API key (optional, for voice reminders).
     - `VITE_ELEVENLABS_VOICE_ID`: The ID of the ElevenLabs voice you want to use.

## Running the Application

To run the application in development mode:

```bash
npm run dev
```

## Building for Production

To build the application for production:

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

# Development Conventions

- **Styling:** The project uses Tailwind CSS for styling, as evidenced by the class names in the components.
- **Linting and Formatting:** While not explicitly defined in the provided files, it's common for Vite projects to use tools like ESLint and Prettier. It's recommended to set these up to maintain code quality.
- **Testing:** There are no testing configurations or files in the provided project structure. It's recommended to add a testing framework like Jest or Vitest to ensure the application's reliability.
