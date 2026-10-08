import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

// Centered message used for "no notes", "no search results" and "could not load"
export default function EmptyState({ icon, title, subtitle }) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 80 }}>
      <Ionicons name={icon} size={56} color={colors.textMuted} />
      <Text style={{ color: colors.textSecondary, fontSize: 17, fontWeight: '700', marginTop: 12, textAlign: 'center' }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center' }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}