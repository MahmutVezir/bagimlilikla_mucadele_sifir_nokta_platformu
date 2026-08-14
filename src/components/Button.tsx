import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon}
        <Text style={[styles.text, variantStyle.text, sizeStyle.text]}>
          {loading ? 'Yükleniyor...' : title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontFamily: fontFamilies.semibold },
});

const variants: Record<ButtonVariant, { container: ViewStyle; text: { color: string } }> = {
  primary: { container: { backgroundColor: colors.primary[600] }, text: { color: colors.neutral[0] } },
  secondary: { container: { backgroundColor: colors.secondary[500] }, text: { color: colors.neutral[0] } },
  outline: { container: { borderWidth: 1.5, borderColor: colors.primary[600] }, text: { color: colors.primary[700] } },
  ghost: { container: { backgroundColor: 'transparent' }, text: { color: colors.primary[600] } },
  danger: { container: { backgroundColor: colors.danger[500] }, text: { color: colors.neutral[0] } },
  warning: { container: { backgroundColor: colors.warning[400] }, text: { color: colors.neutral[900] } },
};

const sizes: Record<ButtonSize, { container: ViewStyle; text: { fontSize: number } }> = {
  sm: { container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }, text: { fontSize: fontSizes.sm } },
  md: { container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg }, text: { fontSize: fontSizes.md } },
  lg: { container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl }, text: { fontSize: fontSizes.lg } },
};
