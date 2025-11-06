import type { ReactElement } from 'react';

interface BaseWidgetData {
  id: string;
  title: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface GenericWidgetData extends BaseWidgetData {
  type: 'generic';
  content: string;
}

export interface AppointmentWidgetContent {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  person: string;
  location: string;
  description: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface AppointmentWidgetData extends BaseWidgetData {
  type: 'appointment';
  content: AppointmentWidgetContent;
}

export interface ScheduleWidgetContent {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ScheduleWidgetData extends BaseWidgetData {
  type: 'schedule';
  content: ScheduleWidgetContent;
}

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface ChecklistWidgetContent {
  items: ChecklistItem[];
}

export interface ChecklistWidgetData extends BaseWidgetData {
  type: 'checklist';
  content: ChecklistWidgetContent;
}

export interface SettingsWidgetContent {
  // Local-only configuration snapshot (optional)
}

export interface SettingsWidgetData extends BaseWidgetData {
  type: 'settings';
  content: SettingsWidgetContent;
}

export type WidgetData =
  | GenericWidgetData
  | AppointmentWidgetData
  | ScheduleWidgetData
  | ChecklistWidgetData
  | SettingsWidgetData;


export interface TabData {
  id: string;
  name: string;
  icon: ReactElement;
  widgets: WidgetData[];
}

export interface CalendarEvent {
  date: Date;
  startTime: Date | null;
  endTime: Date | null;
  title: string;
  description: string;
  tabId: string;
}