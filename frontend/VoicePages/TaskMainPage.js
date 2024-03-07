import React, { useState } from 'react';
import { View, Text, TouchableOpacity,ImageBackground, Alert, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Audio } from 'expo-av';
import { useNavigation } from "@react-navigation/native";

const TaskMainPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictedKeyword, setPredictedKeyword] = useState(null);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const navigation = useNavigation();
  


  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording...');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setSelectedFile(uri);
  };

  const playSound = async () => {
    console.log('Playing sound..');
    const { sound } = await Audio.Sound.createAsync({ uri: selectedFile });
    setSound(sound);
    await sound.playAsync();
  };

  const predictKeyword = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please record audio first');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedFile,
      type: 'audio/wav', 
      name: 'recorded_audio.wav',
    });

    try {
      const response = await fetch('http://localhost:8000/predictvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to predict keyword');
      }

      const result = await response.json();
      setPredictedKeyword(result.predicted_keyword);
      navigation.navigate('MainScreenWriting', { predictedKeyword : result.predicted_keyword  });
    } catch (error) {
      console.error('Error predicting keyword:', error.message);
    }
  };

  return (
    <ImageBackground
    source={require('../App/assets/pad.jpeg')}
    style={styles.backgroundImageVoice}
  >
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={startRecording}>
          <Ionicons name="mic" size={24} color="white" />
          <Text style={styles.buttonText}>Recording</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={stopRecording} disabled={!recording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      </View>
  
      {/* <Image source={require('../App/assets/cat.jpg')} style={styles.image} /> */}
  
      {selectedFile && (
        <TouchableOpacity style={styles.button3} onPress={playSound}>
          <Text style={styles.buttonText}>Play Recorded Audio</Text>
        </TouchableOpacity>
      )}
  
      <TouchableOpacity style={styles.button4} onPress={predictKeyword} disabled={!selectedFile}>
        <Text style={styles.buttonText}>Predict Keyword</Text>
      </TouchableOpacity>
      {predictedKeyword && <Text style={styles.predictedKeyword}>Predicted Keyword: {predictedKeyword}</Text>}
    </View>

    
  </ImageBackground>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    margin: 5,
    marginTop: 88,
    borderRadius: 5,
  },
  button2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 88,
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 14,
     marginBottom:'70px',
    margin: 6,
    borderRadius: 5,
  },
  button3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  button4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
  predictedKeyword: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 90,
    marginBottom: 40,
    resizeMode: "contain"
  },
  buttonContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20,
  },
  backgroundImageVoice: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default TaskMainPage;
