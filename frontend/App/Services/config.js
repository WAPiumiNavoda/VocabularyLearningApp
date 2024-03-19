import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyD1s4ysOtSxX0O76kDJ2W1tulhUg27IYdE",
  authDomain: "vocabapp-fdcda.firebaseapp.com",
  projectId: "vocabapp-fdcda",
  storageBucket: "vocabapp-fdcda.appspot.com",
  messagingSenderId: "257140734394",
  appId: "1:257140734394:web:837cf3e229aafdaac1c583",
  measurementId: "G-KDBRCH7T3C"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


// Modify handleAuthentication function to store user ID after authentication
const handleAuthentication = async () => {
  try {
    if (user) {
      // If user is already authenticated, log out
      console.log('User logged out successfully!');
      await signOut(auth);
    } else {
      // Sign in or sign up
      let loggedInUser;
      if (isLogin) {
        // Sign in
        loggedInUser = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully!');
      } else {
        // Sign up
        loggedInUser = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully!');
      }

      // Store the user ID
      if (loggedInUser) {
        saveWrongAnswersToFirebase([], loggedInUser.user.uid);
        console.log("saveWrongAnswersToFirebase " + loggedInUser.user.uid);
      }
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
  }
};

export const saveWrongAnswersToFirebase = async (newWrongAnswers, userId) => {
  try {
    const userWrongAnswersRef = firebase.firestore().collection('voicewrong').doc(userId);

    const userWrongAnswersDoc = await userWrongAnswersRef.get();
    const existingWrongAnswers = userWrongAnswersDoc.exists ? userWrongAnswersDoc.data().wrongAnswers : [];
    const updatedWrongAnswers = [...existingWrongAnswers, ...newWrongAnswers];

    await userWrongAnswersRef.set({
      wrongAnswers: updatedWrongAnswers,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Wrong answers saved successfully!");
  } catch (error) {
    console.error('Error saving wrong answers to Firestore:', error);
  }
};


export const saveUseTaskDetails = async (userId, category, timer, percentageScore, wrongAnswers) => {
  try {
    const tasksCollection = firebase.firestore().collection('tasks');
    const categoryDocRef = tasksCollection.doc(userId).collection(category).doc('summary');
    const categoryDoc = await categoryDocRef.get();

    let totalTime = timer;
    let totalcorrect = percentageScore;
    let totalWrongAnswers = wrongAnswers.length;
   

    if (categoryDoc.exists) {
      const data = categoryDoc.data();
      totalTime += data.totalTime || 0;
      totalcorrect += data.totalcorrect || 0;
      totalWrongAnswers += data.totalWrongAnswers || 0;
    }


    await categoryDocRef.set({
      totalTime,
      totalcorrect,
      totalWrongAnswers
    });

    const taskDocRef = await tasksCollection.doc(userId).collection(category).add({
      timer,
      totalcorrect,
      wrongAnswers,
    });

    console.log("Task data saved to Firestore successfully.");
    return taskDocRef.id; 
  } catch (error) {
    console.error("Error saving task data to Firestore:", error);
    throw error; 
  }
};


export const saveUseWritingTaskDetails = async (
  userId,
  category,
  totalTime,
  totalpercentageScore,
  totalCorrectAnswers
) => {
  try {
    const tasksCollection = firebase.firestore().collection('writingTasks'); // Use the same collection name as in the previous page

    if (!category) {
      console.error("Error: Category is empty or undefined");
      return;
    }

    const categoryDocRef = tasksCollection.doc(userId).collection(category).doc('summary');
    const categoryDoc = await categoryDocRef.get();

    let updatedTotalTime = totalTime;
    let updatedTotalpercentageScore = totalpercentageScore;
    let updatedToCorrectAnswers = totalCorrectAnswers.length;
 
    if (categoryDoc.exists) {
      const data = categoryDoc.data();
      updatedTotalTime += data.totalTime || 0;
      updatedTotalpercentageScore += data.totalpercentageScore || 0;
      updatedToCorrectAnswers += data.totalCorrectAnswers.length || 0
    }

    await categoryDocRef.set({
      totalTime: updatedTotalTime,
      totalpercentageScore: updatedTotalpercentageScore,
      totalCorrectAnswers : updatedToCorrectAnswers
    });

    console.log("Writing task data saved to Firestore successfully.");
  } catch (error) {
    console.error("Error saving writing task data to Firestore:", error);
    throw error; 
  }
};


export const fetchTaskSummary = async (userId, category) => {
  try {
    const tasksCollection = firebase.firestore().collection('tasks');
    const categoryDocRef = tasksCollection.doc(userId).collection(category).doc('summary');
    const categoryDoc = await categoryDocRef.get();

    if (categoryDoc.exists) {
      console.log("Data :" + categoryDocRef);
      return categoryDoc.data();
    } else {
      console.log('Summary document does not exist for category:', category);
      return null;
    }
  } catch (error) {
    console.error('Error fetching task summary:', error);
    throw error;
  }
};


export const fetchtotalCorrectAnswers = async (userId, category) => {
  try {
    const tasksCollection = firebase.firestore().collection('writingTasks');
    const categoryDocRef = tasksCollection.doc(userId).collection(category).doc('summary');
    const categoryDoc = await categoryDocRef.get();

    if (categoryDoc.exists) {
      console.log("Writing Task Data :" + categoryDocRef);
      return categoryDoc.data();
    } else {
      console.log('Summary document does not exist for category:', category);
      return null;
    }
  } catch (error) {
    console.error('Error fetching task summary:', error);
    throw error;
  }
};


export { firebase , db , firebaseConfig};

