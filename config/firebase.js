import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants'
import {API_KEY, APP_ID, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID} from '@env'

// const firebaseConfig = {
//     apiKey: API_KEY,
//     authDomain: AUTH_DOMAIN,
//     projectId: PROJECT_ID,
//     storageBucket: STORAGE_BUCKET,
//     messagingSenderId: MESSAGING_SENDER_ID,
//     appId: APP_ID,
//     databaseURL: Constants.expoConfig.extra.databaseURL
//   };


  const firebaseConfig = {
    apiKey: "AIzaSyAyL9uio3zr2DeIdSUL1qpD040YFTNKNbU",
    authDomain: "pickup-e0428.firebaseapp.com",
    projectId: "pickup-e0428",
    storageBucket: "pickup-e0428.appspot.com",
    messagingSenderId: "160803282306",
    appId: "1:160803282306:web:9bb41f6ca63f97f3aa039b",
    measurementId: "G-9XFJGL7T95",
    databaseURL: Constants.expoConfig.extra.databaseURL
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();