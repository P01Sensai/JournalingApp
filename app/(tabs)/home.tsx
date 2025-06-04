import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const quotes = [
  "What made you smile today?",
  "Write about your favorite moment today.",
  "Describe something you learned recently.",
  "What are you grateful for right now?",
  "Recall a challenge and how you overcame it."
];

const STORAGE_KEY = '@journal_entries';

export default function HomeScreen() {
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Initialize to today in 'YYYY-MM-DD' format
    return new Date().toISOString().split('T')[0];
  });

  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  const loadEntriesAndMarkDates = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(STORAGE_KEY);
      const entries = savedEntries ? JSON.parse(savedEntries) : [];

      const marks: Record<string, any> = {};
      entries.forEach((entry: any) => {
        marks[entry.date] = {
          marked: true,
          dotColor: '#f59e0b',
        };
      });

      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: '#f59e0b',
      };

      setMarkedDates(marks);
    } catch (error) {
      console.error('Failed to load entries:', error);
      setMarkedDates({
        [selectedDate]: {
          selected: true,
          selectedColor: '#f59e0b',
        },
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    loadEntriesAndMarkDates();

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Helper to check if date is in the future compared to today
  const isFutureDate = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    // Reset times for accurate day comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  const onDayPress = (day: DateData) => {
    if (isFutureDate(day.dateString)) {
      Alert.alert(
        "Can't add future entries",
        "You cannot add or edit entries for future dates."
      );
      return;
    }

    setSelectedDate(day.dateString);
    router.push({
      pathname: '/write',
      params: { date: day.dateString },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8E7]">
      {/* Top Bar - Welcome */}
      <View className="bg-yellow-200 px-6 py-4">
        <Text className="text-2xl font-bold text-black">
          Welcome back, Pramanshu 👋
        </Text>
        <Text className="text-base text-gray-800 mt-1">
          Ready to capture your thoughts today?
        </Text>
      </View>

      {/* Calendar */}
      <View className="px-6 pt-4">
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            todayTextColor: '#b45309',
            arrowColor: '#b45309',
            monthTextColor: '#92400e',
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
          }}
          style={{
            borderRadius: 16,
            backgroundColor: 'white',
            elevation: 3,
          }}
          // Also disable future dates in calendar UI (optional)
          maxDate={new Date().toISOString().split('T')[0]}
        />
      </View>

      {/* Rest of screen */}
      <View className="flex-1 bg-[#FFF9F0] px-6 py-8 justify-between">
        {/* Quotes View */}
        <View className="bg-white p-6 rounded-2xl shadow-md min-h-[120px] justify-center mb-10">
          <Text className="text-gray-800 text-base italic text-center">
            {quotes[quoteIndex]}
          </Text>
        </View>

        {/* Action View */}
        <View className="bg-black rounded-2xl py-5">
          <TouchableOpacity onPress={() => router.push('/write')}>
            <Text className="text-center text-white text-lg font-semibold">
              Start Writing ✍️
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
