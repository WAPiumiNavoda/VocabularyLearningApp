import { View, Text, StyleSheet } from 'react-native'
import React, { Profiler } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LeaderBoard from '../Screens/LeaderBoard';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import HomeScreenNavigation from './HomeScreenNavigation';
import VoiceQuizApp from '../../VoicePages/VoiceQuizApp';
import QuizHome from '../../HandWriting/Quiz/QuizHome';
import Colors from '../Shared/Colors';
import LetterTask from '../HomeScreens/LettersTask';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
      tabBarOptions={{
        style: styles.tabBar,
        activeTintColor: Colors.primary, // Color for the active tab
        
      }}
    >
      <Tab.Screen name="home" component={HomeScreenNavigation} 
        options={{
          tabBarIcon:({color,size}) => (
            <FontAwesome name="home" size={size} color={color} />
          )   
        }}
      />
      <Tab.Screen name="writing" component={LetterTask}
        options={{
          tabBarIcon:({color,size}) => (
            <FontAwesome name="book" size={size} color={color} />
          )   
        }}
      />
      <Tab.Screen name="voice" component={VoiceQuizApp} 
        options={{
          tabBarIcon:({color,size}) => (
            <MaterialIcons name="settings-voice" size={24} color="black" />
          )   
        }}
      />
      <Tab.Screen name="profile" component={LeaderBoard} 
        options={{
          tabBarIcon:({color,size}) => (
            <AntDesign name="profile" size={24} color="black" /> 
          )   
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff', // Background color for the tab bar
    borderTopWidth: 1, // Top border width
    borderTopColor: '#ccc', // Top border color
    paddingTop: 5, // Top padding
    paddingBottom: 3, // Bottom padding
  },
});
