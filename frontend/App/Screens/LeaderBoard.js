import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  db,
  fetchTaskSummary,
  fetchtotalCorrectAnswers,
} from "../Services/config";
import Colors from "../Shared/Colors";
import { useAuth } from "../../Auth/AuthProvider";
import { fetchUserLevel } from "../Services/config";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BarChart, PieChart, ProgressChart } from "react-native-chart-kit";
export default function LeaderBoard() {
  const navigation = useNavigation();
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [correctAnswer, setWrongWritingAnswers] = useState([]);
  const [taskAnswers, setTaskAnswers] = useState([]);
  const [voiceTaskSummery, setTaskSummery] = useState([]);

  const { userId } = useAuth();

  //console.log("taskAnswers summery " + taskAnswers.totalTime);
  const [predictedCategory, setPredictedCategory] = useState(null);
  const [predictedWritingCategory, setPredictedWritingCategory] =
    useState(null);
    const [level, setLevel] = useState("");

console.log("user level: " + level);
console.log("user userId: " + userId);

  

  useEffect(() => {
    const fetchWrongAnswers = async () => {
      try {
        const wrongAnswersSnapshot = await db
          .collection("voicewrong")
          .doc(userId)
          .get();
        const userData = wrongAnswersSnapshot.data();
        if (userData) {
          setWrongAnswers(userData.wrongAnswers || []);
        }
      } catch (error) {
        console.error("Error fetching wrong answers:", error);
      }
    };

    fetchWrongAnswers();
  }, [userId]);

  useEffect(() => {
    const fetchWrongWritingAnswers = async () => {
      try {
        const wrong_answers_writingSnapshot = await db
          .collection("wrong_answers_writing")
          .where("userId", "==", userId) // Filter by userId
          .get();
        const fetchedWrongAnswerWriting =
          wrong_answers_writingSnapshot.docs.map(
            (doc) => doc.data().correctWord
          );
        setWrongWritingAnswers(fetchedWrongAnswerWriting);
      } catch (error) {
        console.error("Error fetching wrong answers:", error);
      }
    };

    fetchWrongWritingAnswers();
  }, [userId]);

  const countOccurrences = (arr) => {
    return arr.reduce((acc, curr) => {
      acc[curr] ? acc[curr]++ : (acc[curr] = 1);
      return acc;
    }, {});
  };

  const wrongAnswersCount = countOccurrences(wrongAnswers);
  const wrongAnswersWritingCount = countOccurrences(correctAnswer);

  // Function to render wrong words and their counts
  const renderWrongWords = (wrongWordsCount) => {
    return Object.entries(wrongWordsCount).map(([word, count]) => {
      if (count > 0) {
        return (
          <View key={word} style={styles.answerContainer}>
            <Text style={styles.answer}>{word}</Text>
            <View style={styles.countContainer}>
              {/* <View style={styles.countCircle}>
                <Text style={styles.count}>{count}</Text>
              </View> */}
            </View>
          </View>
        );
      }
    });
  };

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

  //fetch fruits data
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const summaryData = await fetchTaskSummary(userId, "Fruits");
        setTaskAnswers(summaryData);
        if (summaryData) {
          console.log("Summary data Fruits:", summaryData);
          console.log(
            "Summary data totalScore Fruits:",
            summaryData.totalcorrect
          );
          console.log("Summary data totalTime Fruits: ", summaryData.totalTime);
          console.log(
            "Summary data totalWrongAnswers Fruits:",
            summaryData.totalWrongAnswers
          );
        } else {
          console.log("Summary data not found.");
        }
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    };

    fetchSummaryData();
  }, [userId]);

  //fetch commands data
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const summaryData = await fetchTaskSummary(userId, "Commands");
        setTaskAnswers(summaryData);
        if (summaryData) {
          console.log("Summary data Commands:", summaryData);
          console.log(
            "Summary data totalScore Commands:",
            summaryData.totalcorrect
          );
          console.log(
            "Summary data totalTime Commands: ",
            summaryData.totalTime
          );
          console.log(
            "Summary data totalWrongAnswers Commands:",
            summaryData.totalWrongAnswers
          );
        } else {
          console.log("Summary data not found.");
        }
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    };

    fetchSummaryData();
  }, [userId]);

  //fetch writing adjectives
  // useEffect(() => {
  //   const fetchSummaryAdjData = async () => {
  //     try {
  //       const summaryData = await fetchtotalCorrectAnswers(
  //         userId,
  //         "Adjectives"
  //       );
  //       setTaskAnswers(summaryData);
  //       if (summaryData) {
  //         console.log("Summary data Adjectives:", summaryData);
  //         console.log(
  //           "Summary data totalScore Adjectives:",
  //           summaryData.totalCorrectAnswers
  //         );
  //         console.log(
  //           "Summary data totalTime Adjectives: ",
  //           summaryData.totalTime
  //         );
  //         console.log(
  //           "Summary data totalWrongAnswers Adjectives:",
  //           summaryData.totalpercentageScore
  //         );
  //       } else {
  //         console.log("Summary data not found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching task summary:", error);
  //     }
  //   };

  //   fetchSummaryAdjData();
  // }, [userId]);

  // useEffect(() => {
  //   const fetchSummaryNumbersData = async () => {
  //     try {
  //       const summaryData = await fetchtotalCorrectAnswers(
  //         userId,
  //         "Numbers"
  //       );
  //       setTaskAnswers(summaryData);
  //       if (summaryData) {
  //         console.log("Summary data Numbers:", summaryData);
  //         console.log(
  //           "Summary data totalScore Numbers:",
  //           summaryData.totalCorrectAnswers
  //         );
  //         console.log(
  //           "Summary data totalTime Numbers: ",
  //           summaryData.totalTime
  //         );
  //         console.log(
  //           "Summary data totalWrongAnswers Numbers:",
  //           summaryData.totalpercentageScore
  //         );
  //       } else {
  //         console.log("Summary data not found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching task summary:", error);
  //     }
  //   };

  //   fetchSummaryNumbersData();
  // }, [userId]);


 

  const predictCategory = async () => {
    try {
      // Sample input data for prediction
      const inputData = {
        Time_Fruits: taskAnswers.totalTime,
        Correct_Fruits: taskAnswers.totalcorrect,
        Incorrect_Fruits: taskAnswers.totalWrongAnswers,
        Time_Numbers: taskAnswers.totalTime,
        Correct_Numbers: 0,
        Incorrect_Numbers: 0,
        Time_Commands: 0,
        Correct_Commands: 0,
        Incorrect_Commands: 0,
        Time_Animals: 0,
        Correct_Animals: 0,
        Incorrect_Animals: 0,
      };

      const response = await axios.post(
        "http://localhost:8001/predictvoicefeedback",
        inputData
      );

      console.log("Predicted category:", response.data.predicted_category);

      setPredictedCategory(response.data.predicted_category);
    } catch (error) {
      console.error("Error predicting category:", error);
    }
  };

  const predictWritingCategory = async () => {
    try {
      const inputData = {
        Time_Adjectives: 10,
        Correct_Adjectives: 3,
        Incorrect_Adjectives: 14,
        Time_Nouns: 45,
        Correct_Nouns: 40,
        Incorrect_Nouns: 50,
        Time_Preposition: 56,
        Correct_Preposition: 23,
        Incorrect_Preposition: 19,
        Time_Adverbs: 30,
        Correct_Adverbs: 12,
        Incorrect_Adverbs: 10,
      };

      const response = await axios.post(
        "http://localhost:8002/predictwritingfeedback",
        inputData
      );

      console.log(
        "Predicted writing category:",
        response.data.predicted_category
      );
      setPredictedWritingCategory(response.data.predicted_category);
    } catch (error) {
      console.error("Error predicting category:", error);
    }
  };

  //predicted voice categoy
  const renderPredictedCategory = () => {
    if (predictedCategory !== null) {
      return (
        <>
         <Text style={{ color: Colors.green}}>
             Voice Base{"\n"}
          </Text>
          <Text style={{ color: Colors.yellow }}>
          Focusing on :
          </Text>
          <Text style={{ fontFamily: "outfi-bold" }}>{predictedCategory}</Text>
        </>
      );
    } else {
      return null;
    }
  };

  const renderPredictedWritingCategory = () => {
    if (predictedCategory !== null) {
      return (
        <>
        <Text style={{ color: Colors.green}}>
             Writing Base{"\n"}
          </Text>
          <Text style={{ color: Colors.yellow }}>
            Focusing on :
          </Text>
          <Text style={{ fontFamily: "outfi-bold" }}>
            {predictedWritingCategory}
          </Text>
        </>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    predictCategory();
    predictWritingCategory();
  }, []);

  const data = {
    labels: ["Fruits", "Commands", "Vegetables", "Animals", "Equipm"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };

  const graphStyle = {
    fontSize: 16,
    color: "blue",
    padding: 10,
  };

  return (
    <View contentContainerStyle={styles.container}>

      
      <View style={styles.catregoryContainer1}>
      <TouchableOpacity
          style={styles.category1}
          onPress={() =>
            navigation.navigate("LeaderBoardMore")
          }
        >
          <Text style={[styles.categoryTitle2, {paddingTop: 12, paddingLeft: 7 }]}>
            Your Level Is:  {level}
          </Text>
        
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.category1}
          onPress={() =>
            navigation.navigate("LeaderBoardMore", { category: "Fruits" })
          }
        >
          <Text style={[styles.categoryTitle2, {paddingTop: 12, paddingLeft: 7 }]}>
            {renderPredictedCategory()}
          </Text>
          <View style={styles.textContainer}>
            {/* <Image
              source={require("../../App/assets/bar.png")}
              style={[styles.icon, { width: 110, height: 110, marginLeft: 115 }]}
            /> */}
            {/* <Text style={styles.categoryTitle2}>You Are Doing Great !!!</Text>
            <Text style={[styles.categoryTitle2, {paddingLeft: 110}]}>See Your Progress</Text> */}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.category1}
          onPress={() =>
            navigation.navigate("LeaderBoardMore", { category: "Fruits" })
          }
        >
          <Text style={[styles.categoryTitle2, {paddingTop: 12, paddingLeft: 7 }]}>
            {renderPredictedWritingCategory()}
          </Text>
          <View style={styles.textContainer}>
            {/* <Image
              source={require("../../App/assets/bar.png")}
              style={[styles.icon, { width: 110, height: 110, marginLeft: 115 }]}
            /> */}
            {/* <Text style={styles.categoryTitle2}>You Are Doing Great !!!</Text>
            <Text style={[styles.categoryTitle2, {paddingLeft: 110}]}>See Your Progress</Text> */}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.catregoryContainer}>
         <TouchableOpacity
          style={styles.category}
          onPress={() =>
            navigation.navigate("LeaderBoardMore", { category: "Fruits" })
          }
        >
          <Text style={styles.categoryTitle}>Voice</Text>
          <View style={styles.answersContainer}>
            {renderWrongWords(wrongAnswersCount)}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.category}
          onPress={() =>
            navigation.navigate("LeaderBoardMore", { category: "Commands" })
          }
        >
          <Text style={styles.categoryTitle}>Writing</Text>
        </TouchableOpacity>

        <View style={styles.answersContainer1}>
          {renderWrongWords(wrongAnswersWritingCount)}
        </View> 
{/*
          <BarChart
            style={graphStyle}
            data={data}
            width={360}
            height={330}
            yAxisLabel="s"
            chartConfig={chartConfig}
            verticalLabelRotation={40}
          />
          */}
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionname: {
    fontFamily: "outfi-bold",
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 28,
  },
  sectionnameTitle: {
    fontFamily: "outfit",
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    paddingLeft: 10,
    fontFamily: "outfit",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  answersContainer1: {
    marginLeft: 210,
    justifyContent: "center",
    alignItems: "center",
  },
  answersContainer: {
    marginLeft: 20,

    marginBottom: 5,
  },
  answer: {
    marginRight: 10,
    borderRadius: 10,
    width: 100,
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.green,
    padding: 10,
  },
  countContainer: {
    marginLeft: "auto",
    marginRight: 20,
  },
  countCircle: {
    backgroundColor: Colors.green,
    borderRadius: 20,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  count: {
    color: Colors.black,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  catregoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  category: {
    width: 175,
    height: 55,
    margin: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.gray,
    shadowOpacity: 5,
    elevation: 5,
    paddingTop: 20,
  },
  categoryTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontFamily: "outfit",
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.black,
  },
  catregoryContainer1: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  category1: {
    width: 380,
    height: 80,
    margin: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderColor: Colors.yellow,
    borderWidth: 2,
    elevation: 5,
    paddingTop: 0,
  },
  categoryTitle1: {
    fontSize: 20,
    fontFamily: "outfit",
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.white,
  },
  categoryTitle2: {
    fontSize: 20,
    fontFamily: "outfit",
    fontWeight: "bold",
    paddingLeft: 100,
    paddingTop: 1,
  },
});
