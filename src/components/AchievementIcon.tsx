import { Activity, Dumbbell, Flame, HandHeart, Medal, Notebook, Shield, Sparkles, Trophy } from 'lucide-react-native';
import { colors } from '@/src/theme';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  sparkles: Sparkles,
  flame: Flame,
  shield: Shield,
  medal: Medal,
  trophy: Trophy,
  heart: Activity,
  notebook: Notebook,
  'hand-heart': HandHeart,
  dumbbell: Dumbbell,
};

interface AchievementIconProps {
  type: string;
  unlocked: boolean;
  size?: number;
}

export function AchievementIcon({ type, unlocked, size = 32 }: AchievementIconProps) {
  const Icon = iconMap[type] ?? Sparkles;
  return <Icon size={size} color={unlocked ? colors.warning[500] : colors.neutral[300]} strokeWidth={2} />;
}
