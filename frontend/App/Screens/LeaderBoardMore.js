import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { db } from '../Services/config';
import Colors from '../Shared/Colors';
import { useAuth } from '../../Auth/AuthProvider';
import { fetchUserLevel } from '../Services/config';

export default function LeaderBoardMore() {
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
      curr = curr + 1
      return acc;
    }, {});
  };

  // Get count of each wrong answer word
  const wrongAnswersCount = countOccurrences(wrongAnswers);
  const wrongAnswersWritingCount = countOccurrences(correctAnswer);

  return (
    <ScrollView contentContainerStyle={styles.container}>
    

 
    {/* <View style={styles.catregoryContainer}>
          <TouchableOpacity 
            style={styles.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Fruits' })}
          >
            <Text style={styles.categoryTitle}>Voice</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={styles.category}
            onPress={() => navigation.navigate('VoiceMainPage', { category: 'Commands' })}
          >
            <Text style={styles.categoryTitle}>Writing</Text>
          </TouchableOpacity>
        </View> */}


  

    

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
    paddingLeft: 10,
    fontFamily:'outfit',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  answersContainer: {
    marginLeft: 20,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  answer: {
    marginRight: 10,
    borderRadius: 10,
    width: 363,
    marginTop: 15, 
    borderWidth: 1,
    borderColor: Colors.green,
    padding: 10,
  },
  countContainer: {
    marginLeft: 'auto',
    marginRight: 20,
  },
  countCircle: {
    backgroundColor:  Colors.green, 
    borderRadius: 20, 
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  count: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1
},
catregoryContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 30
},
category: {
    width:175,
    height: 180,
    margin: 10,
    borderRadius: 10,
    backgroundColor: Colors.yellow,
    shadowColor: Colors.yellow,
    color: Colors.white,
    shadowOpacity: 5,
    elevation: 5,
    paddingTop: 20,
},
categoryTitle: {
    fontSize: 20,
    fontFamily:'outfit',
    fontWeight:'bold',
    textAlign:'center',
    color: Colors.white,
}
});
