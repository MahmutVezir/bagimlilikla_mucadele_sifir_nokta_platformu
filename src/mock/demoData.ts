import type { DailyLog, RiskScore, User, UserAddiction } from '@/src/types';

export const mockUser: User = {
  id: 'demo-user-001',
  name: 'Demo Kullanıcı',
  email: 'demo@sifirnokta.app',
  age: 28,
  goal: 'Sağlıklı bir yaşam için sigara ve alkolü bırakmak.',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockUserAddictions: UserAddiction[] = [
  {
    id: 'ua-001',
    userId: 'demo-user-001',
    addictionType: 'smoking',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    dailyCost: 45,
  },
  {
    id: 'ua-002',
    userId: 'demo-user-001',
    addictionType: 'alcohol',
    startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    dailyCost: 80,
  },
];

function daysAgo(n: number, hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const mockDailyLogs: DailyLog[] = [
  { id: 'log-001', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 4, mood: 'good', trigger: 'habit', usageOccurred: false, createdAt: daysAgo(13, 9) },
  { id: 'log-002', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 6, mood: 'stressed', trigger: 'stress', usageOccurred: false, createdAt: daysAgo(12, 20) },
  { id: 'log-003', userId: 'demo-user-001', addictionType: 'alcohol', cravingIntensity: 5, mood: 'normal', trigger: 'social', usageOccurred: false, createdAt: daysAgo(11, 21) },
  { id: 'log-004', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 7, mood: 'stressed', trigger: 'stress', usageOccurred: true, note: 'İş daranması.', createdAt: daysAgo(10, 22) },
  { id: 'log-005', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 3, mood: 'good', trigger: 'habit', usageOccurred: false, createdAt: daysAgo(9, 10) },
  { id: 'log-006', userId: 'demo-user-001', addictionType: 'alcohol', cravingIntensity: 8, mood: 'anxious', trigger: 'loneliness', usageOccurred: false, createdAt: daysAgo(8, 23) },
  { id: 'log-007', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 5, mood: 'normal', trigger: 'boredom', usageOccurred: false, createdAt: daysAgo(7, 16) },
  { id: 'log-008', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 9, mood: 'stressed', trigger: 'stress', usageOccurred: false, note: 'Cuma akşamı.', createdAt: daysAgo(6, 21) },
  { id: 'log-009', userId: 'demo-user-001', addictionType: 'alcohol', cravingIntensity: 7, mood: 'stressed', trigger: 'social', usageOccurred: true, createdAt: daysAgo(6, 22) },
  { id: 'log-010', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 4, mood: 'good', trigger: 'habit', usageOccurred: false, createdAt: daysAgo(5, 11) },
  { id: 'log-011', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 6, mood: 'normal', trigger: 'environment', usageOccurred: false, createdAt: daysAgo(4, 18) },
  { id: 'log-012', userId: 'demo-user-001', addictionType: 'alcohol', cravingIntensity: 8, mood: 'anxious', trigger: 'financial', usageOccurred: false, createdAt: daysAgo(3, 22) },
  { id: 'log-013', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 5, mood: 'normal', trigger: 'habit', usageOccurred: false, createdAt: daysAgo(2, 14) },
  { id: 'log-014', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 7, mood: 'stressed', trigger: 'stress', usageOccurred: false, createdAt: daysAgo(1, 20) },
  { id: 'log-015', userId: 'demo-user-001', addictionType: 'smoking', cravingIntensity: 3, mood: 'good', trigger: 'habit', usageOccurred: false, createdAt: daysAgo(0, 10) },
];

export const mockRiskScores: RiskScore[] = [
  { id: 'risk-001', userId: 'demo-user-001', score: 72, riskLevel: 'high', reasons: ['Yüksek dürtü yoğunluğu', 'Stres bildirimi', 'Geçmiş kayıtlarla benzer saat'], recommendations: ['90 saniyelik nefes egzersizi', 'Ortam değişikliği', 'Destek kişisiyle iletişim'], createdAt: daysAgo(1, 20) },
  { id: 'risk-002', userId: 'demo-user-001', score: 35, riskLevel: 'low', reasons: ['Düşük dürtü yoğunluğu', 'İyi ruh hali'], recommendations: ['Mevcut ilerlemeyi sürdür', 'Düzenli kayıt yapmaya devam et'], createdAt: daysAgo(0, 10) },
];
