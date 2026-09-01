import { create } from 'zustand';

export interface AchievementProgress {
  unlockedTypes: string[];
  cleanDays: number;
  logCount: number;
  interventionCount: number;
  supportCount: number;
}

interface AchievementState extends AchievementProgress {
  unlock: (type: string) => void;
  setProgress: (p: Partial<AchievementProgress>) => void;
  reset: () => void;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  unlockedTypes: ['first_24h', 'first_intervention'],
  cleanDays: 14,
  logCount: 15,
  interventionCount: 3,
  supportCount: 2,
  unlock: (type) =>
    set((s) =>
      s.unlockedTypes.includes(type)
        ? s
        : { unlockedTypes: [...s.unlockedTypes, type] },
    ),
  setProgress: (p) => set(p),
  reset: () =>
    set({
      unlockedTypes: [],
      cleanDays: 0,
      logCount: 0,
      interventionCount: 0,
      supportCount: 0,
    }),
}));
