import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground,TextInput } from 'react-native';
import Colors from '../../App/Shared/Colors';
import { Ionicons } from '@expo/vector-icons';

const images = [
  require('../../App/assets/edu.jpeg'),
  require('../../App/assets/login.png'),
  require('../../App/assets/edu1.png'),
];

export default function SlideShowScreenWriting() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={images[currentImageIndex]} style={styles.image}>
        <View style={styles.overlay}>
          <View style={styles.searchContainer}>
            <TextInput placeholder='Search Vocabulary Course' style={styles.input} />
            <Ionicons name="search" size={30} color={Colors.primary} style={styles.searchIcon} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 80,
    paddingHorizontal: 50, 
    zIndex: 1, 
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderRadius: 99,
    borderColor:Colors.primary,
    borderWidth:3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding :10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: Colors.black,
    fontFamily: 'outfit',
    fontSize: 18,
  },
  searchIcon: {
    marginLeft: 10,
  },
});
