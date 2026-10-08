import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';

export default function BackButton({ onPress, style }) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress || (() => router.back())}
      accessibilityLabel="Go back"
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 10,
        },
        style,
      ]}
    >
      <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '900', marginRight: 8 }}>←</Text>
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
        Back
      </Text>
    </TouchableOpacity>
  );
}