import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type JournalEntry = {
  id: string;
  text: string;
  createdAt: string;
};

const STORAGE_KEY = '@journal_entries';

export default function EntriesScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: JournalEntry[] = stored ? JSON.parse(stored) : [];
      setEntries(parsed);
    } catch (error) {
      console.error('Failed to load entries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const renderItem = ({ item }: { item: JournalEntry }) => {
    const date = new Date(item.createdAt);
    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow">
        <Text className="text-gray-800 mb-2">{item.text}</Text>
        <Text className="text-xs text-gray-500">
          {date.toLocaleString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading entries...</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">No entries saved yet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFF8E7] px-6 py-6">
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
