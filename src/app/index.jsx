import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { useTheme } from '../theme/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // If the user is already signed in, go straight to their notes
  useEffect(() => {
    auth.authStateReady().then(() => {
      if (auth.currentUser) router.replace('/notes');
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'space-between' }}>
      {/* Logo */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
          }}
        >
          <Ionicons name="document-text" size={24} color={colors.onPrimary} />
        </View>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
          My<Text style={{ color: colors.accent }}>Notes</Text>
        </Text>
      </View>

      {/* Main text */}
      <View style={{ paddingVertical: 24 }}>
        <Text style={{ color: colors.text, fontSize: 48, fontWeight: '900', lineHeight: 56, letterSpacing: -1, marginBottom: 16 }}>
          WRITE IT{'\n'}
          <Text style={{ color: colors.accent }}>DOWN.</Text>
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24, fontWeight: '500' }}>
          Capture your thoughts, edit them anytime, and access them from anywhere. Your notes are private and visible only to you.
        </Text>
      </View>

      {/* Buttons */}
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/signup')}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ color: colors.onPrimary, fontSize: 16, fontWeight: '900', letterSpacing: 1.5 }}>GET STARTED</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }}>
            ALREADY HAVE AN ACCOUNT?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1.5, textDecorationLine: 'underline' }}>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}