import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, PanResponder, ImageBackground, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useRoute } from "@react-navigation/native"

const DrawingScreen = ({ navigation, route }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [strokeColor, setStrokeColor] = useState('black');
  const [predictedCharacter, setPredictedCharacter] = useState(null);
  const canvasRef = useRef(null);
  const { wordIndex } = route.params;

  const handleDrawStart = (x, y) => {
    setCurrentPath([{ x, y }]);
  };

  const handleDrawMove = (x, y) => {
    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const handleDrawEnd = () => {
    if (currentPath.length > 0) {
      setPaths((prevPaths) => [...prevPaths, { path: currentPath, color: strokeColor }]);
    }
    setCurrentPath([]);
  };

  const handleClear = () => {
    setPaths([]);
  };

  const handleColorChange = (color) => {
    setStrokeColor(color);
  };

  const handleCapture = async () => {
    try {
      const uri = await captureRef(canvasRef, {
        format: 'jpg',
        quality: 0.8,
      });
      console.log('Screenshot captured:', uri);
      
      // Make API call to predict character
      await predictCharacter(uri);

    } catch (error) {
      console.error('Error while capturing screenshot:', error);
    }
  };

  const predictCharacter = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'drawing.jpg',
      });

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to predict character.');
      }

      const data = await response.json();
      setPredictedCharacter(data.predicted_character);
      // navigation.navigate("VocabWordPage", { character: data.predicted_character  })
      navigation.navigate("PlayGround", { drawnCharacter: data.predicted_character, wordIndex });


    } catch (error) {
      console.error('Error while predicting character:', error);
      Alert.alert('Prediction Error', 'Failed to predict character.');
    }
  };

  const renderPaths = () => {
    return paths.map(({ path, color }, index) => (
      <View key={index}>
        {path.map((point, index) => (
          <View key={index} style={[styles.point, { backgroundColor: color, left: point.x, top: point.y }]} />
        ))}
      </View>
    ));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event, gestureState) => {
      const { locationX, locationY } = event.nativeEvent;
      handleDrawStart(locationX, locationY);
    },
    onPanResponderMove: (event, gestureState) => {
      const { locationX, locationY } = event.nativeEvent;
      handleDrawMove(locationX, locationY);
    },
    onPanResponderRelease: () => {
      handleDrawEnd();
    },
  });

  return (
    <ImageBackground
      source={require('./../App/assets/pad.jpeg')}
      style={styles.container}
    >
      {/* Your drawing canvas */}
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <ImageBackground 
          // source={require('../assets/pad.jpg')} 
          style={styles.canvas} 
          ref={canvasRef}
        >
          {renderPaths()}
        </ImageBackground>
      </View>
      {/* color palette */}
      <View style={styles.controls}>
  {['black', 'red', 'blue', 'green', 'white'].map((color) => (
    <TouchableOpacity
      key={color}
      onPress={() => handleColorChange(color)}
      style={[styles.colorButton, { backgroundColor: color }]}
    />
  ))}
  <TouchableOpacity onPress={handleClear} style={styles.button}>
    <Text style={styles.buttonText}>Clear</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={handleCapture} style={styles.button}>
    <Text style={styles.buttonText}>Done</Text>
  </TouchableOpacity>
</View>
      {/* Predicted character display */}
      <View style={styles.predictionContainer}>
        {predictedCharacter && <Text>Predicted Character: {predictedCharacter}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    width: '70%', // Adjust this as needed
    height: '52%', // Adjust this as needed
    borderWidth: 2,
    borderColor: '#FFD28F', // Border color is now purple
    marginBottom: 20,
    position: 'relative',
    borderRadius: 20, // Cover corners
    overflow: 'hidden', // Hide overflow content
  },
  canvas: {
    flex: 1,
    resizeMode: 'cover',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  predictionContainer: {
    marginTop: 20,
  },

  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});


export default DrawingScreen;
