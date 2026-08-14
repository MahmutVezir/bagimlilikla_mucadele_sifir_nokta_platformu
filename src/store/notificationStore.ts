import { create } from 'zustand';

interface NotificationPrefs {
  dailyReminder: boolean;
  cravingSupport: boolean;
  achievementAlerts: boolean;
  reminderHour: number;
  reminderMinute: number;
}

interface NotificationState extends NotificationPrefs {
  setPref: <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => void;
  reset: () => void;
}

const defaults: NotificationPrefs = {
  dailyReminder: true,
  cravingSupport: true,
  achievementAlerts: true,
  reminderHour: 20,
  reminderMinute: 0,
};

export const useNotificationStore = create<NotificationState>((set) => ({
  ...defaults,
  setPref: (key, value) => set({ [key]: value } as Partial<NotificationState>),
  reset: () => set(defaults),
}));
