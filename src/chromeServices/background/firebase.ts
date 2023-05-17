// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { logger } from "../logger";

// this is public but that's fine
const firebaseConfig = {
    apiKey: "AIzaSyBb6O-EVKWYnTYooRfmDSa7xaJX1LWNNxk",
    authDomain: "wordkache.firebaseapp.com",
    projectId: "wordkache",
    storageBucket: "wordkache.appspot.com",
    messagingSenderId: "673136087991",
    appId: "1:673136087991:web:31bc60b43177f991c64e32",
    measurementId: "G-FL6DD4ZEQZ"
};

// Initialize Firebase
const db = getFirestore(initializeApp(firebaseConfig));
export const addData = async (id: string, content: any) => {
    try {
        await setDoc(doc(db, "users", id), { ...content, lastUpdated: +new Date() });
    } catch (e) {
        logger.warn(e);
    }
}