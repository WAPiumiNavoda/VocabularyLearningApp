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
import { firebase } from "../../App/Services/config";
import VideoScreen from "../../App/HomeScreens/VideoScreen";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library
import { useRoute } from "@react-navigation/native";
import Colors from "../../App/Shared/Colors";
import { useAuth } from "../../Auth/AuthProvider";

export default function MainWritingPage({ item, navigation }) {
  const [showResult, setShowResult] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [SelectedMainTopic, setSelectedMainTopic] = useState("");
  const route = useRoute();

  const { category , level} = route.params;
  console.log("level : " +  level);

  let timer;
  const { userId } = useAuth();

  console.log("categogry main page " + category);

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
    const snapshot = await questionRf.where("category", "==", category).get();
    console.log("Category : " + category);
    if (snapshot.empty) {
      console.log("No matching document..");
      return;
    }
    const allQuestions = snapshot.docs.map((doc) => doc.data());
    const suffleQuestions = allQuestions.sort(() => 0.5 - Math.random());
    setQuestions(suffleQuestions.slice(0, 10));
  };

  useEffect(() => {
    getWritingQuestion();
    getCategoryVideo(category);
  }, []);

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
  };

  const getCategoryVideo = async (category) => {
    const db = firebase.firestore();
    const videoRf = db.collection("writingdata");
    const snapshot = await videoRf.where("category", "==", category).get();
    if (snapshot.empty) {
      console.log("No matching document video..");
      return;
    }
    const videoData = snapshot.docs.map((doc) => doc.data());
    setSelectedVideoUrl(videoData[0].video);
    setSelectedMainTopic(videoData[0].questionList[0].mainquestion); // Assuming there's only one video per category
    console.log("Category Video URL: ", videoData[0].video);
    console.log(videoData[0].questionList[0].mainquestion);
  };

  const handleNext = () => {
    navigation.navigate("PlayGround", { category });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{SelectedMainTopic}</Text>
      <VideoScreen videoUrl={selectedVideoUrl} />

      <TouchableOpacity style={styles.submitbutton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>Start Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  submitButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  submitbutton: {
    backgroundColor: Colors.yellow,
    paddingLeft:30,
    paddingRight: 30,
    padding: 10,
    marginVertical: 50,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  question: {
    paddingTop: 80,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
