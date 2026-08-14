import { RISK_LEVEL_RANGES, TRIGGER_LABELS } from '@/src/constants';
import type {
  RiskAssessmentInput,
  RiskAssessmentResult,
  RiskLevel,
} from '@/src/types';

function levelFromScore(score: number): RiskLevel {
  if (score <= RISK_LEVEL_RANGES.low.max) return 'low';
  if (score <= RISK_LEVEL_RANGES.moderate.max) return 'moderate';
  return 'high';
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Rule-based explainable risk engine.
 *
 * This is a prototype implementation that produces an explainable risk score
 * from structured user input. It is NOT a medical assessment. The interface is
 * designed so a real ML/AI backend can replace this function later without
 * changing call sites.
 */
export function assessRisk(input: RiskAssessmentInput): RiskAssessmentResult {
  const reasons: string[] = [];
  let score = 0;

  const intensityWeight = input.cravingIntensity * 6;
  score += intensityWeight;
  if (input.cravingIntensity >= 7) {
    reasons.push('Yüksek dürtü yoğunluğu');
  } else if (input.cravingIntensity >= 4) {
    reasons.push('Orta düzey dürtü yoğunluğu');
  }

  const negativeMoods = ['stressed', 'sad', 'angry', 'anxious'];
  if (negativeMoods.includes(input.mood)) {
    score += 12;
    const moodLabels: Record<string, string> = {
      stressed: 'Stres bildirimi',
      sad: 'Üzgün ruh hali',
      angry: 'Öfke durumu',
      anxious: 'Kaygı bildirimi',
    };
    reasons.push(moodLabels[input.mood] ?? 'Olumsuz ruh hali');
  }

  const highRiskTriggers = ['stress', 'loneliness', 'financial'];
  if (highRiskTriggers.includes(input.trigger)) {
    score += 8;
    reasons.push(`${TRIGGER_LABELS[input.trigger]} tetikleyicisi`);
  }

  const isLateNight = input.hour >= 20 || input.hour <= 2;
  const isEvening = input.hour >= 18 && input.hour < 20;
  if (isLateNight) {
    score += 10;
    reasons.push('Geç saat (20:00–02:00) riskli zaman aralığı');
  } else if (isEvening) {
    score += 5;
    reasons.push('Akşam saatleri geçmiş kayıtlarla örtüşüyor');
  }

  if (input.recentRelapse) {
    score += 15;
    reasons.push('Yakın geçmişte nüks bildirimi');
  }

  if (input.sleepQuality <= 3) {
    score += 8;
    reasons.push('Düşük uyku kalitesi');
  }

  const finalScore = clampScore(score);
  const level = levelFromScore(finalScore);

  if (reasons.length === 0) {
    reasons.push('Düşük dürtü ve olumlu belirtiler');
  }

  return {
    riskScore: finalScore,
    level,
    reasons,
    recommendations: generateRecommendations(input, level),
  };
}

function generateRecommendations(
  input: RiskAssessmentInput,
  level: RiskLevel,
): string[] {
  const recs: string[] = [];

  if (level === 'high') {
    recs.push('90 saniyelik nefes egzersizi');
    recs.push('Ortam değişikliği');
    recs.push('Destek kişisiyle iletişim');
    recs.push('YEDAM 115 hattını aramayı düşün');
  } else if (level === 'moderate') {
    recs.push('Kısa nefes egzersizi');
    recs.push('Dikkatini değiştir (su iç, kısa yürüyüş)');
    recs.push('Günlük kaydı oluştur');
  } else {
    recs.push('Mevcut ilerlemeyi sürdür');
    recs.push('Düzenli kayıt yapmaya devam et');
  }

  if (input.trigger === 'stress') {
    recs.push('Stres kaynağından kısa süre uzaklaş');
  }
  if (input.trigger === 'loneliness') {
    recs.push('Bir yakınını ara, sosyalleş');
  }
  if (input.sleepQuality <= 3) {
    recs.push('Uyku düzenine dikkat et');
  }

  return Array.from(new Set(recs));
}
