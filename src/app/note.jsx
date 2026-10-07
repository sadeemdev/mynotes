import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDoc, setDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getErrorMessage } from '../utils/errorMessages';

// Handles both creating a new note (no id) and editing an existing one (id present)
export default function NoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const draftRef = useRef(null); // keeps the same id if the user retries saving a new note

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid, 'notes', id));
        if (snap.exists()) {
          setTitle(snap.data().title || '');
          setContent(snap.data().content || '');
        }
      } catch (e) {
        Alert.alert('Unable to Load Note', getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add a title or some content before saving.');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Session Expired', 'Please sign in again to continue.');
      return;
    }

    setSaving(true);
    try {
      const data = { title: title.trim(), content: content.trim(), updatedAt: serverTimestamp() };

      let op;
      if (id) {
        op = updateDoc(doc(db, 'users', user.uid, 'notes', id), data);
      } else {
        // Same id on every retry, so a retry never creates a duplicate note
        if (!draftRef.current) draftRef.current = doc(collection(db, 'users', user.uid, 'notes'));
        op = setDoc(draftRef.current, { ...data, createdAt: serverTimestamp() });
      }

      // Do not wait forever if the server does not respond
      const result = await Promise.race([
        op.then(() => 'ok'),
        new Promise((resolve) => setTimeout(() => resolve('timeout'), 10000)),
      ]);

      if (result === 'ok') {
        Alert.alert('Note Saved', 'Your note has been saved successfully.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        // TEMPORARY DIAGNOSTIC: ask Firestore directly over plain HTTPS (with the API key, like the SDK does)
        let diag = '';
        try {
          const token = await user.getIdToken();
          const { projectId, apiKey } = db.app.options;
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(
            `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${user.uid}/notes?pageSize=1`,
            { headers: { Authorization: `Bearer ${token}`, 'x-goog-api-key': apiKey }, signal: controller.signal }
          );
          clearTimeout(timer);
          const text = await res.text();
          if (res.ok) {
            diag = `HTTP ${res.status} - server reachable, rules OK`;
          } else {
            let reason = '';
            try {
              const j = JSON.parse(text);
              const reasons = (j.error?.details || []).map((d) => d.reason).filter(Boolean).join(', ');
              reason = `${reasons} | ${j.error?.message || ''}`;
            } catch (e) {
              reason = text.slice(0, 200);
            }
            diag = `HTTP ${res.status} - ${reason}`;
          }
        } catch (err) {
          diag = `Network error - ${err.message}`;
        }

        // Stay on this screen so the text is not lost and the user can try again
        Alert.alert(
          'Connection Problem',
          `We could not reach the server, so your note has not been saved yet. Please tap Save again.\n\nDiagnostic: ${diag}`
        );
      }
    } catch (e) {
      Alert.alert('Save Failed', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0E]">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 px-6 pt-2">

          {/* Top bar */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center bg-[#18181B] border border-gray-800 px-4 py-2.5 rounded-2xl"
            >
              <Text className="text-[#00E676] text-lg font-black mr-2">←</Text>
              <Text className="text-white text-sm font-bold tracking-wider uppercase">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving || loading}
              className="bg-[#00E676] px-6 py-2.5 rounded-2xl"
            >
              {saving ? (
                <ActivityIndicator color="#0B0B0E" />
              ) : (
                <Text className="text-[#0B0B0E] font-black text-sm uppercase tracking-wider">Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#00E676" size="large" />
          ) : (
            <>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="#52525B"
                className="text-white text-3xl font-black mb-4"
              />
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Start writing your note..."
                placeholderTextColor="#52525B"
                multiline
                textAlignVertical="top"
                className="flex-1 text-gray-200 text-base leading-6"
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}