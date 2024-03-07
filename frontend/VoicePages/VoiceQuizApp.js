import { View, Text, TouchableOpacity,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../App/Shared/Colors';
import { useAuth } from '../Auth/AuthProvider';
import { db } from '../App/Services/config';

export default function VoiceQuizeApp() {
    const navigation = useNavigation();
    const [userLevel, setUserLevel] = useState('');
    const { userId } = useAuth();
    console.log("main level" + userLevel);

    useEffect(() => {
      const fetchUserLevel = async () => {
        try {
          const userDoc = await db.collection('register').doc(userId).get();
          const userData = userDoc.data();
          if (userData) {
            setUserLevel(userData.level || '');
          }
        } catch (error) {
          console.error('Error fetching user level:', error);
        }
      };
  
      fetchUserLevel();
    }, [userId]);
  
  
    return (
      <View style={style.container}>
        <View style={style.catregoryContainer}>
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Fruits' })}
          >
            <Text style={style.categoryTitle}>Fruits</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={style.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Commands' })}
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
        shadowColor: Colors.green,
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