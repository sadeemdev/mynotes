import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import IconButton from './IconButton';

const OPTIONS = [
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  { key: 'system', label: 'System default', icon: 'phone-portrait-outline' },
];

// App bar icon (sun / moon). Tapping it opens the Light / Dark / System chooser.
export default function ThemeToggle() {
  const { colors, isDark, mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);

  const choose = (key) => {
    setMode(key);
    setOpen(false);
  };

  return (
    <>
      <IconButton name={isDark ? 'moon' : 'sunny'} label="Change theme" onPress={() => setOpen(true)} />

      <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 32 }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Choose theme</Text>

            {OPTIONS.map((option) => {
              const selected = mode === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => choose(option.key)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 4,
                    backgroundColor: selected ? colors.background : 'transparent',
                  }}
                >
                  <Ionicons name={option.icon} size={22} color={selected ? colors.accent : colors.textSecondary} />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 14,
                      fontSize: 16,
                      fontWeight: selected ? '700' : '500',
                      color: colors.text,
                    }}
                  >
                    {option.label}
                  </Text>
                  {selected ? <Ionicons name="checkmark-circle" size={22} color={colors.accent} /> : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}