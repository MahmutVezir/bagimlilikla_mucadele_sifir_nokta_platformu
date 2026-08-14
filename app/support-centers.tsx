import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { StateViews } from '@/src/components/StateViews';
import { supportService } from '@/src/services/support/supportService';
import { mockSupportCenters } from '@/src/mock/supportCenters';
import type { SupportCenter } from '@/src/types';
import { ChevronLeft, Phone, MapPin, Navigation } from 'lucide-react-native';

export default function SupportCentersScreen() {
  const router = useRouter();
  const [centers, setCenters] = useState<SupportCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    supportService.getSupportCenters().then((c) => {
      setCenters(c);
      setLoading(false);
    });
  }, []);

  const cities = Array.from(new Set(centers.map((c) => c.city))).sort();
  const filtered = selectedCity ? centers.filter((c) => c.city === selectedCity) : centers;

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {});
  };

  const openMap = (lat: number, lng: number, name: string) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}`,
      default: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Geri">
          <ChevronLeft size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
        <Text style={styles.topTitle}>Destek Merkezleri</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mapDisclaimer}>
          Aşağıdaki merkezler örnek verilerdir. Gerçek kurum verileri için YEDAM ve Yeşilay resmi sitelerini ziyaret edin.
        </Text>

        <View style={styles.mapPlaceholder}>
          <MapPin size={40} color={colors.warning[500]} strokeWidth={1.5} />
          <Text style={styles.mapPlaceholderText}>Harita görünümü</Text>
          <Text style={styles.mapPlaceholderSub}>
            Gerçek harita entegrasyonu için EXPO_PUBLIC_MAPS_API_KEY gereklidir.
          </Text>
        </View>

        <View style={styles.cityFilters}>
          <Pressable
            onPress={() => setSelectedCity(null)}
            style={({ pressed }) => [styles.cityChip, !selectedCity && styles.cityChipActive, pressed && { opacity: 0.85 }]}
          >
            <Text style={[styles.cityChipText, !selectedCity && styles.cityChipTextActive]}>Tümü</Text>
          </Pressable>
          {cities.map((city) => (
            <Pressable
              key={city}
              onPress={() => setSelectedCity(city)}
              style={({ pressed }) => [styles.cityChip, selectedCity === city && styles.cityChipActive, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>{city}</Text>
            </Pressable>
          ))}
        </View>

        <StateViews isLoading={loading} empty={filtered.length === 0} emptyTitle="Merkez bulunamadı" emptyMessage="Bu şehirde örnek merkez yok.">
          <View style={styles.centerList}>
            {filtered.map((center) => (
              <Card key={center.id}>
                <Text style={styles.centerName}>{center.name}</Text>
                <View style={styles.centerMeta}>
                  <View style={styles.centerCityTag}>
                    <Text style={styles.centerCityText}>{center.city}</Text>
                  </View>
                </View>
                <Text style={styles.centerAddress}>{center.address}</Text>
                <View style={styles.centerActions}>
                  <Pressable
                    onPress={() => callNumber(center.phone)}
                    style={({ pressed }) => [styles.centerBtn, pressed && { opacity: 0.85 }]}
                  >
                    <Phone size={16} color={colors.primary[600]} strokeWidth={2} />
                    <Text style={styles.centerBtnText}>{center.phone}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openMap(center.latitude, center.longitude, center.name)}
                    style={({ pressed }) => [styles.centerBtn, styles.centerBtnNav, pressed && { opacity: 0.85 }]}
                  >
                    <Navigation size={16} color={colors.secondary[600]} strokeWidth={2} />
                    <Text style={[styles.centerBtnText, { color: colors.secondary[600] }]}>Yol Tarifi</Text>
                  </Pressable>
                </View>
              </Card>
            ))}
          </View>
        </StateViews>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  topTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  mapDisclaimer: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[500], lineHeight: 16, backgroundColor: colors.neutral[100], borderRadius: radius.md, padding: spacing.md },
  mapPlaceholder: { height: 200, backgroundColor: colors.neutral[100], borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.neutral[200], borderStyle: 'dashed' },
  mapPlaceholderText: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[500] },
  mapPlaceholderSub: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400], textAlign: 'center', paddingHorizontal: spacing.lg },
  cityFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityChip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.neutral[100], borderWidth: 1.5, borderColor: colors.neutral[200] },
  cityChipActive: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
  cityChipText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.medium, color: colors.neutral[700] },
  cityChipTextActive: { color: colors.neutral[0] },
  centerList: { gap: spacing.md },
  centerName: { fontSize: fontSizes.md, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  centerMeta: { flexDirection: 'row', gap: 6, marginTop: 6 },
  centerCityTag: { backgroundColor: colors.primary[50], borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2 },
  centerCityText: { fontSize: fontSizes.xs, fontFamily: fontFamilies.semibold, color: colors.primary[700] },
  centerAddress: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 8, lineHeight: 20 },
  centerActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  centerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary[50], borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  centerBtnNav: { backgroundColor: colors.secondary[50] },
  centerBtnText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[700] },
});
