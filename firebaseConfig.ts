import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCK4r0HJnTTvjuYv0PNHqMk3erxqp4H1kU",
  authDomain: "mttakbtkdjtd.firebaseapp.com",
  projectId: "mttakbtkdjtd",
  storageBucket: "mttakbtkdjtd.appspot.com",
  messagingSenderId: "852507146163",
  appId: "1:852507146163:web:fb9f31264e79265c367dc6",
  measurementId: "G-9X3TEFF8WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with persistent storage using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// add storage
const storage = getStorage(app);
// add db
const db = getFirestore(app);
// Export Firebase services
export { app, auth, storage, db };