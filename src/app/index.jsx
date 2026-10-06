import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';

export default function WelcomeScreen() {
  const router = useRouter();

  // Agar user pehle se login hai to seedha notes par bhej do
  useEffect(() => {
    auth.authStateReady().then(() => {
      if (auth.currentUser) router.replace('/notes');
    });
  }, []);

  return (
    <View className="flex-1 bg-[#0B0B0E]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 justify-between p-6">

        {/* Logo */}
        <View className="flex-row items-center mt-2">
          <View className="w-11 h-11 bg-[#00E676] rounded-2xl justify-center items-center mr-3">
            <Ionicons name="document-text" size={24} color="#0B0B0E" />
          </View>
          <Text className="text-white text-2xl font-black tracking-tight">
            My<Text className="text-[#00E676]">Notes</Text>
          </Text>
        </View>

        {/* Main text */}
        <View className="my-auto py-6">
          <Text className="text-white text-5xl font-black leading-[56px] tracking-tight mb-4">
            WRITE IT{"\n"}
            <Text className="text-[#00E676]">DOWN.</Text>
          </Text>
          <Text className="text-gray-300 text-base leading-6 font-medium">
           Capture your thoughts, edit them anytime, and access them from anywhere. Your notes are private and visible only to you.
          </Text>
        </View>

        {/* Buttons */}
        <View className="mb-4">
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-[#00E676] py-4 px-6 rounded-2xl flex-row justify-between items-center mb-4"
            onPress={() => router.push('/signup')}
          >
            <Text className="text-[#0B0B0E] font-black text-base tracking-wider uppercase">
              GET STARTED
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#0B0B0E" />
          </TouchableOpacity>

          <View className="flex-row justify-center items-center py-2">
            <Text className="text-gray-400 text-xs font-bold tracking-widest">
              ALREADY HAVE AN ACCOUNT?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-[#00E676] text-xs font-black tracking-widest underline">
                SIGN IN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}
