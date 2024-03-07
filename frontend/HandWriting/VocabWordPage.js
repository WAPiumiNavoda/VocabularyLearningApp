import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import { useRoute } from "@react-navigation/native"

const VocabWordPage = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const route = useRoute()
  const character = route.params?.character
console.log("Predicted Character "  + character);
 

  const data = [
    { character: ['C', ' ', 'T'], image: require('../App/assets/cat.jpg'), voice: require('../assets/voice/dog.mp3'),answer:'A' },
    { character: ['D', 'O', ' '], image: require('../App/assets/dog.jpeg'), voice: require('../assets/voice/dog.mp3'),answer:'G' },
    { character: ['M', 'A', ' '], image: require('../App/assets/mat.png'), voice: require('../assets/voice/dog.mp3') , answer:'T'}
  ];

  useEffect(() => {
    if (route.params?.currentIndex !== undefined) {
      setCurrentIndex(route.params.currentIndex);
    }
  }, [route.params?.currentIndex]);
  
  
  
  const navigateToDrawingPage = () => {
    navigation.navigate('DrawingScreen', { currentIndex });
  };

  const handleForward = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    // playSound((currentIndex + 1) % data.length);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    //playSound((currentIndex - 1 + data.length) % data.length);
  };

  const checkAnswer = (index) => {
    if (data[index].answer === character) {
      // Correct answer logic here
      console.log("Correct answer!");
    } else {
      // Incorrect answer logic here
      console.log("Incorrect answer!");
    }
  };

  return (
    <ImageBackground
      source={require('../App/assets/word.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={data[currentIndex].image}
          style={styles.imageStyle}
        />
        <View style={styles.squareContainer}>
          {data[currentIndex].character.map((char, index) => (
            <View key={index} style={styles.square}>
              <Text style={styles.text}>{char}</Text>
            </View>
          ))}
        </View>

        {/* <View style={styles.audioButtonContainer}>
          <Button title="Play Audio" onPress={() => playSound(currentIndex)} />
        </View> */}
        <View style={styles.buttonContainer}>
          <Icon.Button
            name="arrow-left"
            backgroundColor="#2196F3"
            onPress={() => { handleBack(); checkAnswer(currentIndex); }}
          >
            Back
          </Icon.Button>
          
          <View style={{ flex: 1 }} />
          <Icon.Button
            name="arrow-right"
            backgroundColor="#2196F3"
            onPress={() => { handleForward(); checkAnswer(currentIndex); }}
          >
            Forward
          </Icon.Button>
        </View>
        <View style={styles.buttonContainer1}>
          <Button title="Go to Drawing Page" onPress={navigateToDrawingPage} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50
  },
  squareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  square: {
    width: 120,
    borderRadius: 20, 
    height: 120,
    backgroundColor: '#0A1D56',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#F2F597',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonContainer1: {
    marginTop:20,
    marginBottom: 10,
  },
  audioButtonContainer: {
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '100%', 
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 20
  },
});

export default VocabWordPage;
