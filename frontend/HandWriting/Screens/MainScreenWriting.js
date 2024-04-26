import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../App/Shared/Colors";
import SlideShowScreenWriting from "./SlideShowScreenWriting";
import { saveWrongAnswersToFirebase, saveUseTaskDetails, fetchUserLevel } from "../../App/Services/config";
import { useAuth } from "../../Auth/AuthProvider";

export default function MainScreenWriting({ navigation, route }) {
  //const answers = ["dataset\\cat", "dataset\\wow", "dataset\\go"];
  const { category } = route.params || {};
  const [level, setLevel] = useState("");
  const { userId } = useAuth();
  
  // Inside useEffect for fetching user level
  console.log("User Level:", level);

  // Inside the component, before returning
  console.log("Category:", category);
  console.log("Level:", level);

  // Declare initialAnswers here
  const initialAnswers = 
    category === 'Animals' && level === 'Basic'
      ? ["cat", "dog", "bird"]
      : category === 'Animals' && level === 'Intermediate'
      ? ["lion", "elephant", "tiger"]
      : category === 'Animals' && level === 'Advanced'
      ? ["giraffe", "hippopotamus", "rhinoceros"]
      : category === 'Commands' && level === 'Basic'
      ? ["down", "go", "up"]
      : category === 'Commands' && level === 'Intermediate'
      ? ["sit", "stay", "fetch"]
      : category === 'Commands' && level === 'Advanced'
      ? ["roll over", "shake", "beg"]
      : category === 'Numbers' && level === 'Basic'
      ? ["zero", "one", "two"]
      : category === 'Numbers' && level === 'Intermediate'
      ? ["three", "four", "five"]
      : category === 'Numbers' && level === 'Advanced'
      ? ["six", "seven", "eight"]
      : [];

  console.log("Initial Answers:", initialAnswers);
  console.log("Predicted Values:", predictedValues);

  useEffect(() => {
    const fetchInitialAnswers = async () => {
      try {
        const userLevel = await fetchUserLevel(userId);
        setLevel(userLevel);
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };
    fetchInitialAnswers();
  }, [userId]);

  useEffect(() => {
    const determineInitialAnswers = () => {
      if (category && level) {
        setAnswers(initialAnswers);
        setWords(Array(initialAnswers.length).fill(0));
        setPredictedValues(Array(initialAnswers.length).fill(''));
      }
    };
    determineInitialAnswers();
  }, [category, level]);

  const [answers, setAnswers] = useState([]);
  const [words, setWords] = useState([]);
  const [predictedValues, setPredictedValues] = useState([]);
  const [lastPressedIndex, setLastPressedIndex] = useState(null);
  // console.log("Dashboard log user: " +  userId);
  const [timerExpired, setTimerExpired] = useState(false);
  const [timer, setTimer] = useState(360);
  const stoppedTime = 60 - timer;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

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
        'Quiz Result, You Can move To New Level',
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
        'Quiz Result, Try Again',
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
    

      saveUseTaskDetails(userId,category,stoppedTime,score,wrongAnswers)

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
  {category && level && words.map((word, index) => (
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
          <Text style={{fontSize: 16, marginTop: 20, marginLeft: 60}}>Time Left: {formattedTime} seconds</Text>
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
