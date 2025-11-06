import React from 'react';
import { TabData } from './types';

const iconClasses = "h-6 w-6 mr-3 shrink-0";

export const DEFAULT_DASHBOARD_DATA: TabData[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>,
    widgets: [],
  },
  // ... existing tabs ...
  {
    id: 'legal',
    name: 'Legal',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c-4.805 0-8.716-3.91-8.716-8.716C3.284 7.48 7.195 3.57 12 3.57c4.805 0 8.716 3.91 8.716 8.716 0 4.806-3.91 8.716-8.716 8.716Zm0-9.375c.621 0 1.242-.022 1.848-.065l.004-.002m-5.41 2.373a5.96 5.96 0 0 1 5.41-2.372m0 0c.321 .023.636.05.946.083l.008.002m-1.042 2.223a5.96 5.96 0 0 0 1.042-2.223M12 3.57v3.315m0 0a5.955 5.955 0 0 1 2.708 0m-2.708 0a5.955 5.955 0 0 0-2.708 0" /></svg>,
    widgets: [
      { id: 'l_will', type: 'generic', title: 'Will & Estate', content: '' },
      { id: 'l_lawyer', type: 'generic', title: 'Lawyer Contact Info', content: '' },
      { id: 'l_documents', type: 'generic', title: 'Important Documents Location', content: '' },
      { id: 'l_passwords', type: 'generic', title: 'Digital Asset Passwords', content: 'Service:\nUsername:\nPassword Hint:\n' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894a1.5 1.5 0 0 0 1.052 1.216l.804.268c.518.172.867.653.867 1.197v1.05c0 .544-.349 1.025-.867 1.197l-.804.268a1.5 1.5 0 0 0-1.052 1.216l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894a1.5 1.5 0 0 0-1.052-1.216l-.804-.268a1.2 1.2 0 0 1-.867-1.197v-1.05c0-.544.349-1.025.867-1.197l.804-.268a1.5 1.5 0 0 0 1.052-1.216l.149-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>,
    widgets: [
      { id: 'settings_keys', type: 'settings', title: 'API Keys & Voice Settings', content: {} },
    ],
  },
];
