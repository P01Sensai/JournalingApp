import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';


const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const STORAGE_KEY = '@journal_entries';

type EntryType = {
  id: string;
  date: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
};

export default function WriteScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();

  const [entries, setEntries] = useState<EntryType[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [textInputValue, setTextInputValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;

    const loadEntries = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const allEntries: EntryType[] = saved ? JSON.parse(saved) : [];

     
        const entriesForDate = allEntries.filter((e) => e.date === date);
        setEntries(entriesForDate);

        
        setEditingEntryId(null);
        setTextInputValue('');
      } catch (e) {
        console.error('Load error', e);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [date]);

  const saveEntries = async (updatedEntries: EntryType[]) => {
    try {
      
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const allEntries: EntryType[] = saved ? JSON.parse(saved) : [];

     
      const filtered = allEntries.filter((e) => e.date !== date);

      
      const combined = [...filtered, ...updatedEntries];

      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(combined));

      
      setEntries(updatedEntries);
      setEditingEntryId(null);
      setTextInputValue('');
      Alert.alert('Saved ✅', 'Your entry has been saved.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save entry.');
      console.error(e);
    }
  };

  const onAddNew = () => {
    setEditingEntryId('new'); 
    setTextInputValue('');
  };

  const onEdit = (id: string, currentText: string) => {
    setEditingEntryId(id);
    setTextInputValue(currentText);
  };

  const onCancelEdit = () => {
    setEditingEntryId(null);
    setTextInputValue('');
  };

  const onSaveEdit = () => {
    if (!textInputValue.trim()) {
      Alert.alert('Empty Entry', 'Please enter some text before saving.');
      return;
    }

    let updatedEntries: EntryType[] = [];

    if (editingEntryId === 'new') {
      // Add new entry
      const newEntry: EntryType = {
        id: Date.now().toString(),
        date: date!,
        text: textInputValue.trim(),
        createdAt: new Date().toISOString(),
      };
      updatedEntries = [newEntry, ...entries];
    } else {
      // Update existing entry
      updatedEntries = entries.map((entry) =>
        entry.id === editingEntryId
          ? { ...entry, text: textInputValue.trim(), updatedAt: new Date().toISOString() }
          : entry
      );
    }

    saveEntries(updatedEntries);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#FFF8E7]">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8E7', paddingHorizontal: 20, paddingTop: 16 }}>
      {/* Date and Day top right */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#92400e' }}>{date}</Text>
          <Text style={{ fontSize: 14, color: '#b45309' }}>{getDayName(date!)}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        {/* Existing entries list */}
        {entries.length === 0 && editingEntryId !== 'new' && (
          <Text style={{ fontSize: 16, color: '#555', textAlign: 'center', marginVertical: 24 }}>
            No entries yet for this date.
          </Text>
        )}

        {entries.map((entry) => (
          <View
            key={entry.id}
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              position: 'relative',
            }}
          >
            <Text style={{ color: '#444', fontSize: 16, marginBottom: 8 }}>{entry.text}</Text>
            <TouchableOpacity
              onPress={() => onEdit(entry.id, entry.text)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: '#fbbf24', 
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#92400e', fontWeight: '600' }}>Edit ✏️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add new entry button */}
      {editingEntryId !== 'new' && (
        <TouchableOpacity
          onPress={onAddNew}
          style={{
            backgroundColor: '#f59e0b', 
            padding: 14,
            borderRadius: 28,
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>＋ Add Entry</Text>
        </TouchableOpacity>
      )}

      {/* Text Input for editing or adding */}
      {editingEntryId !== null && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <TextInput
              multiline
              placeholder="Write your journal entry..."
              value={textInputValue}
              onChangeText={setTextInputValue}
              style={{
                minHeight: 100,
                fontSize: 16,
                color: '#333',
                textAlignVertical: 'top',
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity
                onPress={onCancelEdit}
                style={{
                  backgroundColor: '#ef4444', 
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSaveEdit}
                style={{
                  backgroundColor: '#10b981', 
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
