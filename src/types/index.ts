export type AddictionType = 'smoking' | 'alcohol' | 'gambling' | 'substance';

export type Mood = 'good' | 'normal' | 'stressed' | 'sad' | 'angry' | 'anxious';

export type RiskLevel = 'low' | 'moderate' | 'high';

export type Trigger =
  | 'stress'
  | 'loneliness'
  | 'social'
  | 'boredom'
  | 'anger'
  | 'financial'
  | 'habit'
  | 'environment'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  goal?: string;
  createdAt: string;
}

export interface UserAddiction {
  id: string;
  userId: string;
  addictionType: AddictionType;
  startDate: string;
  dailyCost: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  addictionType: AddictionType;
  cravingIntensity: number;
  mood: Mood;
  trigger: Trigger;
  usageOccurred: boolean;
  note?: string;
  contextLocation?: string;
  createdAt: string;
}

export interface RiskScore {
  id: string;
  userId: string;
  score: number;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendations: string[];
  createdAt: string;
}

export interface RiskAssessmentInput {
  addictionType: AddictionType;
  cravingIntensity: number;
  mood: Mood;
  hour: number;
  trigger: Trigger;
  recentRelapse: boolean;
  sleepQuality: number;
}

export interface RiskAssessmentResult {
  riskScore: number;
  level: RiskLevel;
  reasons: string[];
  recommendations: string[];
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  unlockedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  scheduledAt: string;
  read: boolean;
}

export interface SupportCenter {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
}

export interface SupportInformation {
  yedam: {
    name: string;
    phone: string;
    description: string;
  };
  emergency115: {
    name: string;
    phone: string;
    description: string;
  };
  yesilay: {
    name: string;
    website: string;
    description: string;
  };
}

export interface FreedomFundSummary {
  total: number;
  monthly: number;
  byAddiction: Array<{
    addictionType: AddictionType;
    total: number;
    monthly: number;
  }>;
}

export interface AddictionProgress {
  addictionType: AddictionType;
  cleanDays: number;
  avoidedCount: number;
  estimatedSavings: number;
}
