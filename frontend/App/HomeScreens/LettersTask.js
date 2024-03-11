import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import Colors from "../Shared/Colors";
import { useNavigation } from "@react-navigation/native";

export default function LetterTask() {
  const navigation = useNavigation();

  return (
    <ImageBackground
    source={require("../../App/assets/background1.jpeg")} 
    style={style.background1}
  >
    <View style={style.container}>
      <View style={style.catregoryContainer}>
        <TouchableOpacity
          style={style.category}
          onPress={() =>
            navigation.navigate("QuizHome")
          }
        >
          <Image
            source={require("../../App/assets/write1.jpg")} // Specify the path to your image
            style={[style.icon, { width: 100, height: 100, marginBottom: 13 }]} // Style your image if needed
          />
          <Text style={style.categoryTitle}>Capital Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.category}
          onPress={() =>
            navigation.navigate("QuizHomeSimple")
          }
        >
          <Image
            source={require("../../App/assets/write1.jpg")} // Specify the path to your image
            style={[
              style.icon,
              { width: 100, height: 100, marginBottom: 13, borderRadius: 10 },
            ]} // Style your image if needed
          />
          <Text style={style.categoryTitle}>Simple Task</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  
  container: {
    flex: 1,
  },
  catregoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150,
  },
  category: {
    width: 150,
    height: 230,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: Colors.yellow,
    shadowOpacity: 5,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontFamily: "outfit",
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.yellow,
  },
  background1: {
    flex: 1,
    resizeMode:"center",
    justifyContent: "center",
  },
});
