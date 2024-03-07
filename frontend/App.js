import React, { useState, useEffect } from 'react';
import Login from './App/Screens/Login';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { AuthProvider } from './Auth/AuthProvider';

export default App = () => {

  const [fontsLoaded] = useFonts({
    'outfit' : require('./assets/fonts/Outfit-Regular.ttf'),
    'outfi-bold' : require('./assets/fonts/Outfit-Bold.ttf'),
    'outfi-bold-extra' : require('./assets/fonts/Outfit-ExtraBold.ttf'),
    'outfit-medium': require('./assets/fonts/Outfit-Medium.ttf')
})
 
  return (
    <AuthProvider>
    <View style={styles.container} >
    <SafeAreaView style={styles.container}>
          <Login />
      </SafeAreaView>
  </View>
  </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50
  }
})