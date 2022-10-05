// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDWLriaoF39sbHc9zVaf5qksbYvMSUYJT0',
  authDomain: 'amyo-party.firebaseapp.com',
  projectId: 'amyo-party',
  storageBucket: 'amyo-party.appspot.com',
  messagingSenderId: '390427630936',
  appId: '1:390427630936:web:6c5d55181e7f6166c3192d',
  measurementId: 'G-83B4Z7051K',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;
