import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = () => (
  <View style={styles.container}>
    <Text>Profile Screen</Text>
  </View>
);

export default Profile;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
});
