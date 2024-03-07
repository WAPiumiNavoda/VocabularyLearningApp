import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import VideoScreen from "../HomeScreens/VideoScreen";
import QuizHome from "../../HandWriting/Quiz/QuizHome";
import SlideShow from "../HomeScreens/SlideShow";
import Category from "./Category";

export default function Home() {
  return (
    <View>
      {/* <View style={{backgroundColor: Colors.primary, height:250}}>
         <Header />
      </View>
      <View style={{padding: 10 , marginTop:-60}}> */}
      {/* <WritingTaskList /> */}

      {/* <VideoScreen /> */}
      <SafeAreaView style={styles.containerHome}>
        <ScrollView>
          <SlideShow />
          <Category />
        </ScrollView>
      </SafeAreaView>

      {/* <QuizHome /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  containerHome: {
    paddingTop: StatusBar.currentHeight,
  },
});
