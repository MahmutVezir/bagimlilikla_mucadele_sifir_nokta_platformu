import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { useNotificationStore } from '@/src/store/notificationStore';
import { scheduleDailyReminder } from '@/src/services/notifications/notificationService';
import { ChevronLeft, Bell, Shield, Download, Trash2, Info, FileText, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const prefs = useNotificationStore();
  const [privacyMode, setPrivacyMode] = useState(false);

  const toggleDailyReminder = async (value: boolean) => {
    prefs.setPref('dailyReminder', value);
    if (value) {
      await scheduleDailyReminder(prefs.reminderHour, prefs.reminderMinute);
    }
  };

  const handleExport = () => {
    Alert.alert('Veri Dışa Aktarma', 'Verilerin JSON formatında dışa aktarılacak. Bu özellik prototip aşamasında.', [
      { text: 'Tamam' },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Verilerimi Sil',
      'Tüm kayıtların silinecek. Bu işlem geri alınamaz. Emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => Alert.alert('Bilgi', 'Prototip aşamasında veri silme işlemi simüle edilir.') },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Geri">
          <ChevronLeft size={24} color={colors.neutral[700]} strokeWidth={2} />
        </Pressable>
        <Text style={styles.topTitle}>Ayarlar</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Bildirimler</Text>
        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.primary[50] }]}>
                <Bell size={18} color={colors.primary[600]} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Günlük hatırlatma</Text>
                <Text style={styles.settingDesc}>Her gün kayıt için hatırlatma</Text>
              </View>
            </View>
            <Switch
              value={prefs.dailyReminder}
              onValueChange={toggleDailyReminder}
              trackColor={{ false: colors.neutral[200], true: colors.primary[500] }}
              thumbColor={colors.neutral[0]}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary[50] }]}>
                <Bell size={18} color={colors.secondary[600]} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Dürtü destek bildirimleri</Text>
                <Text style={styles.settingDesc}>Dürtü anında destek mesajları</Text>
              </View>
            </View>
            <Switch
              value={prefs.cravingSupport}
              onValueChange={(v) => prefs.setPref('cravingSupport', v)}
              trackColor={{ false: colors.neutral[200], true: colors.secondary[500] }}
              thumbColor={colors.neutral[0]}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.warning[50] }]}>
                <Bell size={18} color={colors.warning[600]} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Başarım bildirimleri</Text>
                <Text style={styles.settingDesc}>Yeni başarım açıldığında</Text>
              </View>
            </View>
            <Switch
              value={prefs.achievementAlerts}
              onValueChange={(v) => prefs.setPref('achievementAlerts', v)}
              trackColor={{ false: colors.neutral[200], true: colors.warning[500] }}
              thumbColor={colors.neutral[0]}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Gizlilik</Text>
        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.neutral[100] }]}>
                <Shield size={18} color={colors.neutral[700]} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Gizli mod</Text>
                <Text style={styles.settingDesc}>Verileri uygulama içinde gizle</Text>
              </View>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: colors.neutral[200], true: colors.neutral[700] }}
              thumbColor={colors.neutral[0]}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
        <Pressable onPress={handleExport} style={({ pressed }) => [styles.dataItem, pressed && { opacity: 0.85 }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.accent[50] }]}>
            <Download size={18} color={colors.accent[600]} strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Verilerimi Dışa Aktar</Text>
          <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
        </Pressable>
        <Pressable onPress={handleDelete} style={({ pressed }) => [styles.dataItem, styles.deleteItem, pressed && { opacity: 0.85 }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.danger[50] }]}>
            <Trash2 size={18} color={colors.danger[600]} strokeWidth={2} />
          </View>
          <Text style={[styles.settingLabel, { color: colors.danger[600] }]}>Verilerimi Sil</Text>
          <ChevronRight size={18} color={colors.danger[300]} strokeWidth={2} />
        </Pressable>

        <Text style={styles.sectionTitle}>Hakkında</Text>
        <Card>
          <View style={styles.aboutRow}>
            <Info size={18} color={colors.neutral[500]} strokeWidth={2} />
            <Text style={styles.aboutLabel}>Sürüm</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <FileText size={18} color={colors.neutral[500]} strokeWidth={2} />
            <Text style={styles.aboutLabel}>Takım</Text>
            <Text style={styles.aboutValue}>ÖzgürZihin</Text>
          </View>
        </Card>

        <Pressable style={({ pressed }) => [styles.dataItem, pressed && { opacity: 0.85 }]}>
          <Text style={styles.linkText}>Kullanım Koşulları</Text>
          <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.dataItem, pressed && { opacity: 0.85 }]}>
          <Text style={styles.linkText}>Gizlilik Politikası</Text>
          <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  topTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  sectionTitle: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.neutral[500], marginTop: spacing.sm, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  settingDesc: { fontSize: fontSizes.xs, fontFamily: fontFamilies.regular, color: colors.neutral[400], marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.neutral[100], marginVertical: spacing.md },
  dataItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.neutral[100] },
  deleteItem: { marginBottom: spacing.sm },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  aboutLabel: { flex: 1, fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[700] },
  aboutValue: { fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[900] },
  linkText: { flex: 1, fontSize: fontSizes.md, fontFamily: fontFamilies.semibold, color: colors.neutral[700] },
});
