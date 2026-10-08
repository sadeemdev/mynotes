import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { DialogProvider } from "../components/DialogProvider";

// Reads the current theme so the status bar and screen background always match it
function ThemedStack() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="notes" />
        <Stack.Screen name="note" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <ThemedStack />
      </DialogProvider>
    </ThemeProvider>
  );
}