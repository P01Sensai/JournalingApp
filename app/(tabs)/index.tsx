import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Home from './home';
import Profile from './profile';

const Tab = createBottomTabNavigator();

// Define a safe Ionicon type
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => (
            <Text style={{ fontWeight: focused ? 'bold' : 'normal', color }}>
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => (
            <Text style={{ fontWeight: focused ? 'bold' : 'normal', color }}>
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
