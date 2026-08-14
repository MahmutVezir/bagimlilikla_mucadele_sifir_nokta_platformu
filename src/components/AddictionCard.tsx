import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import type { AddictionType } from '@/src/types';
import { ADDICTION_LABELS, ADDICTION_UNITS } from '@/src/constants';
import { formatCurrency } from '@/src/utils/calculations';
import { Cigarette, Wine, Dices, Pill } from 'lucide-react-native';

const iconMap: Record<AddictionType, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  smoking: Cigarette,
  alcohol: Wine,
  gambling: Dices,
  substance: Pill,
};

const colorMap: Record<AddictionType, { bg: string; icon: string; text: string }> = {
  smoking: { bg: colors.primary[50], icon: colors.primary[600], text: colors.primary[700] },
  alcohol: { bg: colors.accent[50], icon: colors.accent[600], text: colors.accent[700] },
  gambling: { bg: colors.warning[50], icon: colors.warning[600], text: colors.warning[700] },
  substance: { bg: colors.secondary[50], icon: colors.secondary[600], text: colors.secondary[700] },
};

interface AddictionCardProps {
  addictionType: AddictionType;
  cleanDays: number;
  avoidedCount: number;
  estimatedSavings: number;
  onPress?: () => void;
}

export function AddictionCard({
  addictionType,
  cleanDays,
  avoidedCount,
  estimatedSavings,
  onPress,
}: AddictionCardProps) {
  const Icon = iconMap[addictionType];
  const c = colorMap[addictionType];
  const label = ADDICTION_LABELS[addictionType];
  const unit = ADDICTION_UNITS[addictionType];

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${label} kartı. ${cleanDays} temiz gün.`}
      style={({ pressed }) => [styles.card, { backgroundColor: colors.neutral[0] }, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
        <Icon size={22} color={c.icon} strokeWidth={2} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: c.text }]}>{cleanDays}</Text>
      <Text style={styles.unit}>temiz gün</Text>
      <View style={styles.divider} />
      {addictionType === 'smoking' && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>İçilmeyen</Text>
          <Text style={styles.detailValue}>{avoidedCount} sigara</Text>
        </View>
      )}
      {addictionType === 'gambling' && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Oynanmayan</Text>
          <Text style={styles.detailValue}>{avoidedCount} gün</Text>
        </View>
      )}
      {(addictionType === 'alcohol' || addictionType === 'substance') && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Birikim</Text>
          <Text style={styles.detailValue}>{formatCurrency(estimatedSavings)}</Text>
        </View>
      )}
      {addictionType !== 'substance' && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tasarruf</Text>
          <Text style={styles.detailValue}>{formatCurrency(estimatedSavings)}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.md, flex: 1, minHeight: 180, borderWidth: 1, borderColor: colors.neutral[100] },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  label: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[700] },
  value: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, marginTop: 2 },
  unit: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400] },
  divider: { height: 1, backgroundColor: colors.neutral[100], marginVertical: spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  detailLabel: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500] },
  detailValue: { fontSize: fontSizes.xs, fontFamily: fontFamilies.semibold, color: colors.neutral[800] },
});
