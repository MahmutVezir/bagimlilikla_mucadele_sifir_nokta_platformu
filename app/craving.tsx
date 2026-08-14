import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { CRISIS_MESSAGE, BREATHING_PHASES, ATTENTION_TASKS, SUPPORT_CONTACTS } from '@/src/constants';
import { X, Wind, CheckCircle2, ArrowRight, Phone, Heart, MapPin } from 'lucide-react-native';

type Phase = 'intro' | 'breathing' | 'attention' | 'support' | 'done';

export default function CravingScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [breathScale] = useState(new Animated.Value(1));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.phaseLabel}>
          {phase === 'intro' ? 'Acil Durum Kalkanı' :
           phase === 'breathing' ? 'Aşama 1: Nefes' :
           phase === 'attention' ? 'Aşama 2: Dikkatini Değiştir' :
           phase === 'support' ? 'Aşama 3: Destek' : 'Tamamlandı'}
        </Text>
        <Pressable onPress={() => router.back()} accessibilityLabel="Kapat">
          <X size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
      </View>

      {phase === 'intro' && <IntroPhase onStart={() => setPhase('breathing')} />}
      {phase === 'breathing' && (
        <BreathingPhase
          breathScale={breathScale}
          onComplete={() => setPhase('attention')}
        />
      )}
      {phase === 'attention' && (
        <AttentionPhase
          selectedTask={selectedTask}
          onSelect={setSelectedTask}
          onComplete={() => setPhase('support')}
        />
      )}
      {phase === 'support' && (
        <SupportPhase
          onComplete={() => {
            setPhase('done');
          }}
        />
      )}
      {phase === 'done' && <DonePhase onClose={() => router.back()} />}
    </SafeAreaView>
  );
}

function IntroPhase({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.phaseContent}>
      <View style={styles.shieldIcon}>
        <Wind size={48} color={colors.primary[600]} strokeWidth={1.5} />
      </View>
      <Text style={styles.introTitle}>Acil Durum Kalkanı</Text>
      <Text style={styles.introMessage}>{CRISIS_MESSAGE}</Text>
      <Text style={styles.introSteps}>3 aşamalı 90 saniyelik müdahale:</Text>
      <View style={styles.stepsRow}>
        {['Nefes', 'Dikkat', 'Destek'].map((s, i) => (
          <View key={s} style={styles.stepChip}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>
      <Button title="Başla" onPress={onStart} size="lg" style={styles.fullButton} />
    </View>
  );
}

function BreathingPhase({
  breathScale,
  onComplete,
}: {
  breathScale: Animated.Value;
  onComplete: () => void;
}) {
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(BREATHING_PHASES[0].duration);
  const [cycles, setCycles] = useState<number>(0);

  useEffect(() => {
    if (secondsLeft <= 0) {
      const nextIndex = (phaseIndex + 1) % BREATHING_PHASES.length;
      if (nextIndex === 0) setCycles((c) => c + 1);
      setPhaseIndex(nextIndex);
      setSecondsLeft(BREATHING_PHASES[nextIndex].duration);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, phaseIndex]);

  useEffect(() => {
    const current = BREATHING_PHASES[phaseIndex];
    const targetScale = current.name === 'Nefes Al' ? 1.5 : current.name === 'Ver' ? 0.7 : 1.2;
    Animated.timing(breathScale, {
      toValue: targetScale,
      duration: current.duration * 1000,
      useNativeDriver: false,
    }).start();
  }, [phaseIndex, breathScale]);

  const currentPhase = BREATHING_PHASES[phaseIndex];
  const totalSeconds = cycles * BREATHING_PHASES.reduce((s, p) => s + p.duration, 0) +
    BREATHING_PHASES.slice(0, phaseIndex).reduce((s, p) => s + p.duration, 0) +
    (currentPhase.duration - secondsLeft);

  return (
    <View style={styles.phaseContent}>
      <Text style={styles.breathInstruction}>{currentPhase.instruction}</Text>
      <View style={styles.breathCircleOuter}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              transform: [{ scale: breathScale }],
              backgroundColor: currentPhase.name === 'Nefes Al' ? colors.primary[400] :
                currentPhase.name === 'Tut' ? colors.primary[600] : colors.primary[300],
            },
          ]}
        />
        <View style={styles.breathCounter}>
          <Text style={styles.breathCount}>{secondsLeft}</Text>
          <Text style={styles.breathPhase}>{currentPhase.name}</Text>
        </View>
      </View>
      <Text style={styles.cycleText}>{cycles + 1}. döngü</Text>
      <Text style={styles.elapsedText}>Geçen süre: {totalSeconds}s / 90s</Text>
      {totalSeconds >= 90 || cycles >= 3 ? (
        <Button title="Devam Et" onPress={onComplete} size="lg" style={styles.fullButton} />
      ) : (
        <Button title="Nefesi Erken Bitir" onPress={onComplete} variant="ghost" size="md" />
      )}
    </View>
  );
}

