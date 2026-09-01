import { ESTIMATED_DAILY_COSTS } from '@/src/constants';
import type {
  AddictionProgress,
  AddictionType,
  DailyLog,
  FreedomFundSummary,
  UserAddiction,
} from '@/src/types';

export function daysSince(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function calculateAddictionProgress(
  addiction: UserAddiction,
  logs: DailyLog[],
): AddictionProgress {
  const cleanDays = daysSince(addiction.startDate);
  const dailyCost = addiction.dailyCost || ESTIMATED_DAILY_COSTS[addiction.addictionType];
  const relapseDays = logs.filter(
    (l) => l.addictionType === addiction.addictionType && l.usageOccurred,
  ).length;
  const effectiveCleanDays = Math.max(0, cleanDays - relapseDays);
  const avoidedCount = effectiveCleanDays;

  let estimatedSavings: number;
  if (addiction.addictionType === 'smoking') {
    estimatedSavings = effectiveCleanDays * 20;
  } else if (addiction.addictionType === 'gambling') {
    estimatedSavings = effectiveCleanDays * dailyCost;
  } else {
    estimatedSavings = effectiveCleanDays * dailyCost;
  }

  return {
    addictionType: addiction.addictionType,
    cleanDays: effectiveCleanDays,
    avoidedCount,
    estimatedSavings,
  };
}

export function calculateFreedomFund(
  addictions: UserAddiction[],
  logs: DailyLog[],
): FreedomFundSummary {
  const byAddiction = addictions.map((a) => {
    const progress = calculateAddictionProgress(a, logs);
    return {
      addictionType: a.addictionType,
      total: progress.estimatedSavings,
      monthly: Math.round(progress.estimatedSavings / 30),
    };
  });

  const total = byAddiction.reduce((sum, b) => sum + b.total, 0);
  const monthly = byAddiction.reduce((sum, b) => sum + b.monthly, 0);

  return { total, monthly, byAddiction };
}

export function calculateAverageIntensity(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const sum = logs.reduce((s, l) => s + l.cravingIntensity, 0);
  return Math.round((sum / logs.length) * 10) / 10;
}

export function formatCurrency(amount: number): string {
  return `₺${amount.toLocaleString('tr-TR')}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Günaydın';
  if (hour < 18) return 'İyi günler';
  return 'İyi akşamlar';
}
