import { StyleSheet, Text, View, type TextProps } from 'react-native';
import { colors, fontFamilies, fontSizes } from '@/src/theme';

type TextVariant = 'display' | 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';
type Tone = 'default' | 'muted' | 'primary' | 'secondary' | 'white' | 'danger' | 'warning' | 'success';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: Tone;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export function AppText({
  variant = 'body',
  tone = 'default',
  weight = 'regular',
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[variantStyles[variant], toneStyles[tone], { fontFamily: fontFamilies[weight] }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const variantStyles = StyleSheet.create({
  display: { fontSize: fontSizes.display, lineHeight: 40 },
  hero: { fontSize: fontSizes.hero, lineHeight: 48 },
  title: { fontSize: fontSizes.xxxl, lineHeight: 36 },
  subtitle: { fontSize: fontSizes.xxl, lineHeight: 32 },
  body: { fontSize: fontSizes.md, lineHeight: 24 },
  caption: { fontSize: fontSizes.xs, lineHeight: 16 },
  label: { fontSize: fontSizes.sm, lineHeight: 20 },
});

const toneStyles = StyleSheet.create({
  default: { color: colors.neutral[900] },
  muted: { color: colors.neutral[500] },
  primary: { color: colors.primary[700] },
  secondary: { color: colors.secondary[600] },
  white: { color: colors.neutral[0] },
  danger: { color: colors.danger[500] },
  warning: { color: colors.warning[500] },
  success: { color: colors.success[500] },
});
