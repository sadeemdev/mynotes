import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const DialogContext = createContext(null);

// Themed replacement for Alert.alert, so dialogs match Light / Dark mode.
// Usage: showDialog({ title, message, buttons: [{ text, style: 'cancel' | 'destructive', onPress }] })
export function DialogProvider({ children }) {
  const { colors } = useTheme();
  const [dialog, setDialog] = useState(null);

  const showDialog = useCallback((config) => setDialog(config), []);
  const hideDialog = useCallback(() => setDialog(null), []);

  const buttons = dialog?.buttons?.length ? dialog.buttons : [{ text: 'OK' }];

  const handlePress = (button) => {
    setDialog(null);
    if (button.onPress) button.onPress();
  };

  const buttonColor = (style) => {
    if (style === 'destructive') return colors.danger;
    if (style === 'cancel') return colors.textSecondary;
    return colors.accent;
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}

      <Modal visible={!!dialog} transparent animationType="fade" statusBarTranslucent onRequestClose={hideDialog}>
        <Pressable
          onPress={hideDialog}
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 32 }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 20,
              padding: 22,
            }}
          >
            {dialog?.title ? (
              <Text style={{ color: colors.text, fontSize: 19, fontWeight: '800', marginBottom: 8 }}>{dialog.title}</Text>
            ) : null}
            {dialog?.message ? (
              <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 22 }}>{dialog.message}</Text>
            ) : null}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: 20 }}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  onPress={() => handlePress(button)}
                  activeOpacity={0.7}
                  style={{ paddingVertical: 10, paddingHorizontal: 14, marginLeft: 4 }}
                >
                  <Text
                    style={{
                      color: buttonColor(button.style),
                      fontSize: 15,
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside <DialogProvider>');
  return ctx;
}