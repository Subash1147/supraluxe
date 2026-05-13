import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBxEKbL7lAHHadJz-a1M9Ekn7YevxQFPSI',
  authDomain: 'fashion-5c5c0.firebaseapp.com',
  projectId: 'fashion-5c5c0',
  storageBucket: 'fashion-5c5c0.firebasestorage.app',
  messagingSenderId: '555297308868',
  appId: '1:555297308868:web:5b9a5ba0f04dedd624c991',
  measurementId: 'G-EP8T803Q5S',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firebase Firestore
export const db = getFirestore(app)

// Enable Google Sign-In
export const enableGoogleSignIn = true
