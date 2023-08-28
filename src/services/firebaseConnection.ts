import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB5CEGLDFJoxwmnaMvHoGP3sFuG0IcxY54",
  authDomain: "tarefasplus-11a07.firebaseapp.com",
  projectId: "tarefasplus-11a07",
  storageBucket: "tarefasplus-11a07.appspot.com",
  messagingSenderId: "61142373206",
  appId: "1:61142373206:web:239a5684f1ff902da1fcf7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export {db};