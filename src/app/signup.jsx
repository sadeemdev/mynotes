import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getErrorMessage } from '../utils/errorMessages';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name, email address, and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Your password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCredential.user, { displayName: name.trim() });

      // User is signed in automatically. Clear old screens, then open notes
      if (router.canDismiss()) router.dismissAll();
      router.replace('/notes');
    } catch (error) {
      Alert.alert('Registration Failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0E]">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} className="px-6 py-4">

        {/* Top Bar with Back Button + Text */}
        <View className="mt-2 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center self-start bg-[#18181B] border border-gray-800 px-4 py-2.5 rounded-2xl mb-6"
          >
            <Text className="text-[#00E676] text-lg font-black mr-2">←</Text>
            <Text className="text-white text-sm font-bold tracking-wider uppercase">Back</Text>
          </TouchableOpacity>

          <Text className="text-white text-4xl font-black tracking-tight mb-2">
            Join MyNotes
          </Text>
          <Text className="text-gray-400 text-base font-medium">Create an account to start organizing your notes.</Text>
        </View>

        {/* Card Form */}
        <View className="bg-[#18181B]/80 border border-gray-800/80 p-5 rounded-3xl my-auto">

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-gray-400 text-[11px] font-bold mb-2 uppercase tracking-widest">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ali Khan"
              placeholderTextColor="#52525B"
              className="bg-[#0B0B0E] text-white px-5 py-4 rounded-xl border border-gray-800 text-base font-semibold focus:border-[#00E676]"
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-gray-400 text-[11px] font-bold mb-2 uppercase tracking-widest">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#52525B"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-[#0B0B0E] text-white px-5 py-4 rounded-xl border border-gray-800 text-base font-semibold focus:border-[#00E676]"
            />
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="text-gray-400 text-[11px] font-bold mb-2 uppercase tracking-widest">Password</Text>
            <View className="justify-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#52525B"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="bg-[#0B0B0E] text-white px-5 py-4 rounded-xl border border-gray-800 text-base font-semibold focus:border-[#00E676]"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4"
                hitSlop={10}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#71717A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading}
            className="bg-[#00E676] py-4 rounded-xl items-center mt-6 shadow-lg shadow-[#00E676]/25"
            onPress={handleSignup}
          >
            {loading ? (
              <ActivityIndicator color="#0B0B0E" />
            ) : (
              <Text className="text-[#0B0B0E] font-black text-base uppercase tracking-wider">CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* Footer Link */}
        <View className="flex-row justify-center items-center my-6">
          <Text className="text-gray-400 text-xs font-bold tracking-wider">ALREADY HAVE AN ACCOUNT? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-[#00E676] text-xs font-black tracking-wider underline">SIGN IN</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}