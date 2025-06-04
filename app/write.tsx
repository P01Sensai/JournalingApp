import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function WriteScreen() {
  const { date } = useLocalSearchParams();
  const router = useRouter();

  const [entry, setEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = '@journal_entries';

  useEffect(() => {
    if (!date) return;

    const loadEntryForDate = async () => {
      try {
        const savedEntries = await AsyncStorage.getItem(STORAGE_KEY);
        const entries = savedEntries ? JSON.parse(savedEntries) : [];

        const foundEntry = entries.find((e: any) => e.date === date);
        if (foundEntry) {
          setEntry(foundEntry.text);
          setIsEditing(false); // Show read-only view initially
        } else {
          setEntry('');
          setIsEditing(true); // No entry, show input by default
        }
      } catch (error) {
        console.error('Error loading entry for date:', error);
        setEntry('');
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    loadEntryForDate();
  }, [date]);

  const handleSave = async () => {
    if (!entry.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }
    if (!date) {
      Alert.alert('Error', 'No date selected.');
      return;
    }

    try {
      const savedEntries = await AsyncStorage.getItem(STORAGE_KEY);
      const entries = savedEntries ? JSON.parse(savedEntries) : [];

      const entryIndex = entries.findIndex((e: any) => e.date === date);

      if (entryIndex >= 0) {
        entries[entryIndex].text = entry.trim();
        entries[entryIndex].updatedAt = new Date().toISOString();
      } else {
        entries.unshift({
          id: Date.now().toString(),
          date,
          text: entry.trim(),
          createdAt: new Date().toISOString(),
        });
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      Alert.alert('Saved ✅', 'Your journal entry has been saved.');
      setIsEditing(false); // Switch to read-only view after save
    } catch (error) {
      Alert.alert('Error', 'Failed to save your entry.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF8E7]">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8E7] px-6 pt-12">
      <Text className="text-2xl font-bold text-black mb-4">
        Writing for: {date}
      </Text>

      {isEditing ? (
        <>
          <TextInput
            multiline
            placeholder="Start journaling here..."
            value={entry}
            onChangeText={setEntry}
            className="h-64 text-base bg-white p-4 rounded-2xl shadow-md text-gray-800"
          />

          <TouchableOpacity
            onPress={handleSave}
            className="bg-black py-4 rounded-2xl mt-6"
          >
            <Text className="text-center text-white text-lg font-semibold">
              Save Entry 💾
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View className="bg-white p-6 rounded-2xl shadow-md min-h-[120px]">
            <Text className="text-gray-800 text-base">{entry}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="bg-yellow-500 py-4 rounded-2xl mt-6"
          >
            <Text className="text-center text-black text-lg font-semibold">
              Edit Entry ✏️
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}
