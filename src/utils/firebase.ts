// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { logger } from "../chromeServices/logger";
import XLSX from "xlsx"
import { Card } from "../storageTypes";
import ISO6391 from 'iso-639-1';

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
    logger.debug(id, content);
    try {
        await setDoc(doc(db, "users", id), { ...content, lastUpdated: +new Date() });
    } catch (e) {
        logger.warn(e);
    }
}

export const fetchData = async (subfolder: string, id: string) => {
    const document = await getDoc(doc(db, subfolder, id));
    return document.exists() ? document.data() : undefined;
}



export const getUserDataSpreadsheet = async () => {
    const workbook = XLSX.utils.book_new();

    const querySnapshot = await getDocs(collection(db, "users"));
    const allData: { cards: Card[], userId: string }[] = [];
    querySnapshot.forEach(doc => allData.push(doc.data() as typeof allData[0]));
    allData.sort((a, b) => b.cards.length - a.cards.length);
    for (const data of allData) {
        const cards = data.cards;

        // let visible = 0, hidden = 0;
        // const newCards = [];
        // for (let i = 0; i < cards.length; i++) {
        //     const card = cards[i];
        //     if (card.hidden && hidden < 30) {
        //         hidden++;
        //         newCards.push(card);
        //     }
        //     if (!card.hidden && visible < 30) {
        //         visible++;
        //         newCards.push(card);
        //     }
        // }
        //first 30 hidden and visible cards
        const sheet = XLSX.utils.json_to_sheet(cards.sort((a: Card, b: Card) => +!!a.hidden - +!!b.hidden).map((card: Card) => {
            const frontLang = ISO6391.getName(card.front.lang);
            const backLang = ISO6391.getName(card.back.lang);
            return { "Front": `${card.front.text} (${frontLang} -> ${backLang})`, "Back": card.back.text, "Hidden": !!card.hidden }
        }));
        XLSX.utils.book_append_sheet(workbook, sheet, data.userId);
    };
    XLSX.writeFile(workbook, "wordkacheData.xlsx", { compression: true });
}
