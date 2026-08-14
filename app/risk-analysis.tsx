import { useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { RiskBadge } from '@/src/components/RiskBadge';
import { ProgressRing } from '@/src/components/ProgressRing';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { useRiskStore } from '@/src/store/riskStore';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { assessRisk } from '@/src/services/ai/riskEngine';
import { buildRecommendationFromRisk } from '@/src/services/ai/recommendationEngine';
import { ADDICTION_LABELS, MOOD_LABELS, TRIGGER_LABELS, RISK_DISCLAIMER } from '@/src/constants';
import type { AddictionType, Mood, Trigger } from '@/src/types';
import { X, Brain, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react-native';

const ADDICTION_TYPES: AddictionType[] = ['smoking', 'alcohol', 'gambling', 'substance'];
const MOODS: Mood[] = ['good', 'normal', 'stressed', 'sad', 'angry', 'anxious'];
const TRIGGERS: Trigger[] = ['stress', 'loneliness', 'social', 'boredom', 'anger', 'financial', 'habit', 'environment', 'other'];

export default function RiskAnalysisScreen() {
  const router = useRouter();
  const latestRisk = useRiskStore((s) => s.latestScore);
  const logs = useDailyLogStore((s) => s.logs);

  const [craving, setCraving] = useState(5);
  const [mood, setMood] = useState<Mood>('normal');
  const [trigger, setTrigger] = useState<Trigger>('stress');
  const [addictionType, setAddictionType] = useState<AddictionType>('smoking');
  const [sleep, setSleep] = useState(5);
  const [recentRelapse, setRecentRelapse] = useState(false);
  const [result, setResult] = useState(latestRisk ? {
    riskScore: latestRisk.score,
    level: latestRisk.riskLevel,
    reasons: latestRisk.reasons,
    recommendations: latestRisk.recommendations,
  } : null);

  const handleAssess = () => {
    const hour = new Date().getHours();
    const r = assessRisk({
      addictionType,
      cravingIntensity: craving,
      mood,
      hour,
      trigger,
      recentRelapse,
      sleepQuality: sleep,
    });
    setResult(r);
  };

  const recommendation = useMemo(
    () => (result ? buildRecommendationFromRisk(result) : ''),
    [result],
  );

  const ringProgress = result ? result.riskScore / 100 : 0;
  const ringColor = result?.level === 'high' ? colors.danger[500] : result?.level === 'moderate' ? colors.warning[500] : colors.secondary[500];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>AI Risk Analizi</Text>
        <Pressable onPress={() => router.back()} accessibilityLabel="Kapat">
          <X size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.disclaimer}>
          <AlertCircle size={16} color={colors.warning[600]} strokeWidth={2} />
          <Text style={styles.disclaimerText}>{RISK_DISCLAIMER}</Text>
        </View>

        {result && (
          <Card style={styles.resultCard}>
            <View style={styles.resultTop}>
              <ProgressRing
                progress={ringProgress}
                color={ringColor}
                label={String(result.riskScore)}
                sublabel="risk skoru"
                size={140}
              />
              <View style={styles.resultInfo}>
                <RiskBadge level={result.level} size="md" />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            </View>
          </Card>
        )}

        {result && (
          <Card>
            <View style={styles.sectionHeader}>
              <Brain size={18} color={colors.primary[600]} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Risk Nedenleri</Text>
            </View>
            {result.reasons.map((r, i) => (
              <View key={i} style={styles.reasonRow}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>{r}</Text>
              </View>
            ))}
          </Card>
        )}

        {result && (
          <Card>
            <View style={styles.sectionHeader}>
              <Lightbulb size={18} color={colors.secondary[600]} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Öneriler</Text>
            </View>
            {result.recommendations.map((r, i) => (
              <View key={i} style={styles.reasonRow}>
                <View style={[styles.reasonDot, { backgroundColor: colors.secondary[500] }]} />
                <Text style={styles.reasonText}>{r}</Text>
              </View>
            ))}
          </Card>
        )}

        <Card>
          <View style={styles.sectionHeader}>
            <RefreshCw size={18} color={colors.primary[600]} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Yeni Değerlendirme</Text>
          </View>
          <Text style={styles.fieldLabel}>Bağımlılık</Text>
          <View style={styles.chipRow}>
            {ADDICTION_TYPES.map((t) => (
              <Chip key={t} label={ADDICTION_LABELS[t]} selected={addictionType === t} onPress={() => setAddictionType(t)} />
            ))}
          </View>
          <Text style={styles.fieldLabel}>Dürtü: {craving}/10</Text>
          <View style={styles.sliderRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Pressable key={n} onPress={() => setCraving(n)} style={[styles.sliderDot, n <= craving && { backgroundColor: colors.primary[600] }]}>
                <Text style={[styles.sliderText, n <= craving && { color: colors.neutral[0] }]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.fieldLabel}>Ruh Hali</Text>
          <View style={styles.chipRow}>
            {MOODS.map((m) => (
              <Chip key={m} label={MOOD_LABELS[m]} selected={mood === m} onPress={() => setMood(m)} />
            ))}
          </View>
          <Text style={styles.fieldLabel}>Tetikleyici</Text>
          <View style={styles.chipRow}>
            {TRIGGERS.map((t) => (
              <Chip key={t} label={TRIGGER_LABELS[t]} selected={trigger === t} onPress={() => setTrigger(t)} />
            ))}
          </View>
          <Text style={styles.fieldLabel}>Uyku Kalitesi: {sleep}/10</Text>
          <View style={styles.sliderRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Pressable key={n} onPress={() => setSleep(n)} style={[styles.sliderDot, n <= sleep && { backgroundColor: colors.accent[500] }]}>
                <Text style={[styles.sliderText, n <= sleep && { color: colors.neutral[0] }]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => setRecentRelapse(!recentRelapse)} style={({ pressed }) => [styles.relapseRow, pressed && { opacity: 0.85 }]}>
            <View style={[styles.checkbox, recentRelapse && styles.checkboxChecked]} />
            <Text style={styles.relapseText}>Yakın zamanda nüks yaşadım</Text>
          </Pressable>
          <Button title="Risk Skorunu Hesapla" onPress={handleAssess} size="lg" style={styles.assessBtn} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && { opacity: 0.85 }]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  topTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  disclaimer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.warning[50], borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  disclaimerText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.medium, color: colors.warning[700] },
  resultCard: { alignItems: 'center' },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  resultInfo: { flex: 1, gap: spacing.sm },
  recommendationText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[600], lineHeight: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: 6 },
  reasonDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary[500], marginTop: 6 },
  reasonText: { flex: 1, fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[700], lineHeight: 20 },
  fieldLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[700], marginTop: spacing.sm, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.neutral[100], borderWidth: 1.5, borderColor: colors.neutral[200] },
  chipSelected: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
  chipText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.medium, color: colors.neutral[700] },
  chipTextSelected: { color: colors.neutral[0] },
  sliderRow: { flexDirection: 'row', gap: 4, justifyContent: 'space-between' },
  sliderDot: { width: 28, height: 32, borderRadius: 6, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.neutral[200] },
  sliderText: { fontSize: 10, fontFamily: fontFamilies.semibold, color: colors.neutral[500] },
  relapseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.neutral[300] },
  checkboxChecked: { backgroundColor: colors.danger[500], borderColor: colors.danger[500] },
  relapseText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[700] },
  assessBtn: { marginTop: spacing.lg },
});