function AttentionPhase({
  selectedTask,
  onSelect,
  onComplete,
}: {
  selectedTask: string | null;
  onSelect: (id: string) => void;
  onComplete: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.phaseContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.attentionTitle}>Dikkatini değiştir</Text>
      <Text style={styles.attentionSubtitle}>Bir görev seç ve uygula. Dürtünün geçişine yardım et.</Text>
      <View style={styles.taskList}>
        {ATTENTION_TASKS.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => onSelect(task.id)}
            style={({ pressed }) => [
              styles.taskCard,
              selectedTask === task.id && styles.taskCardSelected,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={styles.taskRadio}>
              {selectedTask === task.id && <View style={styles.taskRadioFill} />}
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>{task.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Button
        title="Görevi Tamamladım"
        onPress={onComplete}
        disabled={!selectedTask}
        size="lg"
        style={styles.fullButton}
        icon={selectedTask ? <CheckCircle2 size={20} color={colors.neutral[0]} strokeWidth={2} /> : undefined}
      />
    </ScrollView>
  );
}

function SupportPhase({ onComplete }: { onComplete: () => void }) {
  return (
    <View style={styles.phaseContent}>
      <Text style={styles.attentionTitle}>Destek</Text>
      <Text style={styles.attentionSubtitle}>Yalnız değilsin. Birine ulaş.</Text>
      <View style={styles.supportButtons}>
        <Pressable style={({ pressed }) => [styles.supportCard, pressed && { opacity: 0.9 }]}>
          <View style={[styles.supportIcon, { backgroundColor: colors.secondary[50] }]}>
            <Heart size={22} color={colors.secondary[600]} strokeWidth={2} />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Destek kişimi ara</Text>
            <Text style={styles.supportDesc}>Güvendiğin bir yakınını ara.</Text>
          </View>
          <ArrowRight size={18} color={colors.neutral[400]} strokeWidth={2} />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.supportCard, pressed && { opacity: 0.9 }]}>
          <View style={[styles.supportIcon, { backgroundColor: colors.primary[50] }]}>
            <Phone size={22} color={colors.primary[600]} strokeWidth={2} />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>115 hakkında bilgi al</Text>
            <Text style={styles.supportDesc}>{SUPPORT_CONTACTS.yedam.description}</Text>
          </View>
          <ArrowRight size={18} color={colors.neutral[400]} strokeWidth={2} />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.supportCard, pressed && { opacity: 0.9 }]}>
          <View style={[styles.supportIcon, { backgroundColor: colors.warning[50] }]}>
            <MapPin size={22} color={colors.warning[600]} strokeWidth={2} />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>YEDAM'a ulaş</Text>
            <Text style={styles.supportDesc}>Yakındaki destek merkezlerini gör.</Text>
          </View>
          <ArrowRight size={18} color={colors.neutral[400]} strokeWidth={2} />
        </Pressable>
      </View>
      <Button title="Müdahaleyi Tamamla" onPress={onComplete} size="lg" style={styles.fullButton} />
    </View>
  );
}

function DonePhase({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.phaseContent}>
      <View style={styles.doneIcon}>
        <CheckCircle2 size={56} color={colors.secondary[500]} strokeWidth={1.5} />
      </View>
      <Text style={styles.doneTitle}>90 saniyeyi atladın!</Text>
      <Text style={styles.doneMessage}>
        Bu dürtüyü yönetmeyi başardın. Her seferinde bir adım daha güçleniyorsun.
      </Text>
      <Button title="Ana ekrana dön" onPress={onClose} size="lg" style={styles.fullButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  phaseLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[600] },
  phaseContent: { flex: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  shieldIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  introTitle: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.primary[700] },
  introMessage: { fontSize: fontSizes.lg, fontFamily: fontFamilies.regular, color: colors.neutral[600], textAlign: 'center', lineHeight: 26 },
  introSteps: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.neutral[500], marginTop: spacing.md },
  stepsRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.lg },
  stepChip: { alignItems: 'center', gap: 6 },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary[600], alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  stepText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.medium, color: colors.neutral[700] },
  fullButton: { width: '100%', marginTop: spacing.md },
  breathInstruction: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.semibold, color: colors.primary[700] },
  breathCircleOuter: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.lg },
  breathCircle: { width: 160, height: 160, borderRadius: 80, opacity: 0.3 },
  breathCounter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  breathCount: { fontSize: fontSizes.hero, fontFamily: fontFamilies.bold, color: colors.primary[700] },
  breathPhase: { fontSize: fontSizes.md, fontFamily: fontFamilies.medium, color: colors.neutral[600], marginTop: 4 },
  cycleText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.neutral[500] },
  elapsedText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400] },
  attentionTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  attentionSubtitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[500], textAlign: 'center', marginBottom: spacing.lg },
  taskList: { width: '100%', gap: spacing.md },
  taskCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.lg, borderWidth: 2, borderColor: colors.neutral[200] },
  taskCardSelected: { borderColor: colors.primary[600], backgroundColor: colors.primary[50] },
  taskRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.neutral[300], alignItems: 'center', justifyContent: 'center' },
  taskRadioFill: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary[600] },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  taskDesc: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
  supportButtons: { width: '100%', gap: spacing.md },
  supportCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.neutral[100] },
  supportIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  supportInfo: { flex: 1 },
  supportTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  supportDesc: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
  doneIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.secondary[50], alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  doneTitle: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.secondary[700] },
  doneMessage: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[600], textAlign: 'center', lineHeight: 24 },
});
