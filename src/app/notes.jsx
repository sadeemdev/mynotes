import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getErrorMessage } from '../utils/errorMessages';

export default function NotesScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubNotes = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace('/');
        return;
      }
      setUser(u);

      // Only this user's notes: users/{uid}/notes
      const q = query(collection(db, 'users', u.uid, 'notes'), orderBy('updatedAt', 'desc'));
      unsubNotes = onSnapshot(
        q,
        (snap) => {
          setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          Alert.alert('Unable to Load Notes', getErrorMessage(err));
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubNotes) unsubNotes();
    };
  }, []);

  const confirmDelete = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
          } catch (e) {
            Alert.alert('Delete Failed', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  const formatDate = (ts) => (ts?.toDate ? ts.toDate().toLocaleDateString() : '');

  const renderNote = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/note', params: { id: item.id } })}
      className="bg-[#18181B] border border-gray-800 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>
            {item.title || 'Untitled'}
          </Text>
          <Text className="text-gray-400 text-sm" numberOfLines={2}>
            {item.content}
          </Text>
          <Text className="text-gray-600 text-xs mt-2">{formatDate(item.updatedAt)}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} hitSlop={10}>
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0E]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-4">
        <View>
          <Text className="text-gray-400 text-sm">Welcome back, {user?.displayName || 'there'}</Text>
          <Text className="text-white text-3xl font-black">
            My<Text className="text-[#00E676]">Notes</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => signOut(auth)}
          className="bg-[#18181B] border border-gray-800 px-4 py-2.5 rounded-2xl"
        >
          <Text className="text-white text-xs font-bold tracking-wider uppercase">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#00E676" size="large" />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-24">
              <Ionicons name="document-text-outline" size={56} color="#3F3F46" />
              <Text className="text-gray-500 text-base mt-3">No notes yet</Text>
              <Text className="text-gray-600 text-sm">Tap the + button to create your first note.</Text>
            </View>
          }
        />
      )}

      {/* Add button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/note')}
        className="absolute bottom-8 right-6 w-16 h-16 bg-[#00E676] rounded-full justify-center items-center"
      >
        <Ionicons name="add" size={32} color="#0B0B0E" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}