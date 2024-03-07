import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { db } from '../Services/config';
import Colors from '../Shared/Colors';
import { useAuth } from '../../Auth/AuthProvider';
import { fetchUserLevel } from '../Services/config';

export default function LeaderBoard() {
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [correctAnswer,  setWrongWritingAnswers] = useState([]);
  const { userId } = useAuth();
  console.log("Dashboard log user: " +  userId);
  const [userLevel, setUserLevel] = useState('');
  console.log("Dashboard log user: " +  userId);

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
    const fetchWrongAnswers = async () => {
      try {
        const wrongAnswersSnapshot = await db.collection('voicewrong').doc(userId).get();
        const userData = wrongAnswersSnapshot.data();
        if (userData) {
          setWrongAnswers(userData.wrongAnswers || []);
        }
      } catch (error) {
        console.error('Error fetching wrong answers:', error);
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
        const fetchedWrongAnswerWriting = wrong_answers_writingSnapshot.docs.map(
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.sectionname}>{user?.fullName},</Text>*/}
      <Text style={styles.sectionTitle}>User Level: {userLevel}</Text>

      <Text style={styles.sectionTitle}>Wrong Answers Voice Task:</Text>
      <View style={styles.answersContainer}>
        {Object.entries(wrongAnswersCount).map(([answer, count], index) => (
          <View key={index} style={styles.answerContainer}>
            <Text style={styles.answer}>{answer}</Text>
           
            <View style={styles.countContainer}>
              <View style={styles.countCircle}>
                <Text style={styles.count}>{count}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Wrong Answers Writing Task:</Text>
      <View style={styles.answersContainer}>
        {Object.entries(wrongAnswersWritingCount).map(([answer, count], index) => (
          <View key={index} style={styles.answerContainer}>
            <Text style={styles.answer}>{answer}</Text>
            <View style={styles.countContainer}>
              <View style={styles.countCircle}>
                <Text style={styles.count}>{count}</Text>
              </View>
            </View>
          </View>
        ))}
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
  sectionname :{
    fontFamily:'outfi-bold',
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 28,
  },
  sectionnameTitle :{
    fontFamily:'outfit',
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily:'outfit',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  answersContainer: {
    marginLeft: 10,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  answer: {
    marginRight: 10,
    borderRadius: 10,
    marginTop: 15, // Adjust as needed
    borderWidth: 1,
    borderColor: 'red',
    padding: 10,
  },
  countContainer: {
    marginLeft: 'auto',
  },
  countCircle: {
    backgroundColor: 'red', // Change color as needed
    borderRadius: 20, // Adjust according to desired shape
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  count: {
    color: 'white', // Change text color as needed
    fontWeight: 'bold',
  },
});
