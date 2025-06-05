import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

type JournalEntry = {
  id: string;
  text: string;
  createdAt: string;
  memorable?: boolean;
};

const STORAGE_KEY = '@journal_entries';

export default function MemorableEntriesScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: JournalEntry[] = stored ? JSON.parse(stored) : [];
      const memorableEntries = parsed.filter((entry) => entry.memorable);
      setEntries(memorableEntries);
    } catch (error) {
      console.error('Failed to load memorable entries', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const allEntries: JournalEntry[] = stored ? JSON.parse(stored) : [];

            const updated = allEntries.filter((entry) => entry.id !== id);
            const updatedMemorable = updated.filter((entry) => entry.memorable);

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setEntries(updatedMemorable);
          } catch (e) {
            console.error('Failed to delete entry', e);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const date = new Date(item.createdAt);
    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryId}>JE-{item.id.slice(-6)}</Text>
          <Text style={styles.entryDate}>{format(date, 'dd MMM yyyy, EEE, p')}</Text>
        </View>
        <Text style={styles.entryText}>{item.text}</Text>

        <View style={styles.entryActions}>
          <Ionicons name="heart" size={20} color="#ef4444" />
          <TouchableOpacity onPress={() => deleteEntry(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading memorable entries...</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#6b7280' }}>No memorable entries yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/entries')}>
          <Ionicons name="arrow-back" size={22} color="#92400e" />
        </TouchableOpacity>
        <Text style={styles.title}>Memorable Entries</Text>
        <Ionicons name="heart" size={22} color="#ef4444" />
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryId: {
    fontWeight: '600',
    color: '#4b5563',
  },
  entryDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  entryText: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 20,
  },
  entryActions: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 12,
  },
});
