import { StyleSheet, View } from 'react-native';
import { colors, fontFamilies } from '@/src/theme';
import { Text } from 'react-native';
import type { RiskLevel } from '@/src/types';
import { RISK_LEVEL_LABELS } from '@/src/constants';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const colorMap: Record<RiskLevel, string> = {
    low: colors.success[500],
    moderate: colors.warning[500],
    high: colors.danger[500],
  };
  const bgMap: Record<RiskLevel, string> = {
    low: colors.success[50],
    moderate: colors.warning[50],
    high: colors.danger[50],
  };

  return (
    <View style={[styles.badge, { backgroundColor: bgMap[level] }, sizeStyles[size].container]}>
      <View style={[styles.dot, { backgroundColor: colorMap[level] }]} />
      <Text style={[styles.text, { color: colorMap[level] }, sizeStyles[size].text]}>
        {RISK_LEVEL_LABELS[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, alignSelf: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontFamily: fontFamilies.semibold },
});

const sizeStyles = {
  sm: {
    container: { paddingVertical: 4, paddingHorizontal: 8 },
    text: { fontSize: 11 },
  },
  md: {
    container: { paddingVertical: 6, paddingHorizontal: 12 },
    text: { fontSize: 13 },
  },
};
