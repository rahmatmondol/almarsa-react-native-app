// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as ExpoSecureStore from 'expo-secure-store';

const firebaseConfig = {
    apiKey: "AIzaSyBqra8e7ksJwzFsTtF7nprSX2jGyvAcvRY",
    authDomain: "almarsa-app.firebaseapp.com",
    databaseURL: "https://almarsa-app-default-rtdb.firebaseio.com",
    projectId: "almarsa-app",
    storageBucket: "almarsa-app.firebasestorage.app",
    messagingSenderId: "464177351985",
    appId: "1:464177351985:web:674be49ed0359276027410",
    measurementId: "G-MEHJ1S4CWJ"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with Expo Secure Store persistence
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ExpoSecureStore)
// });

// const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();



export { googleProvider, signInWithCredential, database };