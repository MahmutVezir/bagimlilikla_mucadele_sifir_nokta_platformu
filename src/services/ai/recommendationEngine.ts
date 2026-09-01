import { TRIGGER_LABELS } from '@/src/constants';
import type { DailyLog, RiskAssessmentResult } from '@/src/types';

export interface RadarInsight {
  title: string;
  description: string;
  severity: 'info' | 'warning';
}

export interface TriggerRadarAnalysis {
  insights: RadarInsight[];
  riskiestHours: Array<{ hour: string; avgIntensity: number; count: number }>;
  riskiestDays: Array<{ day: string; avgIntensity: number; count: number }>;
  topTriggers: Array<{ trigger: string; count: number; avgIntensity: number }>;
  weeklyTrend: Array<{ day: string; avgIntensity: number }>;
}

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export function analyzeTriggerRadar(logs: DailyLog[]): TriggerRadarAnalysis {
  if (logs.length === 0) {
    return { insights: [], riskiestHours: [], riskiestDays: [], topTriggers: [], weeklyTrend: [] };
  }

  const hourMap = new Map<number, { total: number; count: number }>();
  const dayMap = new Map<number, { total: number; count: number }>();
  const triggerMap = new Map<string, { total: number; count: number }>();

  for (const log of logs) {
    const date = new Date(log.createdAt);
    const hour = date.getHours();
    const day = date.getDay();

    const h = hourMap.get(hour) ?? { total: 0, count: 0 };
    h.total += log.cravingIntensity;
    h.count += 1;
    hourMap.set(hour, h);

    const d = dayMap.get(day) ?? { total: 0, count: 0 };
    d.total += log.cravingIntensity;
    d.count += 1;
    dayMap.set(day, d);

    const t = triggerMap.get(log.trigger) ?? { total: 0, count: 0 };
    t.total += log.cravingIntensity;
    t.count += 1;
    triggerMap.set(log.trigger, t);
  }

  const riskiestHours = Array.from(hourMap.entries())
    .map(([hour, v]) => ({
      hour: `${hour}:00`,
      avgIntensity: Math.round((v.total / v.count) * 10) / 10,
      count: v.count,
    }))
    .sort((a, b) => b.avgIntensity - a.avgIntensity)
    .slice(0, 3);

  const riskiestDays = Array.from(dayMap.entries())
    .map(([day, v]) => ({
      day: DAY_NAMES[day],
      avgIntensity: Math.round((v.total / v.count) * 10) / 10,
      count: v.count,
    }))
    .sort((a, b) => b.avgIntensity - a.avgIntensity)
    .slice(0, 3);

  const topTriggers = Array.from(triggerMap.entries())
    .map(([trigger, v]) => ({
      trigger: TRIGGER_LABELS[trigger as keyof typeof TRIGGER_LABELS] ?? trigger,
      count: v.count,
      avgIntensity: Math.round((v.total / v.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const insights: RadarInsight[] = [];
  if (riskiestDays.length > 0 && riskiestDays[0].avgIntensity >= 6) {
    insights.push({
      title: `${riskiestDays[0].day} günleri senin için daha riskli görünüyor`,
      description: `Ortalama dürtü yoğunluğun ${riskiestDays[0].avgIntensity}/10. Bu günde ekstra dikkatli ol.`,
      severity: 'warning',
    });
  }
  if (riskiestHours.length > 0 && riskiestHours[0].avgIntensity >= 6) {
    insights.push({
      title: `${riskiestHours[0].hour} saatleri dürtü pic noktası`,
      description: `Bu saatte dürtü yoğunluğun daha yüksek. Önceden müdahale planı yap.`,
      severity: 'warning',
    });
  }
  if (topTriggers.length > 0) {
    insights.push({
      title: `En sık tetikleyicin: ${topTriggers[0].trigger}`,
      description: `Bu tetikleyici ${topTriggers[0].count} kez kaydedildi. Farkındalık ilk adım.`,
      severity: 'info',
    });
  }

  const weeklyTrend = computeWeeklyTrend(logs);

  return { insights, riskiestHours, riskiestDays, topTriggers, weeklyTrend };
}

function computeWeeklyTrend(logs: DailyLog[]): Array<{ day: string; avgIntensity: number }> {
  const now = new Date();
  const result: Array<{ day: string; avgIntensity: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const dayLogs = logs.filter((l) => {
      const ld = new Date(l.createdAt);
      return ld >= date && ld < next;
    });
    const avg =
      dayLogs.length > 0
        ? Math.round((dayLogs.reduce((s, l) => s + l.cravingIntensity, 0) / dayLogs.length) * 10) / 10
        : 0;
    result.push({ day: DAY_NAMES[date.getDay()].slice(0, 3), avgIntensity: avg });
  }
  return result;
}

export function buildRecommendationFromRisk(result: RiskAssessmentResult): string {
  if (result.level === 'high') {
    return 'Yüksek risk tespit edildi. Şu an bir müdahale deneyin ve gerekirse profesyonel destek alın.';
  }
  if (result.level === 'moderate') {
    return 'Orta düzey risk. Kısa bir nefes egzersizi ve dikkat değişikliği yardımcı olabilir.';
  }
  return 'Düşük risk. İlerlemeni sürdür ve düzenli kayıt yapmaya devam et.';
}
