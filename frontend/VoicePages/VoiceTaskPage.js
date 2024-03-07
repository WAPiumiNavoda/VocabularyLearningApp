import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import TaskMainPage from "./TaskMainPage";

export default function VoiceTaskPage({ route }) {
  // const data = route.params.data;
  // const predictedKeyword = route.params.predictedKeyword;
  // console.log(predictedKeyword);

  // console.log(data);

  return (
    <View style={styles.container}>
      <TaskMainPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
});
