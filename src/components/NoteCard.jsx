import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { formatDateTime } from '../utils/dateFormat';

export default function NoteCard({ note, onPress, onDelete }) {
  const { colors } = useTheme();

  const created = formatDateTime(note.createdAt);
  const updated = formatDateTime(note.updatedAt);

  // Old notes may have no dates, in which case nothing is shown (and nothing crashes)
  const dateLines = [];
  if (created && updated && created !== updated) {
    dateLines.push(`Updated ${updated}`, `Created ${created}`);
  } else if (created) {
    dateLines.push(`Created ${created}`);
  } else if (updated) {
    dateLines.push(`Updated ${updated}`);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text numberOfLines={1} style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
            {note.title || 'Untitled'}
          </Text>

          {note.content ? (
            <Text numberOfLines={2} style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              {note.content}
            </Text>
          ) : null}

          {dateLines.length > 0 ? (
            <View style={{ marginTop: 10 }}>
              {dateLines.map((line) => (
                <Text key={line} style={{ color: colors.textMuted, fontSize: 11, lineHeight: 16 }}>
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <TouchableOpacity onPress={onDelete} hitSlop={10} accessibilityLabel="Delete note">
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}