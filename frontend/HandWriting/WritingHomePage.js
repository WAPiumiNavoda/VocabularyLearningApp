import { View, Text } from 'react-native'
import React from 'react'
import VideoScreen from '../App/HomeScreens/VideoScreen'
import WritingTaskList from './WritingTaskList'

export default function WritingHomePage() {
  return (
    <View>
        <WritingTaskList />
    </View>
  )
}