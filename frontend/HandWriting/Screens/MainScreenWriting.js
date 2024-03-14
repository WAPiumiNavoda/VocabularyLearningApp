import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../App/Shared/Colors";
import SlideShowScreenWriting from "./SlideShowScreenWriting";
import { saveWrongAnswersToFirebase, saveUseTaskDetails } from "../../App/Services/config";
import { useAuth } from "../../Auth/AuthProvider";

export default function MainScreenWriting({ navigation, route }) {
  //const answers = ["dataset\\cat", "dataset\\wow", "dataset\\go"];
  const { category } = route.params || {};
  
  const [userLevel, setUserLevel] = useState('');

  const initialAnswers = category === 'Fruits'
    ? ["cat", "wow", "go"]
    : category === 'Commands'
    ? ["cat", "wow", "up"]
    : [];

  console.log("Voice Category" + category);

  const [answers, setAnswers] = useState(initialAnswers);
  const [words, setWords] = useState(Array(answers.length).fill(0));
  const [predictedValues, setPredictedValues] = useState(Array(answers.length).fill(''));
  const [lastPressedIndex, setLastPressedIndex] = useState(null);
  const { userId } = useAuth();
  console.log("Dashboard log user: " +  userId);
  const [timerExpired, setTimerExpired] = useState(false);
  const [timer, setTimer] = useState(60);

  // useEffect hook to update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval); // Clear interval when timer reaches 0
          setTimerExpired(true); // Set timerExpired to true when timer runs out
          handleDonePress(); // Handle when timer runs out
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); 


  const handleMicPress = (index, predictedKeyword) => {
    const newWords = [...words];
    newWords[index] = predictedKeyword;
    setWords(newWords);

    const newPredictedValues = [...predictedValues];
    newPredictedValues[index] = predictedKeyword;
    setPredictedValues(newPredictedValues);

    setLastPressedIndex(index);
    navigation.navigate("TaskMainPage", { predictedKeyword, category  });
  };

  useEffect(() => {
    if (route.params?.predictedKeyword !== undefined && lastPressedIndex !== null) {
      const newWords = [...words];
      newWords[lastPressedIndex] = route.params.predictedKeyword;
      setWords(newWords);

      const newPredictedValues = [...predictedValues];
      newPredictedValues[lastPressedIndex] = route.params.predictedKeyword;
      setPredictedValues(newPredictedValues);
    }
  }, [route.params?.predictedKeyword]);

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (predictedValues.includes(answers[i])) {
        score++;
      }
    }
    return score;
  };

  const handleDonePress = () => {
    const score = calculateScore();
    const totalQuestions = answers.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2); 
    const scoreMessage = `Your score is ${percentage}%.`; 


    const wrongAnswers = answers.filter((answer, index) => !predictedValues.includes(answer));

    saveWrongAnswersToFirebase(wrongAnswers, userId); 
    console.log("wrong spelled words " + wrongAnswers);
    
    if (percentage >= 60) { 
      console.log("move to the next page");
      Alert.alert(
        'Quiz Result',
        scoreMessage,
        [
          {
            text: 'Next',
            onPress: () => navigation.navigate('VoiceQuizAppIntermediate')
          }
        ],
        {
          cancelable: false,
          customView: (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../App/assets/1.png')}
                style={{ width: 100, height: 100 }}
              />
            </View>
          )
        }
      );
    } else {
      Alert.alert(
        'Quiz Result',
        scoreMessage,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VoiceQuizApp')
          }
        ],
        {
          cancelable: false,
          customView: (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../App/assets/1.png')}
                style={{ width: 100, height: 100 }}
              />
            </View>
          )
        }
      );
    }

    // saveUseTaskDetails(userId,category,timer,score,wrongAnswers)
    //   .then(() => {
    //     console.log("Task data saved successfully.");
    //     // Show appropriate alert and navigate
    //   })
    //   .catch((error) => {
    //     console.error("Error saving task data:", error);
    //     // Handle error
    //   });
    

      saveUseTaskDetails(userId,category,timer,percentage,wrongAnswers)
      .then(() => {
        console.log("Task data saved successfully.");
        // Show appropriate alert and navigate
      })
      .catch((error) => {
        console.error("Error saving task data:", error);
        // Handle error
      });
  
    handleReset();
  };
  

  const handleReset = () => {
    setWords(Array(answers.length).fill(0));
    setPredictedValues(Array(answers.length).fill(''));
  };

  return (
    <View >
      <SlideShowScreenWriting />
      <View style={styles.wordContainer1}>
        {words.map((word, index) => (
          <View key={index} style={styles.row}>
            <TouchableOpacity onPress={() => handleMicPress(index, route.params?.predictedKeyword)}>
              <View style={styles.box}>
                <Text style={styles.word}>{word || "Press Mic"}</Text>
                <Feather
                  name="mic"
                  size={24}
                  color={Colors.yellow}
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={handleDonePress}>
          <View style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Done</Text>
          </View>
          <Text style={styles.timer}>Time Left: {timer} seconds</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerOne: {
    flex: 1,
    paddingTop: 20
  },
  wordContainer1: {
    paddingTop: 250,
    paddingHorizontal: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
    width: 250,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: Colors.gray,
    shadowOpacity: 3,
    elevation: 2,
  },
  word: {
    marginLeft: 20,
    fontFamily: 'outfit',
  },
  icon: {
    marginLeft: "auto",
  },
  doneButton: {
    marginTop: 20,
    padding: 10,
    width: '60%',
    borderRadius: 10,
    alignItems: "center",
    
    backgroundColor: Colors.yellow,
    alignSelf: "center",
  },
  doneButtonText: {
    fontSize: 18,
    color: Colors.white
  },
  catregoryContainer1: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  }
});
