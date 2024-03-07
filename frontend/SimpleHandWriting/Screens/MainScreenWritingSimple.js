import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../App/Shared/Colors";
import SlideShowScreenWriting from "./SlideShowScreenWritingSimple";
import { saveWrongAnswersToFirebase } from "../../App/Services/config";
import { useAuth } from "../../Auth/AuthProvider";

export default function MainScreenWritingSimple({ navigation, route }) {
  //const answers = ["dataset\\cat", "dataset\\wow", "dataset\\go"];
  const { category } = route.params;
  const initialAnswers = category === 'Fruits'
    ? ["dataset\\cat", "dataset\\wow", "dataset\\go"]
    : category === 'Commands'
    ? ["dataset\\cat", "dataset\\wow", "dataset\\up"]
    : [];

  const [answers, setAnswers] = useState(initialAnswers);
  const [words, setWords] = useState(Array(answers.length).fill(0));
  const [predictedValues, setPredictedValues] = useState(Array(answers.length).fill(''));
  const [lastPressedIndex, setLastPressedIndex] = useState(null);
  const { userId } = useAuth();

  const handleMicPress = (index, predictedKeyword) => {
    const newWords = [...words];
    newWords[index] = predictedKeyword;
    setWords(newWords);

    const newPredictedValues = [...predictedValues];
    newPredictedValues[index] = predictedKeyword;
    setPredictedValues(newPredictedValues);

    setLastPressedIndex(index);
    navigation.navigate("TaskMainPage", { predictedKeyword });
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
    const percentage = ((score / totalQuestions) * 100).toFixed(2); // Calculate percentage and round to 2 decimal places
    const scoreMessage = `Your score is ${percentage}%.`; // Display the score as a percentage
  
    if (percentage >= 60) { // Check if the percentage is greater than or equal to 60
      console.log("move to next page");
      Alert.alert(
        'Quiz Result,  "Congratulations! Click Next to proceed to the next level"',
        scoreMessage,
        [
          {
            text: "Next",
            onPress: () => navigation.navigate("VoiceQuizAppIntermediate")
          }
        ]
      );
    } else {
      Alert.alert(
        "Quiz Result",
        scoreMessage,
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }
  
    handleReset();
  };
  

  const handleReset = () => {
    setWords(Array(answers.length).fill(0));
    setPredictedValues(Array(answers.length).fill(''));
  };

  return (
    <View style={styles.container}>
      <SlideShowScreenWriting />
      <View style={styles.wordContainer}>
        {words.map((word, index) => (
          <View key={index} style={styles.row}>
            <TouchableOpacity onPress={() => handleMicPress(index, route.params?.predictedKeyword)}>
              <View style={styles.box}>
                <Text style={styles.word}>{word || "Press Mic"}</Text>
                <Feather
                  name="mic"
                  size={24}
                  color={Colors.primary}
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
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wordContainer: {
    paddingTop: 20,
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
    backgroundColor: Colors.primary,
    alignSelf: "center",
  },
  doneButtonText: {
    fontSize: 18,
    color: Colors.white
  },
});
