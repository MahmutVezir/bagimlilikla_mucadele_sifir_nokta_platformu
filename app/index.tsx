import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/src/theme';
import { useAuthStore } from '@/src/store/authStore';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { useRiskStore } from '@/src/store/riskStore';

export default function RootIndex() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadDemoAuth = useAuthStore((s) => s.loadDemo);
  const loadDemoLogs = useDailyLogStore((s) => s.loadDemo);
  const loadDemoRisk = useRiskStore((s) => s.loadDemo);

  useEffect(() => {
    loadDemoAuth();
    loadDemoLogs();
    loadDemoRisk();
  }, [loadDemoAuth, loadDemoLogs, loadDemoRisk]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }, 400);
    return () => clearTimeout(t);
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary[600]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral[50] },
});
