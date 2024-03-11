import { View, Text, TouchableOpacity,StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../App/Shared/Colors';
import { useAuth } from '../../Auth/AuthProvider';

export default function QuizHomeSimple() {
    const navigation = useNavigation();
    const { userId }  = useAuth();
    console.log("user writing id" + userId);
  
    return (
      <ImageBackground
      source={require("../../App/assets/writebg.png")} 
      style={style.background2}
    >
      <View style={style.container}>
        <View style={style.catregoryContainer}>
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainScreenWritingPageSimple', { category: 'Adjectives' })}
          >
            <Text style={style.categoryTitle}>Adjectives</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainScreenWritingPageSimple', { category: 'Noun' })}
          >
            <Text style={style.categoryTitle}>Noun</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainScreenWritingPageSimple', { category: 'Verbs' })}
          >
            <Text style={style.categoryTitle}>Verbs</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainScreenWritingPageSimple', { category: 'Adverbs' })}
          >
            <Text style={style.categoryTitle}>Adverbs</Text>
          </TouchableOpacity>
  
        </View>
      </View>
      </ImageBackground>
    );
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
    marginTop: 90,
},
category: {
    width: 90,
    height: 90,
    margin: 10,
    borderRadius: 180,
    backgroundColor: '#fff',
    shadowColor: Colors.red,
    shadowOpacity: 6,
    elevation: 2,
    justifyContent:'center',
    alignItems:'center'
},
categoryTitle: {
    fontFamily:'outfit',
    fontWeight:'bold',
    textAlign:'center',
    color: Colors.red
},
background2: {
  flex: 1,
  resizeMode: "cover",
  justifyContent: "center",
},

})