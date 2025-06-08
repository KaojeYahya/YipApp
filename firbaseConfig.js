import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDLU94VrXLgVeTMOGA6FWbTUcpH3MTu7IQ",
  authDomain: "crud-3cb2e.firebaseapp.com",
  projectId: "crud-3cb2e",
  storageBucket: "crud-3cb2e.appspot.com",
  messagingSenderId: "372464856935",
  appId: "1:372464856935:web:45280a87e3e17d0ebc09c2",
  measurementId: "G-WHMDZ413JZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
