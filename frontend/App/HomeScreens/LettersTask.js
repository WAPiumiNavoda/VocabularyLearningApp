import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import React from "react";
import Colors from "../Shared/Colors";
import { useNavigation } from "@react-navigation/native";

export default function LetterTask() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../App/assets/category.jpeg")} 
      style={style.background1}
    >
      <ScrollView contentContainerStyle={style.scrollViewContent}>
        <View style={style.catregoryContainer1}>
          {/* <TouchableOpacity
            style={style.category1}
            onPress={() =>
              navigation.navigate("LeaderBoardMore", { category: "Fruits" })
            }
          >
            <View style={style.textContainer}>
              <Image
                source={require("../../App/assets/bar.png")}
                style={[style.icon, { width: 110, height: 110, marginLeft: 115 }]}
              />
            </View>
          </TouchableOpacity> */}
        </View>

        <View style={style.container}>
          <View style={style.catregoryContainer}>
            <TouchableOpacity
              style={style.category}
              onPress={() =>
                navigation.navigate("QuizHome")
              }
            >
              <Image
                source={require("../../App/assets/l1.jpg")} // Specify the path to your image
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
                source={require("../../App/assets/l2.jpg")} // Specify the path to your image
                style={[
                  style.icon,
                  { width: 100, height: 100, marginBottom: 13, borderRadius: 10 },
                ]} // Style your image if needed
              />
              <Text style={style.categoryTitle}>Simple Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  catregoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  category: {
    width: 150,
    height: 210,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: Colors.black,
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
    resizeMode:"cover",
    justifyContent: "center",
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
  textContainer: {
    marginTop: 20,
    marginRight: 10,
  },
});
