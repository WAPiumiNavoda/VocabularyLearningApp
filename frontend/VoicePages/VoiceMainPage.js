import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../App/Shared/Colors";
import VoiceVideoScreen from "./VoiceVideoScreen";
import { firebase } from "../App/Services/config";
import { useAuth } from "../Auth/AuthProvider";
import { db } from '../App/Services/config';
export default function VoiceMainPage({ navigation, route }) {
  const [voiceQuestions, setVoiceQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setshowResult] = useState(false);
  const [userLevel, setUserLevel] = useState('');
  const { category } = route.params;
  const { userId } = useAuth();
  console.log("user level: " +  userLevel);
 console.log("Category : " + category);

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const userDoc = await db.collection('register').doc(userId).get();
        const userData = userDoc.data();
        if (userData) {
          setUserLevel(userData.level || '');
        }
      } catch (error) {
        console.error('Error fetching user level:', error);
      }
    };

    fetchUserLevel();
  }, [userId]);



  useEffect(() => {
    getVoiceQuestions();
  }, []);

  const getVoiceQuestions = async () => {
   
    setshowResult(false);
    const db = firebase.firestore();
    const questionRf = db.collection("voice");
    const snapshot = await questionRf
    .where("category", "==", category)
    .get();
    console.log("Category : " + category);
    if (snapshot.empty) {
      console.log("No matching document..");
      return;
    }
    const allQuestions = snapshot.docs.map((doc) => doc.data());
    setVoiceQuestions(allQuestions);
  };
  
 


  const handleNextPage = (answers) => {

    
    navigation.navigate("MainScreenWriting", { passanswers : answers , category : category});
  };

  return (
    <View style={{ paddingTop: 100 }}>
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
    marginTop: 50,
    backgroundColor: Colors.primary,
    width: "50%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonView: {
    marginLeft: 120,
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
    fontSize: 18,
    fontFamily: "outfit",
  },
});
