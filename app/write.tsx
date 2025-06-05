import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

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

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!date) return;

        const loadEntries = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                const allEntries: EntryType[] = saved ? JSON.parse(saved) : [];

                const entriesForDate = allEntries
                    .filter((e) => e.date === date)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setEntries(entriesForDate);
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

            setEntries(updatedEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const onEdit = (id: string, currentText: string) => {
        setEditingEntryId(id);
        setTextInputValue(currentText);
        setTimeout(() => inputRef.current?.focus(), 100);
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

        let updatedEntries: EntryType[];

        if (editingEntryId === 'new') {
            const newEntry: EntryType = {
                id: Date.now().toString(),
                date: date!,
                text: textInputValue.trim(),
                createdAt: new Date().toISOString(),
            };
            updatedEntries = [newEntry, ...entries];
        } else {
            updatedEntries = entries.map((entry) =>
                entry.id === editingEntryId
                    ? { ...entry, text: textInputValue.trim(), updatedAt: new Date().toISOString() }
                    : entry
            );
        }

        saveEntries(updatedEntries);
    };

    const onDelete = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const updated = entries.filter((entry) => entry.id !== id);
                    await saveEntries(updated);
                },
            },
        ]);
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Top Bar with Back Button */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => router.push('/entries')}>
                        <Ionicons name="arrow-back" size={24} color="#92400e" />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#92400e' }}>{date}</Text>
                        <Text style={{ fontSize: 14, color: '#b45309' }}>{getDayName(date!)}</Text>
                    </View>
                </View>

                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
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
                            }}
                        >
                            <Text style={{ color: '#444', fontSize: 16, marginBottom: 6 }}>{entry.text}</Text>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                {entry.updatedAt ? 'Updated' : 'Created'}: {format(new Date(entry.updatedAt || entry.createdAt), 'dd MMM yyyy, p')}
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                                <TouchableOpacity
                                    onPress={() => onEdit(entry.id, entry.text)}
                                    style={{ marginRight: 10 }}
                                >
                                    <Ionicons name="create-outline" size={22} color="#f59e0b" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onDelete(entry.id)}>
                                    <Ionicons name="trash-outline" size={22} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Add Entry Button */}
                {editingEntryId !== 'new' && (
                    <TouchableOpacity
                        onPress={onAddNew}
                        style={{
                            backgroundColor: '#f59e0b',
                            padding: 14,
                            borderRadius: 28,
                            alignItems: 'center',
                            marginTop: 12,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>＋ Add Entry</Text>
                    </TouchableOpacity>
                )}

                {/* Input Field */}
                {editingEntryId !== null && (
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 16,
                            marginTop: 12,
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <TextInput
                            ref={inputRef}
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
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
