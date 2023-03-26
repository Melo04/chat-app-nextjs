import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0wYeuLbIDk97mQDB5cjEfNkvtvAEgbeA",
  authDomain: "chat-app-5318f.firebaseapp.com",
  projectId: "chat-app-5318f",
  storageBucket: "chat-app-5318f.appspot.com",
  messagingSenderId: "949656554300",
  appId: "1:949656554300:web:a65017b46daecc3d73ac39",
  measurementId: "G-LDCL8W2CHN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
