import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text, TextInput } from 'react-native';
import { Button } from '@/src/components/Button';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Card } from '@/src/components/Card';
import { useAuthStore } from '@/src/store/authStore';
import { useDailyLogStore } from '@/src/store/dailyLogStore';
import { useRiskStore } from '@/src/store/riskStore';
import { assessRisk } from '@/src/services/ai/riskEngine';
import { insertDailyLog, insertRiskScore } from '@/src/services/dataService';
import {
  ADDICTION_LABELS,
  MOOD_LABELS,
  MOOD_EMOJI,
  TRIGGER_LABELS,
} from '@/src/constants';
import type { AddictionType, Mood, Trigger } from '@/src/types';
import { X } from 'lucide-react-native';
import { useAchievementStore } from '@/src/store/achievementStore';

const ADDICTION_TYPES: AddictionType[] = ['smoking', 'alcohol', 'gambling', 'substance'];
const MOODS: Mood[] = ['good', 'normal', 'stressed', 'sad', 'angry', 'anxious'];
const TRIGGERS: Trigger[] = ['stress', 'loneliness', 'social', 'boredom', 'anger', 'financial', 'habit', 'environment', 'other'];

export default function DailyLogScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addictions = useAuthStore((s) => s.addictions);
  const addLog = useDailyLogStore((s) => s.addLog);
  const addScore = useRiskStore((s) => s.addScore);
  const unlockAchievement = useAchievementStore((s) => s.unlock);

  const activeTypes = addictions.length > 0 ? addictions.map((a) => a.addictionType) : ADDICTION_TYPES;

  const [addictionType, setAddictionType] = useState<AddictionType>(activeTypes[0]);
  const [craving, setCraving] = useState(5);
  const [mood, setMood] = useState<Mood>('normal');
  const [trigger, setTrigger] = useState<Trigger>('stress');
  const [usage, setUsage] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const now = new Date().toISOString();
    const logId = `log-${Date.now()}`;
    const newLog = {
      id: logId,
      userId: user.id,
      addictionType,
      cravingIntensity: craving,
      mood,
      trigger,
      usageOccurred: usage,
      note: note.trim() || undefined,
      createdAt: now,
    };

    addLog(newLog);
    setSaving(false);
    setSaved(true);
    unlockAchievement('10_logs');

    const hour = new Date().getHours();
    const riskResult = assessRisk({
      addictionType,
      cravingIntensity: craving,
      mood,
      hour,
      trigger,
      recentRelapse: usage,
      sleepQuality: 5,
    });

    const riskId = `risk-${Date.now()}`;
    addScore({
      id: riskId,
      userId: user.id,
      score: riskResult.riskScore,
      riskLevel: riskResult.level,
      reasons: riskResult.reasons,
      recommendations: riskResult.recommendations,
      createdAt: now,
    });

    insertDailyLog({
      userId: user.id,
      addictionType,
      cravingIntensity: craving,
      mood,
      trigger,
      usageOccurred: usage,
      note: note.trim() || undefined,
    }).catch(() => {});
    insertRiskScore({
      userId: user.id,
      score: riskResult.riskScore,
      riskLevel: riskResult.level,
      reasons: riskResult.reasons,
      recommendations: riskResult.recommendations,
    }).catch(() => {});

    setTimeout(() => {
      router.replace('/risk-analysis');
    }, 800);
  };

  if (saved) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.savedWrap}>
          <Text style={styles.savedEmoji}>✓</Text>
          <Text style={styles.savedTitle}>Kaydın oluşturuldu</Text>
          <Text style={styles.savedMsg}>
            {usage
              ? 'Bugünkü kayıt başarısızlık değil. Sana hangi durumların zor geldiğini anlamamız için yeni bir veri sağlıyor.'
              : 'Kendin için bir adım daha attın. İlerlemeni sürdür.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Günlük Kayıt</Text>
        <Pressable onPress={() => router.back()} accessibilityLabel="Kapat">
          <X size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.fieldLabel}>Bağımlılık Türü</Text>
          <View style={styles.chipRow}>
            {activeTypes.map((type) => (
              <Chip key={type} label={ADDICTION_LABELS[type]} selected={addictionType === type} onPress={() => setAddictionType(type)} />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Dürtü Yoğunluğu: {craving}/10</Text>
          <View style={styles.sliderWrap}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Pressable
                key={n}
                onPress={() => setCraving(n)}
                style={[styles.sliderDot, n <= craving && { backgroundColor: craving >= 7 ? colors.danger[500] : craving >= 4 ? colors.warning[500] : colors.secondary[500] }]}
                accessibilityLabel={`Dürtü yoğunluğu ${n}`}
              >
                <Text style={[styles.sliderText, n <= craving && { color: colors.neutral[0] }]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Ruh Hali</Text>
          <View style={styles.chipRow}>
            {MOODS.map((m) => (
              <Chip key={m} label={`${MOOD_EMOJI[m]} ${MOOD_LABELS[m]}`} selected={mood === m} onPress={() => setMood(m)} />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Tetikleyici</Text>
          <View style={styles.chipRow}>
            {TRIGGERS.map((t) => (
              <Chip key={t} label={TRIGGER_LABELS[t]} selected={trigger === t} onPress={() => setTrigger(t)} />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Bugün kullanım oldu mu?</Text>
          <View style={styles.usageRow}>
            <Pressable
              onPress={() => setUsage(false)}
              style={({ pressed }) => [styles.usageBtn, !usage && styles.usageBtnActive, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.usageBtnText, !usage && styles.usageBtnTextActive]}>Hayır</Text>
            </Pressable>
            <Pressable
              onPress={() => setUsage(true)}
              style={({ pressed }) => [styles.usageBtn, usage && styles.usageBtnActiveWarn, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.usageBtnText, usage && styles.usageBtnTextActive]}>Evet</Text>
            </Pressable>
          </View>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Not (isteğe bağlı)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Bugün nasıl hissettin? Ne oldu?"
            placeholderTextColor={colors.neutral[400]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            accessibilityLabel="Not"
          />
        </Card>

        <Button title="Kaydet" onPress={handleSave} loading={saving} size="lg" style={styles.saveBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  topTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  fieldLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[700], marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.neutral[100], borderWidth: 1.5, borderColor: colors.neutral[200] },
  chipSelected: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
  chipText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.neutral[700] },
  chipTextSelected: { color: colors.neutral[0] },
  sliderWrap: { flexDirection: 'row', gap: 4, justifyContent: 'space-between' },
  sliderDot: { width: 30, height: 36, borderRadius: 8, backgroundColor: colors.neutral[100], alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.neutral[200] },
  sliderText: { fontSize: 11, fontFamily: fontFamilies.semibold, color: colors.neutral[500] },
  usageRow: { flexDirection: 'row', gap: spacing.md },
  usageBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.neutral[100], borderWidth: 2, borderColor: colors.neutral[200], alignItems: 'center' },
  usageBtnActive: { backgroundColor: colors.secondary[500], borderColor: colors.secondary[500] },
  usageBtnActiveWarn: { backgroundColor: colors.warning[400], borderColor: colors.warning[400] },
  usageBtnText: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[600] },
  usageBtnTextActive: { color: colors.neutral[0] },
  noteInput: { borderWidth: 1.5, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[900], minHeight: 80, backgroundColor: colors.neutral[0] },
  saveBtn: { marginTop: spacing.sm },
  savedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: 16 },
  savedEmoji: { fontSize: 56 },
  savedTitle: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.secondary[700] },
  savedMsg: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[600], textAlign: 'center', lineHeight: 24 },
});
