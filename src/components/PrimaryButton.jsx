import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function PrimaryButton({ label, onPress, loading = false, disabled = false, compact = false, style }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading || disabled}
      style={[
        {
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: compact ? 16 : 12,
          paddingVertical: compact ? 10 : 16,
          paddingHorizontal: compact ? 24 : 16,
          opacity: disabled && !loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text
          style={{
            color: colors.onPrimary,
            fontSize: compact ? 14 : 16,
            fontWeight: '900',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}