import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import Home from './home';
import Entries from './entries';
import Profile from './profile';

const Tab = createBottomTabNavigator();

// Define the icon name type exactly as Ionicons expects
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconName; // use strict typing here

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'entries') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle'; // fallback icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#FFF8E7' }, // light warm yellow
      })}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="entries"
        component={Entries}
        options={{ title: 'Entries' }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
