import { View, Text, TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../App/Shared/Colors';
import { useAuth } from '../../Auth/AuthProvider';

export default function QuizHomeIntermediate() {
    const navigation = useNavigation();
    const { userId }  = useAuth();
    console.log("user writing id" + userId);
  
    return (
      <View style={style.container}>
        <View style={style.catregoryContainer}>
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainWritingPage', { category: 'Adjectives' })}
          >
            <Text style={style.categoryTitle}>Adjectives</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainWritingPage', { category: 'Noun' })}
          >
            <Text style={style.categoryTitle}>Noun</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('MainWritingPage', { category: 'Verbs' })}
          >
            <Text style={style.categoryTitle}>Verbs</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('PlayGround', { category: 'Adverbs' })}
          >
            <Text style={style.categoryTitle}>Adverbs</Text>
          </TouchableOpacity>
  
        </View>
      </View>
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
        marginTop: 150
    },
    category: {
        width:150,
        height: 150,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: Colors.primary,
        shadowOpacity: 5,
        elevation: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    categoryTitle: {
        fontFamily:'outfit',
        fontWeight:'bold',
        textAlign:'center',
        color: Colors.primary
    }

})