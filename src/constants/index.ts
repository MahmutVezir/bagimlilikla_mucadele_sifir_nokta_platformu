import type { AddictionType, Mood, RiskLevel, Trigger } from '@/src/types';

export const APP_NAME = 'Sıfır Nokta';
export const TEAM_NAME = 'ÖzgürZihin';

export const ADDICTION_LABELS: Record<AddictionType, string> = {
  smoking: 'Sigara',
  alcohol: 'Alkol',
  gambling: 'Kumar',
  substance: 'Madde',
};

export const ADDICTION_UNITS: Record<AddictionType, string> = {
  smoking: 'içilmeyen sigara',
  alcohol: 'alkolsüz içki',
  gambling: 'oynanmayan gün',
  substance: 'temiz gün',
};

export const MOOD_LABELS: Record<Mood, string> = {
  good: 'İyi',
  normal: 'Normal',
  stressed: 'Stresli',
  sad: 'Üzgün',
  angry: 'Öfkeli',
  anxious: 'Kaygılı',
};

export const MOOD_EMOJI: Record<Mood, string> = {
  good: '🙂',
  normal: '😐',
  stressed: '😣',
  sad: '😔',
  angry: '😠',
  anxious: '😰',
};

export const TRIGGER_LABELS: Record<Trigger, string> = {
  stress: 'Stres',
  loneliness: 'Yalnızlık',
  social: 'Sosyal ortam',
  boredom: 'Sıkıntı',
  anger: 'Öfke',
  financial: 'Maddi kaygı',
  habit: 'Alışkanlık',
  environment: 'Ortam',
  other: 'Diğer',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Düşük Risk',
  moderate: 'Orta Risk',
  high: 'Yüksek Risk',
};

export const RISK_LEVEL_RANGES: Record<RiskLevel, { min: number; max: number }> = {
  low: { min: 0, max: 39 },
  moderate: { min: 40, max: 69 },
  high: { min: 70, max: 100 },
};

export const RISK_DISCLAIMER = 'Bu bir tıbbi değerlendirme değildir.';

export const CRISIS_MESSAGE = 'Bu dürtü geçici. Şimdi birlikte 90 saniyeyi yönetelim.';

export const SUPPORT_CONTACTS = {
  yedam: {
    name: 'YEDAM',
    phone: '115',
    description: 'Yeşilay Danışmanlık Hattı — ücretsiz ve gizli destek.',
  },
  emergency: {
    name: '112 Acil',
    phone: '112',
    description: 'Acil durum hatı.',
  },
  yesilay: {
    name: 'Yeşilay',
    website: 'https://www.yesilay.org.tr',
    description: 'Bağımlılıkla mücadele derneği.',
  },
};

export const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export const BREATHING_PHASES = [
  { name: 'Nefes Al', duration: 4, instruction: 'Yavaşça nefes al' },
  { name: 'Tut', duration: 4, instruction: 'Nefesini tut' },
  { name: 'Ver', duration: 6, instruction: 'Yavaşça ver' },
] as const;

export const ATTENTION_TASKS = [
  { id: 'water', title: 'Su iç', description: 'Bir bardak su iç. Yavaşça, dikkatlice.' },
  { id: 'walk', title: 'Kısa yürüyüş yap', description: '5 dakikalık kısa bir yürüyüşe çık.' },
  { id: 'call', title: 'Destek kişini ara', description: 'Güvendiğin birine telefon aç.' },
  { id: 'change', title: 'Ortamını değiştir', description: 'Bulunduğun odadan çık, başka bir yere geç.' },
  { id: 'wait', title: '5 dakika bekle', description: 'Sadece 5 dakika bekle. Dürtü geçecek.' },
] as const;

export const ACHIEVEMENT_DEFINITIONS = [
  { type: 'first_24h', title: 'İlk 24 Saat', description: 'İlk gününü tamamladın.', icon: 'sparkles' },
  { type: '3_days', title: '3 Gün', description: 'Üç gün temiz kaldın.', icon: 'flame' },
  { type: '7_days', title: '7 Gün', description: 'Bir hafta temiz kaldın.', icon: 'shield' },
  { type: '14_days', title: '14 Gün', description: 'İki hafta temiz kaldın.', icon: 'medal' },
  { type: '30_days', title: '30 Gün', description: 'Bir ay temiz kaldın.', icon: 'trophy' },
  { type: 'first_intervention', title: 'İlk Kriz Müdahalesi', description: 'İlk dürtü müdahalesini tamamladın.', icon: 'heart' },
  { type: '10_logs', title: '10 Günlük Kayıt', description: 'On gün boyunca kayıt oluşturdun.', icon: 'notebook' },
  { type: '5_support', title: '5 Kez Destek Alma', description: 'Beş kez destek aracı kullandın.', icon: 'hand-heart' },
] as const;

export const ESTIMATED_DAILY_COSTS: Record<AddictionType, number> = {
  smoking: 45,
  alcohol: 80,
  gambling: 120,
  substance: 200,
};

export const ONBOARDING_SCREENS = [
  {
    title: 'Sıfır Nokta',
    subtitle: 'Kendin için yeni bir başlangıç.',
    description: 'Bağımlılık döngüsünü fark et ve adım adım özgürleş.',
  },
  {
    title: 'Dürtünü Fark Et',
    subtitle: 'Tetikleyicilerini tanı.',
    description: 'Hangi durumların seni zorladığını öğren ve kayıt altına al.',
  },
  {
    title: 'Zor Anlarda Yalnız Değilsin',
    subtitle: 'Dijital destek araçlarına eriş.',
    description: 'Dürtü anında 90 saniyelik müdahaleyle kendini topla.',
  },
  {
    title: 'Gerekirse Profesyonel Desteğe Ulaş',
    subtitle: 'YEDAM ve destek merkezleri.',
    description: 'Seni yargılamayan profesyonellere kolayca ulaş.',
  },
] as const;
