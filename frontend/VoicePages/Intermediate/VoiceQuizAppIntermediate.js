import { View, Text, TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../App/Shared/Colors';



export default function VoiceQuizAppIntermediate() {
    const navigation = useNavigation();
    console.log("come here next level");
  
    return (
      <View style={style.container}>
        <View style={style.catregoryContainer}>
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainScreenIntermediate', { category: 'Fruits' })}
          >
            <Text style={style.categoryTitle}>Fruits</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainScreenIntermediate', { category: 'Commands' })}
          >
            <Text style={style.categoryTitle}>Commands</Text>
          </TouchableOpacity>
  
          {/* <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Numbers' })}
          >
            <Text style={style.categoryTitle}>Numbers</Text>
          </TouchableOpacity> */}
  
         
        </View>
      </View>
    );
  }
  

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    catregoryContainer: {
        flexDirection: 'row',
        flexWrap:'wrap',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 50
    },
    category: {
        width:150,
        height: 150,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: Colors.black,
        shadowOpacity: 5,
        elevation: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    categoryTitle: {
        fontFamily:'outfit',
        fontWeight:'bold',
        textAlign:'center',
        color: Colors.green,
    }

})