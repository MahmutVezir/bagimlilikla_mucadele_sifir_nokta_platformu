import { create } from 'zustand';
import { mockRiskScores } from '@/src/mock/demoData';
import type { RiskScore } from '@/src/types';

interface RiskState {
  scores: RiskScore[];
  latestScore: RiskScore | null;
  addScore: (score: RiskScore) => void;
  loadDemo: () => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  scores: [],
  latestScore: null,
  addScore: (score) =>
    set((s) => ({ scores: [score, ...s.scores], latestScore: score })),
  loadDemo: () => set({ scores: mockRiskScores, latestScore: mockRiskScores[0] ?? null }),
}));
