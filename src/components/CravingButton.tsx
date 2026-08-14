import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Zap } from 'lucide-react-native';
import { shadows } from '@/src/theme';

interface CravingButtonProps {
  onPress: () => void;
  label?: string;
}

export function CravingButton({ onPress, label = 'DÜRTÜ GELDİ' }: CravingButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Dürtü geldi butonu"
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.glow} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Zap size={32} color={colors.neutral[0]} strokeWidth={2.5} fill={colors.neutral[0]} />
        </View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sublabel}>90 saniyelik müdahale</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[700],
    overflow: 'hidden',
    ...shadows.lg,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  glow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[500],
    opacity: 0.3,
  },
  content: { alignItems: 'center', gap: 4 },
  iconWrap: { marginBottom: 4 },
  label: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[0], letterSpacing: 1 },
  sublabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.primary[100] },
});
