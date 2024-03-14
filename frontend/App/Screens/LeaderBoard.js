import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { db } from "../Services/config";
import Colors from "../Shared/Colors";
import { useAuth } from "../../Auth/AuthProvider";
import { fetchUserLevel } from "../Services/config";
import { useNavigation } from "@react-navigation/native";

export default function LeaderBoard() {
  const navigation = useNavigation();
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [correctAnswer, setWrongWritingAnswers] = useState([]);
  const { userId } = useAuth();
  const [userLevel, setUserLevel] = useState("");

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const userDoc = await db.collection("register").doc(userId).get();
        const userData = userDoc.data();
        if (userData) {
          setUserLevel(userData.level || "");
        }
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };

    fetchUserLevel();
  }, [userId]);

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

  // Count occurrences of each wrong answer word
  const countOccurrences = (arr) => {
    return arr.reduce((acc, curr) => {
      acc[curr] ? acc[curr]++ : (acc[curr] = 1);
      return acc;
    }, {});
  };

  // Get count of each wrong answer word
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.catregoryContainer1}>
        <TouchableOpacity
          style={styles.category1}
          onPress={() =>
            navigation.navigate("LeaderBoardMore", { category: "Fruits" })
          }
        >
          <View style={styles.textContainer}>
            <Image
              source={require("../../App/assets/bar.png")}
              style={[styles.icon, { width: 110, height: 110, marginLeft: 115 }]}
            />
            <Text style={styles.categoryTitle2}>You Are Doing Great !!!</Text>
            <Text style={[styles.categoryTitle2, {paddingLeft: 110}]}>See Your Progress</Text>
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
      </View>
    </ScrollView>
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
    width: 365,
    height: 180,
    margin: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderColor: Colors.orange,
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
    fontSize: 15,
    fontFamily: "outfit",
    fontWeight: "bold",
    paddingLeft: 100,
    paddingTop: 1,
  },
  textContainer: {
    marginTop: 20,
    marginRight: 10,
  },
});
