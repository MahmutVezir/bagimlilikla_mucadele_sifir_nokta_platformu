import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const memoryStorage = {
  _store: new Map<string, string>(),
  getItem: (key: string) => Promise.resolve(memoryStorage._store.get(key) ?? null),
  setItem: (key: string, value: string) => {
    memoryStorage._store.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    memoryStorage._store.delete(key);
    return Promise.resolve();
  },
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? (window.localStorage as any) : (memoryStorage as any),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
