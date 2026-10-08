import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from './colors';

const STORAGE_KEY = 'app_theme_mode';
const MODES = ['light', 'dark', 'system'];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState('system');
  const [ready, setReady] = useState(false);

  // Load the saved choice once when the app starts
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && MODES.includes(saved)) setModeState(saved);
      } catch (e) {
        // If storage fails, simply fall back to "system"
      } finally {
        if (active) setReady(true);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback(async (next) => {
    if (!MODES.includes(next)) return;
    setModeState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // The theme still changes for this session even if saving fails
    }
  }, []);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const value = useMemo(
    () => ({ mode, setMode, isDark, colors: isDark ? darkColors : lightColors }),
    [mode, setMode, isDark]
  );

  // Wait for the saved choice so the app never flashes the wrong theme
  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}