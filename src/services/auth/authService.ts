import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { mockUser } from '@/src/mock/demoData';
import type { User } from '@/src/types';

export interface AuthResult {
  user: User;
}

export interface AuthError {
  message: string;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult | AuthError> {
  if (!isSupabaseConfigured) {
    return mockAuth(email);
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { message: mapAuthError(error.message) };
    const user = mapSupabaseUser(data.user);
    return { user };
  } catch {
    return { message: 'Şu anda bağlantı kurulamadı. Daha sonra tekrar deneyin.' };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult | AuthError> {
  if (!isSupabaseConfigured) {
    return mockAuth(email, name);
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { message: mapAuthError(error.message) };
    if (!data.user) return { message: 'Kayıt oluşturulamadı.' };
    const user = mapSupabaseUser(data.user);
    return { user };
  } catch {
    return { message: 'Şu anda bağlantı kurulamadı. Daha sonra tekrar deneyin.' };
  }
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return mapSupabaseUser(data.user);
  } catch {
    return null;
  }
}

function mapSupabaseUser(u: any): User {
  return {
    id: u.id,
    name: (u.user_metadata?.name as string) ?? u.email ?? 'Kullanıcı',
    email: u.email ?? '',
    createdAt: u.created_at ?? new Date().toISOString(),
  };
}

function mockAuth(email: string, name?: string): AuthResult {
  return {
    user: {
      ...mockUser,
      email,
      name: name ?? mockUser.name,
    },
  };
}

function mapAuthError(msg: string): string {
  if (msg.includes('Invalid login')) return 'E-posta veya şifre hatalı.';
  if (msg.includes('already registered')) return 'Bu e-posta zaten kayıtlı.';
  if (msg.includes('rate limit')) return 'Çok fazla deneme. Lütfen bekleyin.';
  return 'Giriş yapılamadı. Bilgileri kontrol edin.';
}
