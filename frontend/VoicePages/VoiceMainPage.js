import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../App/Shared/Colors";
import VoiceVideoScreen from "./VoiceVideoScreen";
import { fetchUserLevel, firebase } from "../App/Services/config";
import { useAuth } from "../Auth/AuthProvider";
import { db } from "../App/Services/config";

export default function VoiceMainPage({ navigation, route }) {
  const [voiceQuestions, setVoiceQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setshowResult] = useState(false);
  const [level, setLevel] = useState("");
  const { category } = route.params;
  const { userId } = useAuth();
  // console.log("user level: " + userLevel);
  console.log("Category Voice Main: " + category);


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
    getVoiceQuestions();
  }, [level, category]);
  
  const getVoiceQuestions = async () => {
    const db = firebase.firestore();
    const questionRf = db.collection("voice");
    const snapshot = await questionRf
      .where("category", "==", category)
      .where("level", "==", level)
      .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    const allQuestions = snapshot.docs.map((doc) => doc.data());
    setVoiceQuestions(allQuestions);
  };

  const handleNextPage = (answers) => {
    navigation.navigate("MainScreenWriting", {
      passanswers: answers,
      category: category,
    });
  };

  return (
    <View style={{ paddingTop: 40 }}>
      <FlatList
        data={voiceQuestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.mainQuestion}>
              {item.questionList[0].mainquestion}
            </Text>
            {/* <Text style={styles.mainQuestion}>
              {item.questionList[0].answers}
            </Text> */}

            <VoiceVideoScreen videoUrl={item.video} />

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => handleNextPage(item.questionList[0].answers)}
                style={styles.nextButton}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    fontSize: 15,
                    fontFamily: "outfit",
                  }}
                >
                  Go To Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nextButton: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: Colors.white,
    shadowColor: Colors.yellow,
    shadowOpacity: 5,
    elevation: 5,
    width: "70%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonView: {
    marginLeft: 80,
  },
  questionContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  mainQuestion: {
    paddingLeft: 2,
    fontSize: 21,
    fontFamily: "outfit",
  },
});
