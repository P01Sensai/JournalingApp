import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

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
        <Ionicons
          name="heart"
          size={20}
          color="#ef4444"
          style={styles.heartIcon}
        />
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
        <Ionicons name="heart" size={22} color="#ef4444" />
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
  heartIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
});
