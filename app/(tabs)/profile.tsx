import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Card } from '@/src/components/Card';
import { useAuthStore } from '@/src/store/authStore';
import { signOut } from '@/src/services/auth/authService';
import { ADDICTION_LABELS } from '@/src/constants';
import type { AddictionType } from '@/src/types';
import { Cigarette, Wine, Dices, Pill, Settings, ChevronRight, Trophy, LogOut, Bell, Shield, FileText, Download, Trash2, Info } from 'lucide-react-native';

const ADDICTION_ICONS: Record<AddictionType, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  smoking: Cigarette,
  alcohol: Wine,
  gambling: Dices,
  substance: Pill,
};

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addictions = useAuthStore((s) => s.addictions);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await signOut();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Profil" subtitle="Hesap bilgilerin" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Kullanıcı'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          {user?.age && <Text style={styles.age}>{user.age} yaşında</Text>}
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Mücadele edilen bağımlılıklar</Text>
          {addictions.length > 0 ? (
            <View style={styles.addictionList}>
              {addictions.map((a) => {
                const Icon = ADDICTION_ICONS[a.addictionType];
                return (
                  <View key={a.id} style={styles.addictionRow}>
                    <View style={styles.addictionIcon}>
                      <Icon size={18} color={colors.primary[600]} strokeWidth={2} />
                    </View>
                    <Text style={styles.addictionLabel}>{ADDICTION_LABELS[a.addictionType]}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>Henüz bağımlılık seçilmedi.</Text>
          )}
        </Card>

        {user?.goal && (
          <Card>
            <Text style={styles.sectionLabel}>Hedef</Text>
            <Text style={styles.goalText}>{user.goal}</Text>
          </Card>
        )}

        <Text style={styles.menuTitle}>Ayarlar</Text>

        <Pressable onPress={() => router.push('/settings')} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.85 }]}>
          <View style={[styles.menuIcon, { backgroundColor: colors.primary[50] }]}>
            <Settings size={18} color={colors.primary[600]} strokeWidth={2} />
          </View>
          <Text style={styles.menuLabel}>Ayarlar</Text>
          <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
        </Pressable>

        <Pressable onPress={() => router.push('/achievements')} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.85 }]}>
          <View style={[styles.menuIcon, { backgroundColor: colors.warning[50] }]}>
            <Trophy size={18} color={colors.warning[600]} strokeWidth={2} />
          </View>
          <Text style={styles.menuLabel}>Başarımlar</Text>
          <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
        </Pressable>

        <Pressable onPress={() => router.push('/freedom-fund')} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.85 }]}>
          <View style={[styles.menuIcon, { backgroundColor: colors.secondary[50] }]}>
            <FileText size={18} color={colors.secondary[600]} strokeWidth={2} />
          </View>
          <Text style={styles.menuLabel}>Özgürlük Fonu</Text>
          <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
        </Pressable>

        <Pressable onPress={handleLogout} style={({ pressed }) => [styles.menuItem, styles.logoutItem, pressed && { opacity: 0.85 }]}>
          <View style={[styles.menuIcon, { backgroundColor: colors.danger[50] }]}>
            <LogOut size={18} color={colors.danger[600]} strokeWidth={2} />
          </View>
          <Text style={[styles.menuLabel, { color: colors.danger[600] }]}>Çıkış Yap</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  profileCard: { alignItems: 'center', gap: 6 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary[700], alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.neutral[0] },
  name: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  email: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500] },
  age: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400], marginTop: 2 },
  sectionLabel: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[700], marginBottom: spacing.sm },
  addictionList: { gap: 8 },
  addictionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  addictionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' },
  addictionLabel: { fontSize: fontSizes.md, fontFamily: fontFamilies.medium, color: colors.neutral[800] },
  emptyText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[400] },
  goalText: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[700], lineHeight: 22 },
  menuTitle: { fontSize: fontSizes.lg, fontFamily: fontFamilies.semibold, color: colors.neutral[900], marginTop: spacing.sm, marginBottom: spacing.xs },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.neutral[100] },
  logoutItem: { marginBottom: spacing.sm },
  menuIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
});
