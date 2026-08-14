import { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { CravingButton } from '@/src/components/CravingButton';
import { AddictionCard } from '@/src/components/AddictionCard';
import { Card } from '@/src/components/Card';
import { SectionTitle } from '@/src/components/SectionTitle';
import { RiskBadge } from '@/src/components/RiskBadge';
import { useAuthStore } from '@/src/store/authStore';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { useRiskStore } from '@/src/store/riskStore';
import {
  calculateAddictionProgress,
  calculateFreedomFund,
  formatCurrency,
  getGreeting,
} from '@/src/utils/calculations';
import { Plus, Wallet, ChevronRight, TrendingUp } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addictions = useAuthStore((s) => s.addictions);
  const logs = useDailyLogStore((s) => s.logs);
  const latestRisk = useRiskStore((s) => s.latestScore);

  const progressList = useMemo(
    () => addictions.map((a) => calculateAddictionProgress(a, logs)),
    [addictions, logs],
  );

  const freedomFund = useMemo(() => calculateFreedomFund(addictions, logs), [addictions, logs]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] ?? 'Kullanıcı'}`}
        subtitle="Bugün kendin için attığın bir adım daha var."
        right={
          <Pressable
            onPress={() => router.push('/daily-log')}
            accessibilityLabel="Günlük kayıt ekle"
            style={styles.addButton}
          >
            <Plus size={22} color={colors.primary[600]} strokeWidth={2} />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {latestRisk && (
          <Pressable onPress={() => router.push('/risk-analysis')} style={styles.riskRow}>
            <View style={styles.riskInfo}>
              <Text style={styles.riskLabel}>Son Risk Değerlendirmen</Text>
              <Text style={styles.riskScore}>Skor: {latestRisk.score}</Text>
            </View>
            <RiskBadge level={latestRisk.riskLevel} />
          </Pressable>
        )}

        <View style={styles.cravingWrap}>
          <CravingButton onPress={() => router.push('/craving')} />
        </View>

        <SectionTitle title="Kazanç Panosu" subtitle="Mücadele ettiğin bağımlılıklar" />
        <View style={styles.cardGrid}>
          {progressList.length > 0 ? (
            progressList.map((p) => (
              <AddictionCard
                key={p.addictionType}
                addictionType={p.addictionType}
                cleanDays={p.cleanDays}
                avoidedCount={p.avoidedCount}
                estimatedSavings={p.estimatedSavings}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Henüz bağımlılık seçilmedi.</Text>
            </Card>
          )}
        </View>

        <Pressable
          onPress={() => router.push('/freedom-fund')}
          style={({ pressed }) => [styles.fundCard, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.fundIcon}>
            <Wallet size={24} color={colors.secondary[600]} strokeWidth={2} />
          </View>
          <View style={styles.fundInfo}>
            <Text style={styles.fundLabel}>Özgürlük Fonu</Text>
            <Text style={styles.fundValue}>{formatCurrency(freedomFund.total)}</Text>
            <Text style={styles.fundSubtext}>Bu ay kendine ayırabileceğin tahmini miktar: {formatCurrency(freedomFund.monthly)}</Text>
          </View>
          <ChevronRight size={20} color={colors.neutral[400]} strokeWidth={2} />
        </Pressable>

        <SectionTitle
          title="Bugün ne yapalım?"
          action={
            <Pressable onPress={() => router.push('/(tabs)/track')}>
              <Text style={styles.seeAll}>Tümü</Text>
            </Pressable>
          }
        />
        <View style={styles.quickActions}>
          <Pressable
            onPress={() => router.push('/daily-log')}
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.85 }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.primary[50] }]}>
              <Plus size={20} color={colors.primary[600]} strokeWidth={2} />
            </View>
            <Text style={styles.quickLabel}>Günlük Kayıt</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/track')}
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.85 }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.accent[50] }]}>
              <TrendingUp size={20} color={colors.accent[600]} strokeWidth={2} />
            </View>
            <Text style={styles.quickLabel}>İstatistikler</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/support')}
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.85 }]}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.secondary[50] }]}>
              <Wallet size={20} color={colors.secondary[600]} strokeWidth={2} />
            </View>
            <Text style={styles.quickLabel}>Destek Al</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  addButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  riskInfo: { flex: 1 },
  riskLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500] },
  riskScore: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[900], marginTop: 2 },
  cravingWrap: { marginVertical: spacing.sm },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  emptyCard: { alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  emptyText: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[400] },
  fundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondary[50],
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.secondary[100],
  },
  fundIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.neutral[0], alignItems: 'center', justifyContent: 'center' },
  fundInfo: { flex: 1 },
  fundLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.secondary[700] },
  fundValue: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.secondary[700], marginTop: 2 },
  fundSubtext: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 4 },
  seeAll: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[600] },
  quickActions: { flexDirection: 'row', gap: spacing.md },
  quickAction: { flex: 1, alignItems: 'center', gap: 8, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.neutral[100] },
  quickIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: fontSizes.xs, fontFamily: fontFamilies.medium, color: colors.neutral[700], textAlign: 'center' },
});
