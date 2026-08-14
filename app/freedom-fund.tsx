import { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ProgressRing } from '@/src/components/ProgressRing';
import { useAuthStore } from '@/src/store/authStore';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { calculateFreedomFund, calculateAddictionProgress, formatCurrency, daysSince } from '@/src/utils/calculations';
import { ADDICTION_LABELS } from '@/src/constants';
import { Wallet, TrendingUp, ChevronLeft, Cigarette, Wine, Dices, Pill } from 'lucide-react-native';
import type { AddictionType } from '@/src/types';

const ICONS: Record<AddictionType, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  smoking: Cigarette,
  alcohol: Wine,
  gambling: Dices,
  substance: Pill,
};

export default function FreedomFundScreen() {
  const router = useRouter();
  const addictions = useAuthStore((s) => s.addictions);
  const logs = useDailyLogStore((s) => s.logs);

  const fund = useMemo(() => calculateFreedomFund(addictions, logs), [addictions, logs]);
  const progressList = useMemo(() => addictions.map((a) => calculateAddictionProgress(a, logs)), [addictions, logs]);

  const goal = 10000;
  const ringProgress = Math.min(1, fund.total / goal);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Geri">
          <ChevronLeft size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
        <Text style={styles.topTitle}>Özgürlük Fonu</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Wallet size={28} color={colors.secondary[600]} strokeWidth={2} />
            </View>
            <Text style={styles.heroLabel}>Toplam Tahmini Kazanç</Text>
          </View>
          <Text style={styles.heroValue}>{formatCurrency(fund.total)}</Text>
          <Text style={styles.heroSubtext}>Bu ay: {formatCurrency(fund.monthly)}</Text>
          <View style={styles.ringWrap}>
            <ProgressRing
              progress={ringProgress}
              color={colors.secondary[500]}
              label={`${Math.round(ringProgress * 100)}%`}
              sublabel="hedefe ulaş"
              size={120}
            />
          </View>
          <Text style={styles.goalText}>Hedef: {formatCurrency(goal)}</Text>
        </Card>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            * Ekonomik hesaplamalar tahmini olarak yapılmaktadır. Gerçi günlük harcama alışkanlıklarına göre hesaplanır.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Bağımlılık Bazında</Text>
        {progressList.map((p) => {
          const Icon = ICONS[p.addictionType];
          const byFund = fund.byAddiction.find((b) => b.addictionType === p.addictionType);
          const addiction = addictions.find((a) => a.addictionType === p.addictionType);
          const totalDays = addiction ? daysSince(addiction.startDate) : 0;
          return (
            <Card key={p.addictionType}>
              <View style={styles.fundRow}>
                <View style={[styles.fundIcon, { backgroundColor: colors.secondary[50] }]}>
                  <Icon size={20} color={colors.secondary[600]} strokeWidth={2} />
                </View>
                <View style={styles.fundInfo}>
                  <Text style={styles.fundLabel}>{ADDICTION_LABELS[p.addictionType]}</Text>
                  <Text style={styles.fundDays}>{totalDays} gün • {formatCurrency(addiction?.dailyCost ?? 0)}/gün</Text>
                </View>
                <View style={styles.fundAmount}>
                  <Text style={styles.fundAmountValue}>{formatCurrency(byFund?.total ?? 0)}</Text>
                  <Text style={styles.fundAmountSub}>aylık {formatCurrency(byFund?.monthly ?? 0)}</Text>
                </View>
              </View>
            </Card>
          );
        })}

        <Card style={styles.motivationCard}>
          <TrendingUp size={24} color={colors.secondary[600]} strokeWidth={2} />
          <Text style={styles.motivationTitle}>Kendine yatırım fırsatı</Text>
          <Text style={styles.motivationText}>
            Biriktirdiğin bu tutarla kendine yatırım yapabilirsin: bir kurs, bir seyahat veya sağlığına bir hediye.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  topTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  heroCard: { backgroundColor: colors.secondary[600], alignItems: 'center', gap: 8 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.neutral[0], alignItems: 'center', justifyContent: 'center' },
  heroLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.neutral[0] },
  heroValue: { fontSize: fontSizes.hero, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  heroSubtext: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.secondary[100] },
  ringWrap: { marginVertical: spacing.lg },
  goalText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.secondary[100] },
  disclaimerBox: { backgroundColor: colors.neutral[100], borderRadius: radius.md, padding: spacing.md },
  disclaimerText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500], lineHeight: 16 },
  sectionTitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[900], marginTop: spacing.sm, marginBottom: spacing.xs },
  fundRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  fundIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  fundInfo: { flex: 1 },
  fundLabel: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  fundDays: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
  fundAmount: { alignItems: 'flex-end' },
  fundAmountValue: { fontSize: fontSizes.lg, fontFamily: fontFamilies.bold, color: colors.secondary[700] },
  fundAmountSub: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400], marginTop: 2 },
  motivationCard: { flexDirection: 'column', alignItems: 'center', gap: 8, backgroundColor: colors.secondary[50], borderWidth: 1, borderColor: colors.secondary[100] },
  motivationTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.secondary[700] },
  motivationText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[600], textAlign: 'center', lineHeight: 20 },
});
