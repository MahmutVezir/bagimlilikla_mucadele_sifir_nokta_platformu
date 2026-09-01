import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Button } from '@/src/components/Button';
import { useAuthStore } from '@/src/store/authStore';
import { ADDICTION_LABELS } from '@/src/constants';
import { ESTIMATED_DAILY_COSTS } from '@/src/constants';
import type { AddictionType } from '@/src/types';
import { Cigarette, Wine, Dices, Pill, Check } from 'lucide-react-native';

const ADDICTION_ICONS: Record<AddictionType, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  smoking: Cigarette,
  alcohol: Wine,
  gambling: Dices,
  substance: Pill,
};

const ALL_ADDICTIONS: AddictionType[] = ['smoking', 'alcohol', 'gambling', 'substance'];

export default function AddictionSelectScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAddictions = useAuthStore((s) => s.setAddictions);
  const [selected, setSelected] = useState<Set<AddictionType>>(new Set());

  const toggle = (type: AddictionType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleContinue = () => {
    const addictions = Array.from(selected).map((type, i) => ({
      id: `ua-${Date.now()}-${i}`,
      userId: user?.id ?? 'demo',
      addictionType: type,
      startDate: new Date().toISOString(),
      dailyCost: ESTIMATED_DAILY_COSTS[type],
    }));
    setAddictions(addictions);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hangi bağımlılıkla mücadele ediyorsun?</Text>
        <Text style={styles.subtitle}>Birden fazla seçebilirsin. Daha sonra değiştirebilirsin.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {ALL_ADDICTIONS.map((type) => {
          const Icon = ADDICTION_ICONS[type];
          const isSelected = selected.has(type);
          return (
            <Pressable
              key={type}
              onPress={() => toggle(type)}
              accessibilityLabel={`${ADDICTION_LABELS[type]} seç`}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={[styles.optionIcon, isSelected && { backgroundColor: colors.primary[600] }]}>
                <Icon size={24} color={isSelected ? colors.neutral[0] : colors.primary[600]} strokeWidth={2} />
              </View>
              <Text style={[styles.optionLabel, isSelected && { color: colors.primary[700] }]}>{ADDICTION_LABELS[type]}</Text>
              {isSelected && <Check size={20} color={colors.primary[600]} strokeWidth={2.5} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Devam Et"
          onPress={handleContinue}
          disabled={selected.size === 0}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  header: { padding: spacing.xl, paddingBottom: spacing.md },
  title: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  subtitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 4 },
  list: { padding: spacing.lg, gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.neutral[200],
  },
  optionSelected: { borderColor: colors.primary[600], backgroundColor: colors.primary[50] },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: { flex: 1, fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[800] },
  footer: { padding: spacing.lg },
});
