import { View, Text } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'

export default function SubHeading({text, color=Colors.black}) {
  return (
    <View>
      <Text style= {{
        fontFamily:'outfi-bold-extra',
        fontSize:20,
        padding:8,
        color: color
       }} >{text}</Text>
    </View>
  )
}