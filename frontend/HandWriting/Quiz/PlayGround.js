import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { fetchUserLevel, firebase, saveUseWritingTaskDetails } from "../../App/Services/config";
import VideoScreen from "../../App/HomeScreens/VideoScreen";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library
import { useRoute } from "@react-navigation/native";
import Colors from "../../App/Shared/Colors";
import { useAuth } from "../../Auth/AuthProvider";

export default function PlayGround({ item, navigation }) {
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [score, setScore] = useState(0);
  const [wrongWordList, setWrongWord] = useState(0);
  const [correctWordList, setCorrectWord] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const route = useRoute();
  const [timeLeft, setTimeLeft] = useState(360); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);
  const { category } = route.params;
  const [submittedTime, setSubmittedTime] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [level, setLevel] = useState("");
  let timer;
  const { userId } = useAuth();

    //fecth user level
    useEffect(() => {
      // Fetch user's level and set the state
      const getUserLevel = async () => {
        try {
          const userLevel = await fetchUserLevel(userId);
          setLevel(userLevel);
        } catch (error) {
          console.error("Error fetching user level:", error);
        }
      };
      getUserLevel();
    }, [userId]); // Call only once when userId changes
  

  useEffect(() => {
    if (
      route.params?.drawnCharacter !== undefined &&
      route.params?.wordIndex !== undefined
    ) {
      const { drawnCharacter, wordIndex } = route.params;
      handleDoneDrawing(drawnCharacter, wordIndex);
    }
  }, [route.params]);

  const getWritingQuestion = async () => {
    setSelectedOption({});
    setShowResult(false);
    const db = firebase.firestore();
    const questionRf = db.collection("writingdata");
    const snapshot = await questionRf
    .where("category", "==", category)
    .where("level", "==", level)
    .get();
    console.log("Category : " + category);
    if (snapshot.empty) {
      console.log("No matching document..");
      return;
    }
    const allQuestions = snapshot.docs.map((doc) => doc.data());
    const suffleQuestions = allQuestions.sort(() => 0.5 - Math.random());
    setQuestions(suffleQuestions.slice(0, 10));
  };

  const handleDoneDrawing = (predictedCharacter, wordIndex) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];
    const answer =
      currentQuestion.questionList[0].question[0].character[wordIndex].answers;

    // Get the wrong word and the correct word
    const wrongWord =
      currentQuestion.questionList[0].question[0].character[
        wordIndex
      ].word.join("");

    const correctWord =
      currentQuestion.questionList[0].question[0].character[wordIndex].learword;

      setWrongWord(wrongWord)
      console.log("correctWordList : " + correctWordList);
      setCorrectWord(correctWord)
      console.log("correctWord : " + correctWord);

    if (predictedCharacter !== answer) {
      // Store wrong answer in Firestore
      const db = firebase.firestore();
      db.collection("wrong_answers_writing")
        .add({
          userId: userId,
          wrongWord: wrongWord,
          correctWord: correctWord,
          category: currentQuestion.category, // Add the category
        })
        .then(() => {
          console.log("Wrong answer stored successfully.");
        })
        .catch((error) => {
          console.error("Error storing wrong answer:", error);
        });
    }

    if (predictedCharacter === answer) {
      // Increment the score
      setScore((prevScore) => prevScore + 1);
    }
    const word = [
      ...currentQuestion.questionList[0].question[0].character[wordIndex].word,
    ];
    const emptySpaceIndex = word.findIndex((char) => char === " ");
    if (emptySpaceIndex !== -1) {
      word[emptySpaceIndex] = predictedCharacter;
    } else {
      console.warn("No empty space found in the word.");
    }
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      questionList: [
        {
          ...currentQuestion.questionList[0],
          question: [
            {
              ...currentQuestion.questionList[0].question[0],
              character: [
                ...currentQuestion.questionList[0].question[0].character.slice(
                  0,
                  wordIndex
                ),
                {
                  ...currentQuestion.questionList[0].question[0].character[
                    wordIndex
                  ],
                  word,
                },
                ...currentQuestion.questionList[0].question[0].character.slice(
                  wordIndex + 1
                ),
              ],
            },
          ],
        },
      ],
    };
    setQuestions(updatedQuestions);
  };

  const totalWords =
    questions[currentQuestionIndex]?.questionList[0]?.question[0]?.character[
      currentCharacterIndex
    ]?.word.length || 0;
  const currentWord = Math.min(currentCharacterIndex + 1, totalWords); // Ensure current word index is within bounds
  const progress = totalWords
    ? ((currentWord / totalWords) * 100).toFixed(2)
    : 0;

    useEffect(() => {
      getWritingQuestion();
    }, [category, level]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          setTimerActive(false); // Set timerActive to false when time runs out
          setShowResult(true); // Show the result when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
  };

  const handleNext = () => {
    setCurrentCharacterIndex((prevIndex) => {
      if (
        prevIndex <
        questions[currentQuestionIndex].questionList[0].question[0].character
          .length -
          1
      ) {
        return prevIndex + 1;
      } else {
        return 0;
      }
    });
  };

  const handleBack = () => {
    setCurrentCharacterIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        return (
          questions[currentQuestionIndex].questionList[0].question[0].character
            .length - 1
        );
      }
    });
  };

  const handleSubmit = () => {
    setShowResult(true);
    const stoppedTime = 60 - timeLeft;
    setSubmittedTime(stoppedTime);

    clearInterval(timer);
    setTimerActive(false);

    const totalQuestions = questions.reduce(
      (acc, curr) => acc + curr.questionList[0].question[0].character.length,
      0
    );

    const percentageScore = ((score / totalQuestions) * 100).toFixed(2);

    saveUseWritingTaskDetails(
      userId,
      category,
      timeLeft,
      score,
      wrongWordList,
      correctWordList
    );

    if (percentageScore > 50) {
      Alert.alert(
        "Result",
        `Your scored ${percentageScore}% out of all questions.`,
        [
          {
            text: "Next",
            onPress: () => navigation.navigate("QuizHomeIntermediate"),
          },
        ]
      );
    } else {
      Alert.alert(
        "Result",
        `Your scored ${percentageScore}% out of all questions . Try again`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("QuizHome"),
            style: "cancel",
          },
        ]
      );
    }
  };

  const navigateToDrawingPage = (wordIndex, category) => {
    navigation.navigate("DrawingScreen", { wordIndex, category });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.timer}> Time Left : {formattedTime}</Text>
    
        <FlatList
          style={styles.flatList}
          data={questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.questionContainer}>
      
              <View style={styles.squareContainer}>
                {item.questionList[0].question[0].character[
                  currentCharacterIndex
                ].word.map((word, wordIndex) => (
                  <View key={wordIndex} style={styles.wordContainer}>
                    {word.split("").map((char, charIndex) => (
                      <View key={charIndex} style={styles.square}>
                        <Text style={styles.text}>{char}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
              <View style={styles.buttonContainer1}>
                <Button
                  title="Drawing Page"
                  onPress={() => navigateToDrawingPage(currentCharacterIndex , category)}
                  color={Colors.yellow}
                />
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
            </View>
          )}
        />

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navigationButton, { marginLeft: 150 }]}
            onPress={handleBack}
          >
            <Text style={styles.navigationButtonText}><Icon name="chevron-left" size={20} color="#fff" />Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navigationButton, { marginLeft: 60 }]}
            onPress={handleNext}
          >
            <Text style={[styles.navigationButtonText]}> Next<Icon  name="chevron-right" size={20} color="#fff" /></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitbutton}
          onPress={handleSubmit}
          disabled={showResult || !timerActive}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  questionContainer: {
    marginTop: 60,
    paddingTop: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    alignItems: "center",
    // shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  squareContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  square: {
    width: 80,
    borderRadius: 20,
    height: 80,
    backgroundColor: Colors.white,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 44,
    fontFamily: "outfi-bold-extra",
    fontWeight: "bold",
    color: Colors.yellow,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
  },

  navigationButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitbutton: {
    backgroundColor: Colors.yellow,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  result: {
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginTop: 30,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.red,
    borderRadius: 5,
  },
  timer: {
    paddingTop: 30,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer1: {
    fontFamily: "outfit",
    backgroundColor: "white",
    borderRadius: "30",
    borderWidth: 2,
    borderColor: Colors.yellow,
    color: Colors.black,
    width: "60%",
    alignItems: "center",
    // marginLeft: 80,
    padding: 10,
    marginVertical: 20,
    borderRadius: 10,
  },
  navigationButton: {
    marginTop: 30,
    backgroundColor: Colors.yellow,
    paddingLeft: 30,
    paddingRight: 30,
    padding: 10,
    marginHorizontal: 65, 
    borderRadius: 5,
  },
  navigationButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
