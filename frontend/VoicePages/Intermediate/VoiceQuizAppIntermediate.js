import { View, Text, TouchableOpacity,StyleSheet, Image } from 'react-native'
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
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Fruits' })}
          >
             <Image
            source={require("../../App/assets/voiceicon3.jpg")} // Specify the path to your image
            style={[style.icon,{width:50, height:70, marginBottom:13}]} // Style your image if needed
          />
            <Text style={style.categoryTitle}>Fruits</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Commands' })}
          >
               <Image
            source={require("../../App/assets/voiceicon9.png")} // Specify the path to your image
            style={[style.icon,{width:50, height:50, marginBottom:13, borderRadius:10}]} // Style your image if needed
          />
            <Text style={style.categoryTitle}>Commands</Text>
          </TouchableOpacity>
  
          {/* <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Numbers' })}
          >
            <Text style={style.categoryTitle}>Numbers</Text>
          </TouchableOpacity> */}
  
         
        </View>

        <View style={style.catregoryContainer}>
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Vegetables' })}
          >
               <Image
            source={require("../../App/assets/voiceicon2.png")} // Specify the path to your image
            style={[style.icon,{width:50, height:70, marginBottom:13}]} // Style your image if needed
          />
            <Text style={style.categoryTitle}>Vegetables</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Numbers' })}
          >
               <Image
            source={require("../../App/assets/voiceicon1.jpg")} // Specify the path to your image
            style={[style.icon,{width:50, height:70, marginBottom:13}]} // Style your image if needed
          />
            <Text style={style.categoryTitle}>Numbers</Text>
          </TouchableOpacity>
  
          {/* <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Numbers' })}
          >
            <Text style={style.categoryTitle}>Numbers</Text>
          </TouchableOpacity> */}
  
         
        </View>

        <View style={style.catregoryContainer}>
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Animals' })}
          >
               <Image
            source={require("../../App/assets/voiceicon5.jpg")} // Specify the path to your image
            style={[style.icon,{width:50, height:70, marginBottom:13}]} // Style your image if needed
          />
            <Text style={style.categoryTitle}>Animals</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Equipments' })}
          >
               <Image
            source={require("../../App/assets/voice.png")} // Specify the path to your image
            style={[style.icon,{width:50, height:70, marginBottom:13}]} // Style your image if needed
          />
            <Text style={style.categoryTitle}>Equipments</Text>
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
        marginTop: 30
    },
    category: {
        width:150,
        height: 150,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: Colors.yellow,
        shadowOpacity: 5,
        elevation: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    categoryTitle: {
        fontFamily:'outfit',
        fontWeight:'bold',
        textAlign:'center',
        color: Colors.yellow,
    }

})