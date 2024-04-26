import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../Shared/Colors";
import { useNavigation } from "@react-navigation/native";

export default function Category() {
  const navigation = useNavigation();

  return (
    <View style={style.container}>
      <View style={style.catregoryContainer}>
        <TouchableOpacity
          style={style.category}
          onPress={() => navigation.navigate("LetterTask")}
        >
           <Image
            source={require("../../App/assets/icon4.jpg")} // Specify the path to your image
            style={[style.icon, {width:50, height:70, marginBottom:2}]} // Style your image if needed
          />
          <Text style={style.categoryTitle}>Writing Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.category}
          onPress={() => navigation.navigate("VoiceQuizApp")}
        >
          <Image
            source={require("../../App/assets/icon3.png")} // Specify the path to your image
            style={[style.icon, {width:90, height:70, marginBottom:2}]} // Style your image if needed
          />
          <Text style={style.categoryTitle}>Voice Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.category}
          onPress={() => navigation.navigate("Quizes")}
        >
           <Image
            source={require("../../App/assets/icon7.png")} // Specify the path to your image
            style={style.icon} // Style your image if needed
          />
          <Text style={style.categoryTitle}>Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.category}
          onPress={() =>
            navigation.navigate("LeaderBoard")
          }
        >
           <Image
            source={require("../../App/assets/icon8.png")} // Specify the path to your image
            style={[style.icon,{width:50, height:70, marginBottom:13}]} // Style your image if needed
          />
          <Text style={style.categoryTitle}>Dash Board</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: 30,
  },
  category: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: Colors.yellow,
    shadowOpacity: 5,
    // borderColor: Colors.yellow,
    // borderWidth: 2,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontFamily: "outfit",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    color: Colors.yellow,
  },
  icon: {
    width:80,
    height:80,
  }
});
