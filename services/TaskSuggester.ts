import type { TabData, WidgetData, ChecklistWidgetData } from '../types';

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  prompt: string; // The prompt to send to the AI assistant
  icon: string; // Emoji or SVG icon
};

const hasWords = (text: string, words: string[]): boolean => {
    const lowerText = text.toLowerCase();
    return words.some(word => lowerText.includes(word));
};

export const generateSuggestions = (data: TabData[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday

    // 1. Time-based Greeting Suggestions
    if (hour >= 5 && hour < 12) {
        suggestions.push({
            id: 'morning_briefing',
            title: 'Morning Briefing',
            description: "Get a summary of today's schedule and tasks.",
            prompt: 'Summarize my schedule for today.',
            icon: '☀️',
        });
    } else if (hour >= 12 && hour < 17) {
        suggestions.push({
            id: 'afternoon_checkin',
            title: 'Afternoon Check-in',
            description: 'Review your progress and plan the rest of your day.',
            prompt: 'What is left on my schedule for today?',
            icon: '🌤️',
        });
    } else if (hour >= 17 && hour < 21) {
        suggestions.push({
            id: 'evening_wind_down',
            title: 'Evening Wind-down',
            description: "Review today's accomplishments and prepare for tomorrow.",
            prompt: 'What did I accomplish today and what is on the schedule for tomorrow?',
            icon: '🌙',
        });
    }

    // 2. Look for recently completed checklists with common recurring tasks
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const checklists = data.flatMap(t => t.widgets).filter(w => w.type === 'checklist') as ChecklistWidgetData[];

    for (const checklist of checklists) {
        if (checklist.content.items.every(item => item.done)) {
            if (hasWords(checklist.title, ['grocery', 'shopping', 'food'])) {
                suggestions.push({
                    id: `repeat_checklist_${checklist.id}`,
                    title: 'Repeat Grocery List?',
                    description: `You completed "${checklist.title}" recently. Need to shop again?`,
                    prompt: `Based on my previous grocery list titled "${checklist.title}", create a new checklist for me.`,
                    icon: '🛒',
                });
            }
             if (hasWords(checklist.title, ['weekly', 'review', 'plan'])) {
                suggestions.push({
                    id: `repeat_weekly_plan_${checklist.id}`,
                    title: 'Plan the Week?',
                    description: 'It might be time for your weekly planning session.',
                    prompt: 'Help me plan my upcoming week.',
                    icon: '📅',
                });
            }
        }
    }

    // 3. Upcoming appointment preparation
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const appointments = data.flatMap(t => t.widgets).filter(w => w.type === 'appointment');
    const tomorrowAppointments = appointments.filter(w => w.type === 'appointment' && w.content.date === tomorrowStr);

    if (tomorrowAppointments.length > 0) {
        const appt = tomorrowAppointments[0];
        suggestions.push({
            id: `prep_appointment_${appt.id}`,
            title: 'Prepare for Tomorrow',
            description: `You have an appointment tomorrow: "${appt.title}". Do you need to prepare?`,
            prompt: `I have an appointment tomorrow: "${appt.title}". Help me create a checklist to prepare for it.`,
            icon: '👨‍⚕️',
        });
    }
    
    // 4. Sunday planning suggestion
    if (day === 0) { // If it's Sunday
         suggestions.push({
            id: 'sunday_planning',
            title: 'Plan Your Week',
            description: "It's Sunday! A great time to plan for the week ahead.",
            prompt: 'Help me plan my upcoming week. What are my priorities?',
            icon: '🗓️',
        });
    }

    // Return unique suggestions, prioritizing more specific ones
    const unique = Array.from(new Set(suggestions.map(s => s.id))).map(id => suggestions.find(s => s.id === id)!);
    return unique.slice(0, 4); // Limit to 4 suggestions
};
