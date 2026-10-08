import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getErrorMessage } from '../utils/errorMessages';
import { useTheme } from '../theme/ThemeContext';
import { useDialog } from '../components/DialogProvider';
import BackButton from '../components/BackButton';
import AppTextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showDialog } = useDialog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      showDialog({
        title: 'Missing Information',
        message: 'Please enter your name, email address, and password.',
      });
      return;
    }
    if (password.length < 6) {
      showDialog({ title: 'Weak Password', message: 'Your password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCredential.user, { displayName: name.trim() });

      // User is signed in automatically. Clear old screens, then open notes
      if (router.canDismiss()) router.dismissAll();
      router.replace('/notes');
    } catch (error) {
      showDialog({ title: 'Registration Failed', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {/* Top section */}
        <View style={{ marginTop: 8, marginBottom: 24 }}>
          <BackButton style={{ marginBottom: 24 }} />
          <Text style={{ color: colors.text, fontSize: 36, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8 }}>
            Join MyNotes
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '500' }}>
            Create an account to start organizing your notes.
          </Text>
        </View>

        {/* Form card */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 24,
              padding: 20,
            }}
          >
            <AppTextInput label="Full Name" value={name} onChangeText={setName} placeholder="e.g. Ali Khan" />
            <AppTextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secure
              autoCapitalize="none"
            />
            <PrimaryButton label="Create Account" onPress={handleSignup} loading={loading} style={{ marginTop: 8 }} />
          </View>
        </View>

        {/* Footer link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 24 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
            ALREADY HAVE AN ACCOUNT?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1, textDecorationLine: 'underline' }}>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}