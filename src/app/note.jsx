import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDoc, setDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getErrorMessage } from '../utils/errorMessages';
import { useTheme } from '../theme/ThemeContext';
import { useDialog } from '../components/DialogProvider';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';

// Resolves to 'ok' when the save finishes, or 'timeout' if the server does not answer in time
const withTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve('timeout'), ms);
    promise.then(
      () => {
        clearTimeout(timer);
        resolve('ok');
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

// Handles both creating a new note (no id) and editing an existing one (id present)
export default function NoteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showDialog } = useDialog();
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [missingCreatedAt, setMissingCreatedAt] = useState(false); // old notes get createdAt on first edit
  const draftRef = useRef(null); // same id on retry, so a retry never creates a duplicate note
  const savedRef = useRef(false); // true once a new note has been saved

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid, 'notes', id));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || '');
          setContent(data.content || '');
          setMissingCreatedAt(!data.createdAt);
        }
      } catch (e) {
        showDialog({ title: 'Unable to Load Note', message: getErrorMessage(e) });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      showDialog({ title: 'Empty Note', message: 'Please add a title or some content before saving.' });
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      showDialog({ title: 'Session Expired', message: 'Please sign in again to continue.' });
      return;
    }

    setSaving(true);
    try {
      // updatedAt changes on every save
      const data = { title: title.trim(), content: content.trim(), updatedAt: serverTimestamp() };

      let noteRef;
      if (id) {
        noteRef = doc(db, 'users', user.uid, 'notes', id);
      } else {
        if (!draftRef.current) draftRef.current = doc(collection(db, 'users', user.uid, 'notes'));
        noteRef = draftRef.current;
      }

      const alreadyExists = !!id || savedRef.current;
      const operation = alreadyExists
        ? updateDoc(noteRef, missingCreatedAt ? { ...data, createdAt: serverTimestamp() } : data)
        : setDoc(noteRef, { ...data, createdAt: serverTimestamp() }); // createdAt is set only once, when created

      const result = await withTimeout(operation, 10000);

      if (result === 'ok') {
        savedRef.current = true;
        setMissingCreatedAt(false);
        showDialog({
          title: 'Note Saved',
          message: 'Your note has been saved successfully.',
          buttons: [{ text: 'OK', onPress: () => router.back() }],
        });
      } else {
        // Stay on this screen so the text is not lost and the user can try again
        showDialog({
          title: 'Connection Problem',
          message:
            'We could not reach the server, so your note has not been saved yet. Please check your internet connection and tap Save again.',
        });
      }
    } catch (e) {
      showDialog({ title: 'Save Failed', message: getErrorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
          {/* Top bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <BackButton />
            <PrimaryButton label="Save" compact onPress={handleSave} loading={saving} disabled={loading} />
          </View>

          {loading ? (
            <ActivityIndicator color={colors.accent} size="large" />
          ) : (
            <>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor={colors.placeholder}
                selectionColor={colors.accent}
                style={{ color: colors.text, fontSize: 30, fontWeight: '900', marginBottom: 16 }}
              />
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Start writing your note..."
                placeholderTextColor={colors.placeholder}
                selectionColor={colors.accent}
                multiline
                textAlignVertical="top"
                style={{ flex: 1, color: colors.text, fontSize: 16, lineHeight: 24 }}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}