import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, right, style }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }, style]}>
      <View style={styles.row}>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.neutral[50] },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  textWrap: { flex: 1 },
  title: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  subtitle: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
});
