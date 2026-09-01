import { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Card } from '@/src/components/Card';
import { BarChart } from '@/src/components/BarChart';
import { SectionTitle } from '@/src/components/SectionTitle';
import { useAuthStore } from '@/src/store/authStore';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { calculateAverageIntensity, calculateAddictionProgress, calculateFreedomFund, formatCurrency } from '@/src/utils/calculations';
import { ADDICTION_LABELS, TRIGGER_LABELS } from '@/src/constants';
import { analyzeTriggerRadar } from '@/src/services/ai/recommendationEngine';
import { Plus, Trophy, Clock, Zap, Wallet } from 'lucide-react-native';

export default function TrackScreen() {
  const router = useRouter();
  const addictions = useAuthStore((s) => s.addictions);
  const logs = useDailyLogStore((s) => s.logs);

  const avgIntensity = useMemo(() => calculateAverageIntensity(logs), [logs]);
  const radar = useMemo(() => analyzeTriggerRadar(logs), [logs]);
  const progressList = useMemo(() => addictions.map((a) => calculateAddictionProgress(a, logs)), [addictions, logs]);
  const fund = useMemo(() => calculateFreedomFund(addictions, logs), [addictions, logs]);
  const totalCleanDays = Math.max(...progressList.map((p) => p.cleanDays), 0);
  const relapseCount = logs.filter((l) => l.usageOccurred).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Takip" subtitle="İstatistiklerin ve ilerlemen" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalCleanDays}</Text>
            <Text style={styles.statLabel}>Temiz Gün</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{avgIntensity}</Text>
            <Text style={styles.statLabel}>Dürtü Ort.</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{logs.length}</Text>
            <Text style={styles.statLabel}>Kayıt</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warning[600] }]}>{relapseCount}</Text>
            <Text style={styles.statLabel}>Nüks</Text>
          </Card>
        </View>

        <SectionTitle title="Haftalık Dürtü Grafiği" subtitle="Son 7 gün ortalamalar" />
        <Card>
          <BarChart
            data={radar.weeklyTrend.map((d) => ({ label: d.day, value: d.avgIntensity }))}
            maxValue={10}
            color={colors.primary[500]}
          />
        </Card>

        <SectionTitle title="En Riskli Saatler" />
        <Card>
          {radar.riskiestHours.length > 0 ? (
            radar.riskiestHours.map((h, i) => (
              <View key={i} style={styles.radarRow}>
                <View style={[styles.rankDot, { backgroundColor: i === 0 ? colors.danger[500] : i === 1 ? colors.warning[500] : colors.primary[400] }]}>
                  <Text style={styles.rankText}>{i + 1}</Text>
                </View>
                <Text style={styles.radarLabel}>{h.hour}</Text>
                <Text style={styles.radarValue}>{h.avgIntensity}/10</Text>
                <Text style={styles.radarCount}>{h.count} kayıt</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Henüz veri yok</Text>
          )}
        </Card>

        <SectionTitle title="En Sık Tetikleyiciler" />
        <Card>
          {radar.topTriggers.length > 0 ? (
            radar.topTriggers.map((t, i) => (
              <View key={i} style={styles.radarRow}>
                <View style={[styles.rankDot, { backgroundColor: colors.primary[500] }]}>
                  <Zap size={14} color={colors.neutral[0]} strokeWidth={2} />
                </View>
                <Text style={styles.radarLabel}>{t.trigger}</Text>
                <Text style={styles.radarValue}>{t.avgIntensity}/10</Text>
                <Text style={styles.radarCount}>{t.count}x</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Henüz veri yok</Text>
          )}
        </Card>

        <SectionTitle title="Bağımlılık Bazında" />
        {progressList.map((p) => (
          <Card key={p.addictionType}>
            <Text style={styles.progressTitle}>{ADDICTION_LABELS[p.addictionType]}</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>{p.cleanDays}</Text>
                <Text style={styles.progressLabel}>temiz gün</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>{formatCurrency(p.estimatedSavings)}</Text>
                <Text style={styles.progressLabel}>tasarruf</Text>
              </View>
            </View>
          </Card>
        ))}

        <Pressable
          onPress={() => router.push('/achievements')}
          style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.actionIcon}>
            <Trophy size={22} color={colors.warning[600]} strokeWidth={2} />
          </View>
          <Text style={styles.actionLabel}>Başarımlar</Text>
          <Text style={styles.actionArrow}>→</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/freedom-fund')}
          style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.9 }]}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.secondary[50] }]}>
            <Wallet size={22} color={colors.secondary[600]} strokeWidth={2} />
          </View>
          <Text style={styles.actionLabel}>Özgürlük Fonu</Text>
          <Text style={[styles.actionArrow, { color: colors.secondary[600] }]}>{formatCurrency(fund.total)}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: { flex: 1, minWidth: '47%', alignItems: 'center', gap: 4 },
  statValue: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.primary[700] },
  statLabel: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500] },
  radarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  rankDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 12, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  radarLabel: { flex: 1, fontSize: fontSizes.md, fontFamily: fontFamilies.medium, color: colors.neutral[800] },
  radarValue: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[600] },
  radarCount: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400] },
  emptyText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[400], textAlign: 'center', paddingVertical: spacing.md },
  progressTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900], marginBottom: spacing.sm },
  progressRow: { flexDirection: 'row', gap: spacing.lg },
  progressItem: { flex: 1 },
  progressValue: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.primary[700] },
  progressLabel: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.neutral[100] },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.warning[50], alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  actionArrow: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[400] },
});
