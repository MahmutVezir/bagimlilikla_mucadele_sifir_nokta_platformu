import { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/src/theme';
import { fontFamilies, fontSizes } from '@/src/theme';
import { Text, TextInput } from 'react-native';
import { Button } from '@/src/components/Button';
import { useAuthStore } from '@/src/store/authStore';
import { signUpWithEmail } from '@/src/services/auth/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signUpWithEmail(email, password, name);
    setLoading(false);
    if ('message' in result) {
      setError(result.message);
      return;
    }
    setUser(result.user);
    router.replace('/(auth)/addiction-select');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Yolculuğuna başlamak için birkaç bilgi ver.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Adın"
                placeholderTextColor={colors.neutral[400]}
                accessibilityLabel="Ad"
              />
            </View>

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
                placeholder="En az 6 karakter"
                placeholderTextColor={colors.neutral[400]}
                secureTextEntry
                accessibilityLabel="Şifre"
              />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <Button title="Devam Et" onPress={handleRegister} loading={loading} size="lg" style={styles.button} />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Hesabın var mı? </Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Giriş yap</Text>
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
  header: { marginTop: spacing.xl, marginBottom: spacing.xl },
  title: { fontSize: fontSizes.xxxl, fontFamily: fontFamilies.bold, color: colors.neutral[900] },
  subtitle: { fontSize: fontSizes.md, fontFamily: fontFamilies.regular, color: colors.neutral[500], marginTop: 4 },
  form: { gap: spacing.md },
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
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  loginText: { fontSize: fontSizes.sm, fontFamily: fontFamilies.regular, color: colors.neutral[500] },
  loginLink: { fontSize: fontSizes.sm, fontFamily: fontFamilies.semibold, color: colors.primary[600] },
});
