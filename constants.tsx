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
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
    widgets: [
      { id: 'hc_pcp', type: 'generic', title: 'Primary Care Physician', content: 'Name:\nPhone:\nAddress:\nLast Visit:' },
      { id: 'hc_appointments', type: 'appointment', title: 'Upcoming Appointment', content: { date: '', time: '', person: '', location: '', description: '', recurrence: 'none' } },
      { id: 'hc_medications', type: 'generic', title: 'Medications & Dosage', content: '' },
      { id: 'hc_allergies', type: 'generic', title: 'Allergies', content: '' },
      { id: 'hc_insurance', type: 'generic', title: 'Insurance Details', content: 'Provider:\nPolicy Number:\nGroup Number:\n' },
    ],
  },
  {
    id: 'dental',
    name: 'Dental',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21" /></svg>,
    widgets: [
      { id: 'd_dentist', type: 'generic', title: 'Dentist Information', content: 'Name:\nPhone:\nAddress:\nLast Visit:' },
      { id: 'd_appointments', type: 'appointment', title: 'Upcoming Dental Appointment', content: { date: '', time: '', person: '', location: '', description: '', recurrence: 'none' } },
      { id: 'd_concerns', type: 'generic', title: 'Current Concerns', content: '' },
      { id: 'd_insurance', type: 'generic', title: 'Dental Insurance', content: '' },
    ],
  },
  {
    id: 'mental_health',
    name: 'Mental Health',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3h.008c1.538 0 2.962.836 3.723 2.145M15 4.5a3 3 0 0 1-3 3V1.5a3 3 0 0 1 3 3h-.008c-1.538 0-2.962.836-3.723 2.145" /></svg>,
    widgets: [
      { id: 'mh_therapist', type: 'appointment', title: 'Therapist Session', content: { date: '', time: '', person: '', location: '', description: 'Therapy Session', recurrence: 'none' } },
      { id: 'mh_psychiatrist', type: 'generic', title: 'Psychiatrist', content: '' },
      { id: 'mh_strategies', type: 'generic', title: 'Coping Strategies', content: '' },
      { id: 'mh_journal', type: 'generic', title: 'Mood & Thoughts Journal', content: '' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-2.252-1.68-2.252-2.583 0-.963.952-1.663 2.414-1.663 1.053 0 2.062.534 2.062 1.5V9.75" /></svg>,
    widgets: [
      { id: 'f_accounts', type: 'generic', title: 'Bank Accounts', content: 'Bank:\nAccount #:\nRouting #:\n' },
      { id: 'f_cards', type: 'generic', title: 'Credit Cards', content: 'Card:\nNumber:\nDue Date:\n' },
      { id: 'f_bills', type: 'generic', title: 'Monthly Bills', content: '' },
      { id: 'f_savings', type: 'generic', title: 'Savings Goals', content: '' },
      { id: 'f_investments', type: 'generic', title: 'Investments', content: '' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>,
    widgets: [
      { id: 'fo_grocery', type: 'generic', title: 'Grocery List', content: '' },
      { id: 'fo_recipes', type: 'generic', title: 'Favorite Recipes', content: '' },
      { id: 'fo_meal_plan', type: 'generic', title: 'Meal Plan', content: '' },
      { id: 'fo_restaurants', type: 'generic', title: 'Favorite Restaurants', content: '' },
    ],
  },
  {
    id: 'resources',
    name: 'Resources',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>,
    widgets: [
      { id: 'r_contacts', type: 'generic', title: 'Important Contacts', content: '' },
      { id: 'r_links', type: 'generic', title: 'Helpful Websites', content: '' },
      { id: 'r_support', type: 'generic', title: 'Support Groups', content: '' },
      { id: 'r_local', type: 'generic', title: 'Local Services', content: '' },
    ],
  },
  {
    id: 'job',
    name: 'Job',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 0 1-2.25 2.25h-13.5a2.25 2.25 0 0 1-2.25-2.25V6.348a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6.348v4.098m-12.75 0h7.5M12 16.5h.008v.008H12v-.008Z" /></svg>,
    widgets: [
      { id: 'j_info', type: 'generic', title: 'Company Information', content: 'Company:\nManager:\nHR Contact:' },
      { id: 'j_tasks', type: 'generic', title: 'Current Projects/Tasks', content: '' },
      { id: 'j_goals', type: 'generic', title: 'Career Goals', content: '' },
      { id: 'j_achievements', type: 'generic', title: 'Achievements', content: '' },
    ],
  },
  {
    id: 'school',
    name: 'School',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>,
    widgets: [
      { id: 's_assignment', type: 'appointment', title: 'Upcoming Assignment/Exam', content: { date: '', time: '', person: 'Professor/Class', location: '', description: 'Assignment Details', recurrence: 'none' } },
      { id: 's_study_session', type: 'appointment', title: 'Study Session', content: { date: '', time: '', person: 'Subject/Topic', location: '', description: 'Study Goals', recurrence: 'none' } },
      { 
        id: 's_schedule', 
        type: 'schedule', 
        title: 'Class Schedule', 
        content: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: '',
        }
      },
      { id: 's_contacts', type: 'generic', title: 'Professor Contacts', content: 'Class:\nProfessor:\nEmail:\nOffice Hours:' },
      { id: 's_resources', type: 'generic', title: 'Study Resources', content: 'Helpful links, textbook sections, etc.' },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.952a4.5 4.5 0 0 1 4.5 0m-4.5 0a4.5 4.5 0 0 0-4.5 0M12 4.5v3m0 0-1.41-1.41M12 7.5l-1.41 1.41M12 7.5l1.41 1.41M12 7.5l1.41-1.41M12 18.72a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1-4.682-2.72m7.5-2.952a4.5 4.5 0 0 0-4.5 0" /></svg>,
    widgets: [
      { id: 'fam_contacts', type: 'generic', title: 'Contact Info', content: '' },
      { id: 'fam_birthdays', type: 'generic', title: 'Birthdays & Anniversaries', content: '' },
      { id: 'fam_events', type: 'appointment', title: 'Upcoming Family Event', content: { date: '', time: '', person: '', location: '', description: '', recurrence: 'none' } },
      { id: 'fam_gift_ideas', type: 'generic', title: 'Gift Ideas', content: '' },
    ],
  },
  {
    id: 'home',
    name: 'Home',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>,
    widgets: [
      { id: 'h_repair', type: 'appointment', title: 'Home Repair Appointment', content: { date: '', time: '', person: 'Contractor', location: 'Home', description: '', recurrence: 'none' } },
      { id: 'h_maintenance', type: 'generic', title: 'Maintenance Schedule', content: '- Change air filters:\n- Clean gutters:\n- Check smoke detectors:' },
      { id: 'h_contacts', type: 'generic', title: 'Repair Contacts', content: 'Plumber:\nElectrician:\nHandyman:' },
      { id: 'h_projects', type: 'generic', title: 'Home Improvement Ideas', content: '' },
    ],
  },
  {
    id: 'hobbies',
    name: 'Hobbies',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9.75 10.5 12.75l1.5 1.5 2.25-3-1.5-1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a7.5 7.5 0 0 1 15 0v3a7.5 7.5 0 0 1-15 0v-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" /></svg>,
    widgets: [
      { id: 'h_current', type: 'generic', title: 'Current Hobbies', content: '' },
      { id: 'h_projects', type: 'generic', title: 'Ongoing Projects', content: '' },
      { id: 'h_ideas', type: 'generic', title: 'Hobbies to Try', content: '' },
      { id: 'h_supplies', type: 'generic', title: 'Supplies Needed', content: '' },
    ],
  },
  {
    id: 'future_plans',
    name: 'Future Plans',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25h15M12 16.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm10.655-5.595a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59Z" /></svg>,
    widgets: [
      { id: 'fp_1year', type: 'generic', title: '1-Year Goals', content: '' },
      { id: 'fp_5year', type: 'generic', title: '5-Year Goals', content: '' },
      { id: 'fp_bucketlist', type: 'generic', title: 'Bucket List', content: '' },
      { id: 'fp_skills', type: 'generic', title: 'Skills to Learn', content: '' },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>,
    widgets: [
      { id: 't_ideas', type: 'generic', title: 'Dream Destinations', content: '' },
      { id: 't_upcoming', type: 'appointment', title: 'Upcoming Trip', content: { date: '', time: '', person: 'Travel Companions', location: 'Destination', description: 'Itinerary Notes', recurrence: 'none' } },
      { id: 't_past', type: 'generic', title: 'Past Trips & Memories', content: '' },
      { id: 't_packing', type: 'generic', title: 'Packing List', content: '' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c-4.805 0-8.716-3.91-8.716-8.716C3.284 7.48 7.195 3.57 12 3.57c4.805 0 8.716 3.91 8.716 8.716 0 4.806-3.91 8.716-8.716 8.716Zm0-9.375c.621 0 1.242-.022 1.848-.065l.004-.002m-5.41 2.373a5.96 5.96 0 0 1 5.41-2.372m0 0c.321.023.636.05.946.083l.008.002m-1.042 2.223a5.96 5.96 0 0 0 1.042-2.223M12 3.57v3.315m0 0a5.955 5.955 0 0 1 2.708 0m-2.708 0a5.955 5.955 0 0 0-2.708 0" /></svg>,
    widgets: [
      { id: 'l_will', type: 'generic', title: 'Will & Estate', content: '' },
      { id: 'l_lawyer', type: 'generic', title: 'Lawyer Contact Info', content: '' },
      { id: 'l_documents', type: 'generic', title: 'Important Documents Location', content: '' },
      { id: 'l_passwords', type: 'generic', title: 'Digital Asset Passwords', content: 'Service:\nUsername:\nPassword Hint:\n' },
    ],
  },
];
