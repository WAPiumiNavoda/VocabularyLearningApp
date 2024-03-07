import { View, Text, Image, StyleSheet,TextInput } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-expo';
import Colors from '../Shared/Colors';
import Coin from '../assets/coin.png'
import { Ionicons } from '@expo/vector-icons';
// import SearchBar from './SearchBar';

export default function Header() {

  const {isLoaded, user} = useUser();

  return  isLoaded &&(
    <View>
    
    <View style={[{justifyContent:'space-between'}, styles.rowStyle ]}>
      <View style={styles.rowStyle}>
          <Image source={{uri:user?.imageUrl}}
                  style={{width: 50, height:50, borderRadius:99}}
          />
          <View>
            <Text style={{color: Colors.white, fontFamily:'outfit'}}> Welcome,</Text>
            <Text style={styles.mainText}> {user?.fullName}</Text>
          </View>
      </View>
      <View style={styles.rowStyle}>
         <Image source={Coin} style={{width:35,height:35}}/>
         <Text style={[{fontSize: 22, paddingTop:3} , styles.mainText]}>3540</Text>
      </View>
    </View>

   
    <View style={[{
    backgroundColor: Colors.white, 
    paddingRight:20,
    paddingLeft:20,
    marginRight:20,
    marginLeft:20, 
    display:'flex',
     flexDirection:'row', 
     borderRadius:99,
     justifyContent:'space-between'
     } ,styles.rowStyle]}>
        <TextInput placeholder='Search Vocabulary Course' style={{color:Colors.black, fontFamily:'outfit', fontSize:18}} />
        <Ionicons name="search" size={30} color={Colors.primary} style={{marginRight:10}} />  
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainHeader:{
    color:Colors.white, 
    fontSize: 20, 
    fontFamily: 'outfit'
  },
  mainText:{
    color:Colors.white,
    fontFamily: 'outfit'
  },
  rowStyle:{
    display:'flex' , 
    flexDirection:'row', 
    gap:10, 
    alignContent:'center',
  }
})