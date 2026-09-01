import { create } from 'zustand';
import { mockUser, mockUserAddictions } from '@/src/mock/demoData';
import type { User, UserAddiction } from '@/src/types';

interface AuthState {
  user: User | null;
  addictions: UserAddiction[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setAddictions: (addictions: UserAddiction[]) => void;
  addAddiction: (addiction: UserAddiction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  loadDemo: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  addictions: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setUser: (user) =>
    set({ user, isAuthenticated: user !== null, error: null }),
  setAddictions: (addictions) => set({ addictions }),
  addAddiction: (addiction) =>
    set((s) => ({ addictions: [...s.addictions, addiction] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, addictions: [], isAuthenticated: false, error: null }),
  loadDemo: () =>
    set({ user: mockUser, addictions: mockUserAddictions, isAuthenticated: true, error: null }),
}));
