/* The code you provided is setting up a Firebase configuration, initializing Firebase with the
configuration, and defining functions related to user authentication and saving wrong answers to
Firestore. */
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

//voice wrrong answers save to db
export const saveWrongAnswersToFirebase = async (wrongAnswers, userId) => {
  try {
    const userWrongAnswersRef = firebase.firestore().collection('voicewrong').doc(userId);

    await userWrongAnswersRef.set({
      wrongAnswers: wrongAnswers,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Wrong answers saved successfully!");
  } catch (error) {
    console.error('Error saving wrong answers to Firestore:', error);
  }
};




export { firebase , db , firebaseConfig};

