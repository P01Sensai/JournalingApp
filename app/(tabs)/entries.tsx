import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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

export default function EntriesScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterToday, setFilterToday] = useState(false);
  const [filterMemorable, setFilterMemorable] = useState(false);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: JournalEntry[] = stored ? JSON.parse(stored) : [];
      setEntries(parsed);
      setFilteredEntries(parsed);
    } catch (error) {
      console.error('Failed to load entries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterToday, filterMemorable, entries]);

  const applyFilters = () => {
    let result = [...entries];

    if (filterToday) {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(entry => entry.createdAt.startsWith(today));
    }

    if (filterMemorable) {
      result = result.filter(entry => entry.memorable);
    }

    setFilteredEntries(result);
  };

  const toggleMemorable = async (id: string) => {
    const updated = entries.map(entry =>
      entry.id === id ? { ...entry, memorable: !entry.memorable } : entry
    );
    setEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteEntry = async (id: string) => {
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const date = new Date(item.createdAt);
    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryId}>JE-{item.id.slice(-6)}</Text>
          <Text style={styles.entryDate}>
            {format(date, 'dd MMM yyyy, EEE, p')}
          </Text>
        </View>

        <Text style={styles.entryText}>{item.text}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => toggleMemorable(item.id)}>
            <Ionicons
              name={item.memorable ? 'heart' : 'heart-outline'}
              size={20}
              color={item.memorable ? '#ef4444' : '#9ca3af'}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteEntry(item.id)}>
            <Ionicons
              name="trash-outline"
              size={20}
              color="#ef4444"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading entries...</Text>
      </View>
    );
  }

  if (filteredEntries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#6b7280' }}>No entries match your filter.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setFilterToday(prev => !prev)}>
          <Ionicons
            name="funnel-outline"
            size={22}
            color={filterToday ? '#f59e0b' : '#6b7280'}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Your Journal Entries</Text>

        <TouchableOpacity onPress={() => setFilterMemorable(prev => !prev)}>
          <Ionicons
            name="heart"
            size={22}
            color={filterMemorable ? '#ef4444' : '#6b7280'}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEntries}
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
  actionButtons: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 16,
  },
  icon: {
    marginLeft: 12,
  },
});
