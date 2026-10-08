import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { getErrorMessage } from "../utils/errorMessages";
import { getTimeValue } from "../utils/dateFormat";
import { useTheme } from "../theme/ThemeContext";
import { useDialog } from "../components/DialogProvider";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import ThemeToggle from "../components/ThemeToggle";
import IconButton from "../components/IconButton";
import EmptyState from "../components/EmptyState";

// Newest first. Falls back to createdAt, and notes without any date go to the bottom.
const sortTime = (note) =>
  getTimeValue(note.updatedAt) || getTimeValue(note.createdAt);

export default function NotesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showDialog } = useDialog();

  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let unsubNotes = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/");
        return;
      }
      setUser(u);

      // No orderBy here on purpose: Firestore hides notes that miss that field.
      // We sort in the app instead, so old notes without dates still show up.
      unsubNotes = onSnapshot(
        collection(db, "users", u.uid, "notes"),
        (snap) => {
          const list = snap.docs.map((d) => ({
            id: d.id,
            // 'estimate' gives a temporary time to a note that is still being saved
            ...d.data({ serverTimestamps: "estimate" }),
          }));
          list.sort((a, b) => sortTime(b) - sortTime(a));
          setNotes(list);
          setLoadError("");
          setLoading(false);
        },
        (err) => {
          setLoadError(getErrorMessage(err));
          setLoading(false);
        },
      );
    });

    return () => {
      unsubAuth();
      if (unsubNotes) unsubNotes();
    };
  }, []);

  // Live search: title + content, ignoring capital / small letters
  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter((note) => {
      const title = String(note.title ?? "").toLowerCase();
      const content = String(note.content ?? "").toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  }, [notes, search]);

  const confirmDelete = (id) => {
    showDialog({
      title: "Delete Note",
      message:
        "Are you sure you want to delete this note? This action cannot be undone.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, "users", auth.currentUser.uid, "notes", id),
              );
            } catch (e) {
              showDialog({
                title: "Delete Failed",
                message: getErrorMessage(e),
              });
            }
          },
        },
      ],
    });
  };

  const performLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      showDialog({ title: "Sign Out Failed", message: getErrorMessage(e) });
    }
  };

  // Ask for confirmation before signing the user out
  const handleLogout = () => {
    showDialog({
      title: "Log Out",
      message: "Are you sure you want to log out of your account?",
      buttons: [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: performLogout },
      ],
    });
  };

  const renderEmpty = () => {
    if (loadError) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Could not load your notes"
          subtitle={loadError}
        />
      );
    }
    if (search.trim()) {
      const term = search.trim();
      const shownTerm = term.length > 30 ? `${term.slice(0, 30)}...` : term;
      return (
        <EmptyState
          icon="search-outline"
          title="No results found"
          subtitle={`We couldn't find any notes matching "${shownTerm}". Try a different keyword.`}
        />
      );
    }
    return (
      <EmptyState
        icon="document-text-outline"
        title="No notes yet"
        subtitle="Tap the + button to create your first note."
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            numberOfLines={1}
            style={{ color: colors.textSecondary, fontSize: 14 }}
          >
            Welcome back, {user?.displayName || "there"}
          </Text>
          <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>
            My<Text style={{ color: colors.accent }}>Notes</Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemeToggle />
          <IconButton
            name="log-out-outline"
            label="Log out"
            onPress={handleLogout}
          />
        </View>
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {/* List */}
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() =>
                router.push({ pathname: "/note", params: { id: item.id } })
              }
              onDelete={() => confirmDelete(item.id)}
            />
          )}
          ListEmptyComponent={renderEmpty}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 120,
            flexGrow: 1,
          }}
        />
      )}

      {/* Add button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/note")}
        accessibilityLabel="Add note"
        style={{
          position: "absolute",
          bottom: 32,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          elevation: 6,
          shadowColor: colors.shadow,
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
