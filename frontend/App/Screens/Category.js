import { View, Text , Image, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import { useNavigation } from '@react-navigation/native';

export default function Category() {

  const navigation = useNavigation();

  return (
    <View style={style.container}>
    <View style={style.catregoryContainer}>
      <TouchableOpacity 
        style={style.category}
        onPress={() => navigation.navigate('LetterTask')}
      >
        <Text style={style.categoryTitle}>Writing Task</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={style.category}
        onPress={() => navigation.navigate('VoiceQuizApp')}
      >
        <Text style={style.categoryTitle}>Voice Task</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={style.category}
        onPress={() => navigation.navigate('Quizes')}
      >
        <Text style={style.categoryTitle}>Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={style.category}
        onPress={() => navigation.navigate('PlayGround', { category: 'Adverbs' })}
      >
        <Text style={style.categoryTitle}>Dash Board</Text>
      </TouchableOpacity>

    </View>
  </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
},
catregoryContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 30
},
category: {
    width:150,
    height: 150,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: Colors.orange,
    shadowOpacity: 5,
    elevation: 5,
    justifyContent:'center',
    alignItems:'center'
},
categoryTitle: {
    fontFamily:'outfit',
    fontWeight:'bold',
    textAlign:'center',
    color: Colors.orange
}
});
