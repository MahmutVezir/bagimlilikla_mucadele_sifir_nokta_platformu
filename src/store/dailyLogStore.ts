import { create } from 'zustand';
import { mockDailyLogs } from '@/src/mock/demoData';
import type { DailyLog } from '@/src/types';

interface DailyLogState {
  logs: DailyLog[];
  isLoading: boolean;
  error: string | null;
  setLogs: (logs: DailyLog[]) => void;
  addLog: (log: DailyLog) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadDemo: () => void;
}

export const useDailyLogStore = create<DailyLogState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,
  setLogs: (logs) => set({ logs, error: null }),
  addLog: (log) => set((s) => ({ logs: [log, ...s.logs] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  loadDemo: () => set({ logs: mockDailyLogs }),
}));
