import { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text, TextInput } from 'react-native';
import { Button } from '@/src/components/Button';
import { useAuthStore } from '@/src/store/authStore';
import { signInWithEmail } from '@/src/services/auth/authService';
import { APP_NAME } from '@/src/constants';
import { Shield } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('E-posta ve şifre gerekli.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email, password);
    setLoading(false);
    if ('message' in result) {
      setError(result.message);
      return;
    }
    setUser(result.user);
    router.replace('/(tabs)');
  };

  const handleDemo = () => {
    useAuthStore.getState().loadDemo();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <View style={styles.logoIcon}>
              <Shield size={36} color={colors.neutral[0]} strokeWidth={2} />
            </View>
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.tagline}>Kendin için yeni bir başlangıç</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Giriş Yap</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="E-posta"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.neutral[400]}
                secureTextEntry
                accessibilityLabel="Şifre"
              />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <Button title="Giriş Yap" onPress={handleLogin} loading={loading} size="lg" style={styles.button} />

            <Button title="Demo olarak devam et" onPress={handleDemo} variant="outline" size="md" style={styles.button} />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Hesabın yok mu? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Kayıt ol</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  scroll: { flexGrow: 1, padding: spacing.xl },
  logoWrap: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xxl },
  logoIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary[700], alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  appName: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.primary[700] },
  tagline: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 4 },
  form: { gap: spacing.md },
  formTitle: { fontSize: fontSizes.xxl, fontFamily: fontFamilies.semibold, color: colors.neutral[900], marginBottom: spacing.sm },
  inputGroup: { gap: 6 },
  label: { fontSize: fontSizes.sm, fontFamily: fontFamilies.medium, color: colors.neutral[700] },
  input: {
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.regular,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[900],
  },
  error: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.danger[600], textAlign: 'center' },
  button: { width: '100%' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  registerText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500] },
  registerLink: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[600] },
});
