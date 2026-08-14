import { useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Button } from '@/src/components/Button';
import { ONBOARDING_SCREENS, APP_NAME } from '@/src/constants';
import { Shield, HeartPulse, MapPin, Zap } from 'lucide-react-native';

const ICONS = [Shield, HeartPulse, Zap, MapPin];

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < ONBOARDING_SCREENS.length - 1) {
      const next = index + 1;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        {index < ONBOARDING_SCREENS.length - 1 && (
          <Pressable onPress={handleSkip} accessibilityLabel="Atla">
            <Text style={styles.skipText}>Atla</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {ONBOARDING_SCREENS.map((screen, i) => {
          const Icon = ICONS[i] ?? Shield;
          return (
            <View key={i} style={styles.slide}>
              <View style={styles.iconWrap}>
                <Icon size={56} color={colors.primary[600]} strokeWidth={1.5} />
              </View>
              <Text style={styles.title}>{screen.title}</Text>
              <Text style={styles.subtitle}>{screen.subtitle}</Text>
              <Text style={styles.description}>{screen.description}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {ONBOARDING_SCREENS.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button
          title={index === ONBOARDING_SCREENS.length - 1 ? 'Başla' : 'Devam'}
          onPress={handleNext}
          size="lg"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  skipRow: { flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.lg },
  skipText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.neutral[400] },
  scroll: { flex: 1 },
  slide: { width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: 16 },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSizes.hero, fontFamily: fontFamilies.bold, color: colors.primary[700], textAlign: 'center' },
  subtitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[800], textAlign: 'center' },
  description: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[500], textAlign: 'center', lineHeight: 24 },
  footer: { padding: spacing.lg, gap: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neutral[200] },
  dotActive: { width: 24, borderRadius: 4, backgroundColor: colors.primary[600] },
  button: { width: '100%' },
});
