import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Card } from '@/src/components/Card';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StateViews } from '@/src/components/StateViews';
import { supportService } from '@/src/services/support/supportService';
import { SUPPORT_CONTACTS } from '@/src/constants';
import type { SupportInformation } from '@/src/types';
import { Phone, Globe, MapPin, ChevronRight, BookOpen, Heart, Shield } from 'lucide-react-native';

export default function SupportScreen() {
  const router = useRouter();
  const [info, setInfo] = useState<SupportInformation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supportService.getSupportInformation().then((i) => {
      setInfo(i);
      setLoading(false);
    });
  }, []);

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {});
  };

  const openWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Profesyonel Destek" subtitle="Yalnız değilsin" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyIcon}>
            <Shield size={28} color={colors.neutral[0]} strokeWidth={2} />
          </View>
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyTitle}>Acil Durum</Text>
            <Text style={styles.emergencyDesc}>112 Acil Çağrı Merkezi</Text>
          </View>
          <Pressable onPress={() => callNumber('112')} style={styles.callBtn}>
            <Phone size={18} color={colors.neutral[0]} strokeWidth={2} />
            <Text style={styles.callBtnText}>Ara</Text>
          </Pressable>
        </Card>

        <SectionTitle title="Danışma Hatları" />
        <StateViews isLoading={loading} empty={!info}>
          {info && (
            <>
              <Card>
                <View style={styles.contactRow}>
                  <View style={[styles.contactIcon, { backgroundColor: colors.primary[50] }]}>
                    <Phone size={22} color={colors.primary[600]} strokeWidth={2} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{info.yedam.name}</Text>
                    <Text style={styles.contactDesc}>{info.yedam.description}</Text>
                  </View>
                </View>
                <Pressable onPress={() => callNumber(info.yedam.phone)} style={({ pressed }) => [styles.contactAction, pressed && { opacity: 0.85 }]}>
                  <Text style={styles.contactActionText}>{info.yedam.phone} — Ara</Text>
                </Pressable>
              </Card>

              <Card>
                <View style={styles.contactRow}>
                  <View style={[styles.contactIcon, { backgroundColor: colors.secondary[50] }]}>
                    <Globe size={22} color={colors.secondary[600]} strokeWidth={2} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{info.yesilay.name}</Text>
                    <Text style={styles.contactDesc}>{info.yesilay.description}</Text>
                  </View>
                </View>
                <Pressable onPress={() => openWebsite(info.yesilay.website)} style={({ pressed }) => [styles.contactAction, pressed && { opacity: 0.85 }]}>
                  <Text style={styles.contactActionText}>Web sitesini aç</Text>
                </Pressable>
              </Card>
            </>
          )}
        </StateViews>

        <SectionTitle title="Destek Merkezleri" subtitle="Yakındaki YEDAM ve AMATEM merkezleri" />
        <Pressable
          onPress={() => router.push('/support-centers')}
          style={({ pressed }) => [styles.navCard, pressed && { opacity: 0.9 }]}
        >
          <View style={[styles.navIcon, { backgroundColor: colors.warning[50] }]}>
            <MapPin size={22} color={colors.warning[600]} strokeWidth={2} />
          </View>
          <View style={styles.navInfo}>
            <Text style={styles.navTitle}>Haritada Göster</Text>
            <Text style={styles.navDesc}>Yakındaki destek merkezlerini haritada gör</Text>
          </View>
          <ChevronRight size={20} color={colors.neutral[400]} strokeWidth={2} />
        </Pressable>

        <SectionTitle title="Eğitim İçerikleri" />
        <Card>
          <View style={styles.eduList}>
            {[
              { title: 'Bağımlılık nedir?', desc: 'Bağımlılığın tanımı ve türleri' },
              { title: 'Nüks yönetimi', desc: 'Nüks sonrası nasıl devam edilir' },
              { title: 'Dürtü ve tetikleyiciler', desc: 'Dürtü döngüsünü anlamak' },
              { title: 'Profesyonel yardım', desc: 'Ne zaman ve nereye başvurulur' },
            ].map((item, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.eduItem, pressed && { opacity: 0.7 }]}>
                <View style={[styles.eduIcon, { backgroundColor: colors.accent[50] }]}>
                  <BookOpen size={18} color={colors.accent[600]} strokeWidth={2} />
                </View>
                <View style={styles.eduInfo}>
                  <Text style={styles.eduTitle}>{item.title}</Text>
                  <Text style={styles.eduDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
              </Pressable>
            ))}
          </View>
        </Card>

        <Card style={styles.supportNote}>
          <Heart size={20} color={colors.secondary[600]} strokeWidth={2} />
          <Text style={styles.supportNoteText}>
            Destek almak güçsüzlük değil, cesarettir. Kendine yardım etme fırsatı ver.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  emergencyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.danger[500] },
  emergencyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  emergencyInfo: { flex: 1 },
  emergencyTitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  emergencyDesc: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.danger[100], marginTop: 2 },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  callBtnText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[0] },
  contactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  contactDesc: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 4, lineHeight: 20 },
  contactAction: { marginTop: spacing.md, backgroundColor: colors.primary[50], borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignSelf: 'flex-start' },
  contactActionText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[700] },
  navCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.neutral[100] },
  navIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  navInfo: { flex: 1 },
  navTitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  navDesc: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 2 },
  eduList: { gap: spacing.sm },
  eduItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  eduIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  eduInfo: { flex: 1 },
  eduTitle: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[800] },
  eduDesc: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400], marginTop: 2 },
  supportNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.secondary[50], borderWidth: 1, borderColor: colors.secondary[100] },
  supportNoteText: { flex: 1, fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.secondary[700], lineHeight: 20 },
});
