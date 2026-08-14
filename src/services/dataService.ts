import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mockUser } from '@/src/mock/demoData';
import type { DailyLog, UserAddiction, RiskScore } from '@/src/types';

export async function fetchUserAddictions(userId: string): Promise<UserAddiction[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('user_addictions').select('*').eq('user_id', userId);
  if (error) return [];
  return data as UserAddiction[];
}

export async function insertDailyLog(log: Omit<DailyLog, 'id' | 'createdAt'>): Promise<DailyLog | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('daily_logs')
    .insert({
      user_id: log.userId,
      addiction_type: log.addictionType,
      craving_intensity: log.cravingIntensity,
      mood: log.mood,
      trigger: log.trigger,
      usage_occurred: log.usageOccurred,
      note: log.note,
      context_location: log.contextLocation,
    })
    .select()
    .single();
  if (error) return null;
  return data as unknown as DailyLog;
}

export async function fetchDailyLogs(userId: string): Promise<DailyLog[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as unknown as DailyLog[];
}

export async function insertRiskScore(score: Omit<RiskScore, 'id' | 'createdAt'>): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('risk_scores').insert({
    user_id: score.userId,
    score: score.score,
    risk_level: score.riskLevel,
    reasons: score.reasons,
    recommendations: score.recommendations,
  });
}

export const demoUserId = mockUser.id;
