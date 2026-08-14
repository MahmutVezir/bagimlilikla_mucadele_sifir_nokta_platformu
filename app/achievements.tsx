import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { AchievementIcon } from '@/src/components/AchievementIcon';
import { useAchievementStore } from '@/src/store/achievementStore';
import { ACHIEVEMENT_DEFINITIONS } from '@/src/constants';
import { ChevronLeft, Lock } from 'lucide-react-native';

export default function AchievementsScreen() {
  const router = useRouter();
  const unlockedTypes = useAchievementStore((s) => s.unlockedTypes);
  const cleanDays = useAchievementStore((s) => s.cleanDays);
  const logCount = useAchievementStore((s) => s.logCount);
  const interventionCount = useAchievementStore((s) => s.interventionCount);
  const supportCount = useAchievementStore((s) => s.supportCount);

  const unlockedCount = ACHIEVEMENT_DEFINITIONS.filter((d) => unlockedTypes.includes(d.type)).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Geri">
          <ChevronLeft size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
        <Text style={styles.topTitle}>Başarımlar</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.statsCard}>
          <Text style={styles.statsValue}>{unlockedCount}/{ACHIEVEMENT_DEFINITIONS.length}</Text>
          <Text style={styles.statsLabel}>Açılan başarımlar</Text>
          <View style={styles.miniStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{cleanDays}</Text>
              <Text style={styles.miniStatLabel}>temiz gün</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{logCount}</Text>
              <Text style={styles.miniStatLabel}>kayıt</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{interventionCount}</Text>
              <Text style={styles.miniStatLabel}>müdahale</Text>
            </View>
          </View>
        </Card>

        <View style={styles.list}>
          {ACHIEVEMENT_DEFINITIONS.map((def) => {
            const unlocked = unlockedTypes.includes(def.type);
            return (
              <Card key={def.type} style={[styles.achCard, !unlocked && styles.achCardLocked]}>
                <View style={[styles.achIcon, !unlocked && styles.achIconLocked]}>
                  {unlocked ? (
                    <AchievementIcon type={def.icon} unlocked={true} size={32} />
                  ) : (
                    <Lock size={24} color={colors.neutral[400]} strokeWidth={2} />
                  )}
                </View>
                <View style={styles.achInfo}>
                  <Text style={[styles.achTitle, !unlocked && { color: colors.neutral[400] }]}>{def.title}</Text>
                  <Text style={[styles.achDesc, !unlocked && { color: colors.neutral[300] }]}>{def.description}</Text>
                </View>
                {unlocked && <Text style={styles.achBadge}>✓</Text>}
              </Card>
            );
          })}
        </View>

        <Text style={styles.noteText}>
          Başarımlar senin psikolojik durumunu olumsuz etkilememek için tasarlandı. Her adım değerli.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  topTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  statsCard: { alignItems: 'center', gap: 4, backgroundColor: colors.primary[700] },
  statsValue: { fontSize: fontSizes.hero, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  statsLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.primary[100] },
  miniStats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  miniStat: { alignItems: 'center' },
  miniStatValue: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  miniStatLabel: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.primary[100], marginTop: 2 },
  list: { gap: spacing.md },
  achCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  achCardLocked: { opacity: 0.7 },
  achIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.warning[50], alignItems: 'center', justifyContent: 'center' },
  achIconLocked: { backgroundColor: colors.neutral[100] },
  achInfo: { flex: 1 },
  achTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  achDesc: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
  achBadge: { fontSize: 18, color: colors.secondary[500], fontFamily: fontFamilies.bold },
  noteText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400], textAlign: 'center', lineHeight: 18, marginTop: spacing.sm },
});
