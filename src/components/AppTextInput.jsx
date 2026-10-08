import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

// Themed text field with an optional label and a show/hide button for passwords (secure).
export default function AppTextInput({ label, secure = false, onFocus, onBlur, ...props }) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      ) : null}

      <View style={{ justifyContent: 'center' }}>
        <TextInput
          {...props}
          secureTextEntry={secure && !visible}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.accent}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          style={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: focused ? colors.accent : colors.border,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingRight: secure ? 52 : 20,
            paddingVertical: 16,
            fontSize: 16,
            fontWeight: '600',
          }}
        />

        {secure ? (
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            hitSlop={10}
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 16 }}
          >
            <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}