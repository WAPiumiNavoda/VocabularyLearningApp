import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  firebase,
  saveWrongAnswersToFirebase,
} from "../../App/Services/config";
import Colors from "../../App/Shared/Colors";
import VoiceVideoScreen from "../VoiceVideoScreen";
import { useAuth } from "../../Auth/AuthProvider";

export default function VoiceDataPage({ navigation, route }) {
  const [voiceQuestions, setVoiceQuestions] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const { userId } = useAuth();

  const [words, setWords] = useState([]);
  const [predictedValues, setPredictedValues] = useState([]);
  const [lastPressedIndex, setLastPressedIndex] = useState(null);

  useEffect(() => {
    getVoiceQuestions();
  }, []);

  const getVoiceQuestions = async () => {
    const { category } = route.params;
    const db = firebase.firestore();
    const questionRf = db.collection("voice");
    const snapshot = await questionRf.where("category", "==", category).get();
    if (snapshot.empty) {
      console.log("No matching document..");
      return;
    }
    const allQuestions = snapshot.docs.map((doc) => doc.data());
    console.log("Database Answers:", allQuestions.map(question => question.questionList[0].answers));
    setVoiceQuestions(allQuestions);

    // Initialize words and predictedValues arrays based on the fetched answers
    const initialWords = [];
    const initialPredictedValues = [];
    allQuestions.forEach((question) => {
      initialWords.push(...question.questionList[0].answers.map(() => ""));
      initialPredictedValues.push(
        ...question.questionList[0].answers.map(() => "")
      );
    });
    setWords(initialWords);
    setPredictedValues(initialPredictedValues);
  };

  const handleMicPress = (index, predictedKeyword) => {

    const newWords = [...words];
    newWords[index] = predictedKeyword;
   
  
    const newPredictedValues = [...predictedValues];
    newPredictedValues[index] = predictedKeyword;
    console.log("Predicted Answer Array:", predictedValues);
    
    setWords(newWords);
    setPredictedValues(newPredictedValues);
  
    setLastPressedIndex(index); // Update the index of the last pressed mic button
  
    navigation.navigate("TaskMainPage", { predictedKeyword });
  };
  
  

  useEffect(() => {
    if (
      route.params?.predictedKeyword !== undefined &&
      lastPressedIndex !== null
    ) {
      const newWords = [...words];
      newWords[lastPressedIndex] = route.params.predictedKeyword;
      setWords(newWords);

      const newPredictedValues = [...predictedValues];
      newPredictedValues[lastPressedIndex] = route.params.predictedKeyword;
      setPredictedValues(newPredictedValues);
    }
  }, [route.params?.predictedKeyword]);



  const handleDonePress = () => {
    const score = calculateScore();
    const totalQuestions = words.length;
    const scoreMessage = `Your score is ${score} out of ${totalQuestions}.`;

    const wrongAnswers = words.filter(
      (word, index) => !predictedValues.includes(word)
    );
    saveWrongAnswersToFirebase(wrongAnswers, userId); // Save wrong answers to Firebase

    // Display the score message in an alert
    Alert.alert(
      "Quiz Result",
      scoreMessage,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );

    // Reset the state
    handleReset();
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < voiceQuestions.length; i++) {
      const answers = voiceQuestions[i].questionList[0].answers;
      const predictedAnswer = predictedValues[i];
      if (answers.includes(predictedAnswer)) {
        score++;
      }
    }
    return score;
  };
  

  const handleReset = () => {
    setWords([]);
    setPredictedValues([]);
  };

  return (
    <View style={{ paddingTop: 100 }}>
      <FlatList
        data={voiceQuestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.mainQuestion}>
              {item.questionList[0].mainquestion}
            </Text>
            <VoiceVideoScreen videoUrl={item.video} />

            <View style={styles.column}>
              {item.questionList[0].answers.map((answer, idx) => (
                <View key={idx} style={styles.row}>
                  <TouchableOpacity onPress={() => handleMicPress(idx, answer)}>
                    <View style={styles.box}>
                      <Text style={styles.word}>
                        {words[
                          index * item.questionList[0].answers.length + idx
                        ] || "Press Mic"}
                      </Text>
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
            </View>
            <TouchableOpacity onPress={handleDonePress}>
              <View style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  mainQuestion: {
    fontSize: 18,
    fontFamily: "outfit",
  },
  container: {
    flex: 1,
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    width: 250,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: Colors.gray,
    shadowOpacity: 0.3,
    elevation: 2,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  word: {
    marginLeft: 20,
    fontFamily: "outfit",
  },
  icon: {
    marginLeft: "auto",
  },
  doneButton: {
    backgroundColor: Colors.primary,
    width: 100,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit",
  },
});
