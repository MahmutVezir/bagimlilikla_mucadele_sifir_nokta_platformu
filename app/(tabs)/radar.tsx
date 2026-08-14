import { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Card } from '@/src/components/Card';
import { SectionTitle } from '@/src/components/SectionTitle';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { analyzeTriggerRadar } from '@/src/services/ai/recommendationEngine';
import { Radar as RadarIcon, AlertTriangle, Info, Clock, Calendar, Zap, TrendingDown } from 'lucide-react-native';

export default function RadarScreen() {
  const router = useRouter();
  const logs = useDailyLogStore((s) => s.logs);
  const radar = useMemo(() => analyzeTriggerRadar(logs), [logs]);

  const hasData = logs.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Tetikleyici Radar" subtitle="Kayıtlarından çıkan farkındalık" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!hasData && (
          <Card style={styles.emptyCard}>
            <RadarIcon size={40} color={colors.neutral[300]} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Henüz radar verisi yok</Text>
            <Text style={styles.emptyMsg}>Günlük kayıt oluşturdukça tetikleyici analizlerin burada görünecek.</Text>
          </Card>
        )}

        {radar.insights.length > 0 && (
          <>
            <SectionTitle title="Farkındalık İçgörüleri" subtitle="Sistem tarafından oluşturulan analizler" />
            {radar.insights.map((insight, i) => (
              <Card key={i} style={[styles.insightCard, insight.severity === 'warning' ? styles.insightWarning : styles.insightInfo]}>
                <View style={[styles.insightIcon, { backgroundColor: insight.severity === 'warning' ? colors.warning[50] : colors.primary[50] }]}>
                  {insight.severity === 'warning' ? (
                    <AlertTriangle size={20} color={colors.warning[600]} strokeWidth={2} />
                  ) : (
                    <Info size={20} color={colors.primary[600]} strokeWidth={2} />
                  )}
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDesc}>{insight.description}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {radar.riskiestDays.length > 0 && (
          <>
            <SectionTitle title="Riskli Günler" />
            <Card>
              {radar.riskiestDays.map((d, i) => (
                <View key={i} style={styles.radarRow}>
                  <View style={[styles.rankDot, { backgroundColor: i === 0 ? colors.danger[500] : colors.warning[500] }]}>
                    <Calendar size={14} color={colors.neutral[0]} strokeWidth={2} />
                  </View>
                  <Text style={styles.radarLabel}>{d.day}</Text>
                  <Text style={styles.radarValue}>{d.avgIntensity}/10</Text>
                  <Text style={styles.radarCount}>{d.count} kayıt</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {radar.riskiestHours.length > 0 && (
          <>
            <SectionTitle title="Riskli Saatler" />
            <Card>
              {radar.riskiestHours.map((h, i) => (
                <View key={i} style={styles.radarRow}>
                  <View style={[styles.rankDot, { backgroundColor: colors.primary[500] }]}>
                    <Clock size={14} color={colors.neutral[0]} strokeWidth={2} />
                  </View>
                  <Text style={styles.radarLabel}>{h.hour}</Text>
                  <Text style={styles.radarValue}>{h.avgIntensity}/10</Text>
                  <Text style={styles.radarCount}>{h.count} kayıt</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {radar.topTriggers.length > 0 && (
          <>
            <SectionTitle title="En Sık Tetikleyiciler" />
            <Card>
              {radar.topTriggers.map((t, i) => (
                <View key={i} style={styles.radarRow}>
                  <View style={[styles.rankDot, { backgroundColor: colors.accent[500] }]}>
                    <Zap size={14} color={colors.neutral[0]} strokeWidth={2} />
                  </View>
                  <Text style={styles.radarLabel}>{t.trigger}</Text>
                  <Text style={styles.radarValue}>{t.avgIntensity}/10</Text>
                  <Text style={styles.radarCount}>{t.count}x</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {hasData && (
          <Card style={styles.aiNoteCard}>
            <TrendingDown size={20} color={colors.primary[600]} strokeWidth={2} />
            <Text style={styles.aiNoteText}>
              Bu analizler geçmiş kayıtlarından otomatik oluşturulmuştur. Düzenli kayıt oluşturdukça analizler daha doğru hale gelir.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  emptyCard: { alignItems: 'center', gap: 12, padding: spacing.xxl },
  emptyTitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[700] },
  emptyMsg: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[400], textAlign: 'center', lineHeight: 20 },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  insightWarning: { backgroundColor: colors.warning[50], borderWidth: 1, borderColor: colors.warning[100] },
  insightInfo: { backgroundColor: colors.primary[50], borderWidth: 1, borderColor: colors.primary[100] },
  insightIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  insightDesc: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[600], marginTop: 4, lineHeight: 20 },
  radarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  rankDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  radarLabel: { flex: 1, fontSize: fontSizes.md, fontFamily: fontFamilies.medium, color: colors.neutral[800] },
  radarValue: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[600] },
  radarCount: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400] },
  aiNoteCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primary[50], borderWidth: 1, borderColor: colors.primary[100] },
  aiNoteText: { flex: 1, fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[600], lineHeight: 18 },
});
