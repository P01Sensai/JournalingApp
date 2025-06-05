import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const quotes = [
  "What made you smile today?",
  "Write about your favorite moment today.",
  "Describe something you learned recently.",
  "What are you grateful for right now?",
  "Recall a challenge and how you overcame it."
];

const lightColors = [
  '#FFFBEB', 
  '#E0F2FE', 
  '#FEF3C7', 
  '#FEE2E2', 
  '#ECFDF5', 
  '#F0F9FF', 
  '#FFF1F2', 
];

export default function HomeScreen() {
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteBgColor, setQuoteBgColor] = useState(lightColors[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();

      setQuoteIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % quotes.length;

        let newColor = quoteBgColor;
        while (newColor === quoteBgColor) {
          newColor = lightColors[Math.floor(Math.random() * lightColors.length)];
        }
        setQuoteBgColor(newColor);

        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim, quoteBgColor]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    router.push({
      pathname: '/write',
      params: { date: day.dateString },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8E7' }}>
      {/* Top Bar - Welcome + Plus icon */}
      <View
        style={{
          backgroundColor: '#FEF3C7',
          paddingHorizontal: 24,
          paddingVertical: 16,
          paddingRight: 16, 
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, paddingRight: 12  }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#000' }}>
              Welcome back, Pramanshu 👋
            </Text>
            <Text style={{ fontSize: 16, color: '#4B5563', marginTop: 4 }}>
              Ready to capture your thoughts today?
            </Text>
          </View>

          {/* Plus Icon Button */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/write',
                params: { date: new Date().toISOString().split('T')[0] },
              })
            }
            style={{
              backgroundColor: '#facc15', // amber-400
              padding: 10,
              borderRadius: 50,
              overflow: 'hidden',
            }}
            accessibilityLabel="Write new journal"
          >
            <Ionicons name="add" size={26} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#f59e0b',
            },
          }}
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
        />
      </View>

      {/* Quote Card */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF9F0',
          paddingHorizontal: 24,
          paddingVertical: 32,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            backgroundColor: quoteBgColor,
            padding: 24,
            borderRadius: 24,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            minHeight: 130,
            justifyContent: 'center',
            opacity: fadeAnim,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#4B5563',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            {quotes[quoteIndex]}
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
