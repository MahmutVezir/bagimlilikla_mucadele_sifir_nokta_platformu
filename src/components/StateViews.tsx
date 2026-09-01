import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme';
import { fontFamilies, fontSizes, spacing } from '@/src/theme';
import { Text } from 'react-native';
import { Button } from './Button';

interface StateViewsProps {
  isLoading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function StateViews({
  isLoading,
  error,
  empty,
  emptyTitle = 'Henüz veri yok',
  emptyMessage = 'Kayıtların burada görünecek.',
  onRetry,
  children,
}: StateViewsProps) {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Şu anda bağlantı kurulamadı.</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        {onRetry && <Button title="Tekrar dene" onPress={onRetry} variant="outline" size="sm" />}
      </View>
    );
  }
  if (empty) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  }
  return <>{children}</>;
}

export function PullToRefresh({
  onRefresh,
  refreshing,
  children,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  children: React.ReactNode;
}) {
  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 12 },
  errorTitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.danger[600] },
  errorMessage: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], textAlign: 'center' },
  emptyTitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[700] },
  emptyMessage: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[400], textAlign: 'center' },
});
