import { logger } from "../logger";
import { ChromeStorage } from "../../utils/storage/storage";
import { ITranslationSnapshot } from "../types";
import { requestParsers } from "./requestParser";
import { Card, Folder, Filter } from "../../types/storageTypes";
import { similar } from "../../utils/strings";
import { nanoid } from "nanoid";
import ISO6391 from 'iso-639-1';
import { addData } from "./firebase";



logger.info("Kache background script init!")

let currentWebRequest: {
    id: string,
    input: string,
    timeCompleted?: number //undefined if it's not completed 
} = {
    "id": "",
    "input": "",
} //current singular request (assuming that you wouldn't be translating on multiple sites at the same exact time)
chrome.webRequest.onBeforeRequest.addListener((request) => {
    for (const requestParser of requestParsers) {
        if (requestParser.match(request.url)) {
            currentWebRequest = requestParser.parseRequest(request);
            logger.debug("Initialized request", currentWebRequest);
        }
    }
}, {
    urls: ["http://*/*",
        "https://*/*"]
}, ["requestBody"]);
chrome.webRequest.onCompleted.addListener((request) => {
    if (request.requestId === currentWebRequest.id && !currentWebRequest.timeCompleted) { //older requests don't matter
        currentWebRequest.timeCompleted = +new Date();
        logger.debug("Completed request", currentWebRequest);
    }
}, {
    urls: ["http://*/*",
        "https://*/*"]
});

const filterCards = (snapshot: ITranslationSnapshot, filters: Filter[]) => {
         if (!filters.length) return ["root"];
    
         const fitSize = (length: {direction: string, number: number} | undefined, frontLength: number, backLength: number) => {
           if (!length) return true;
           if (length.direction === "greater") {
             return (
               Math.max(frontLength, backLength) >
               length.number
             );
           } else {
             return (
               Math.min(frontLength, backLength) <=
               length.number
             );
           }
         };

         const hasWords = (words: string[] | undefined, text: string) => {
            if(words === undefined)
                return true;
            return words.every((word) => text.includes(word))
        };

        const hasLang = (lang: string[] | undefined, cardLang: string) => (lang === undefined || lang!.includes(cardLang))
        
        let destinations: string[] = [];

        filters.forEach((filter) => {
            if(hasLang(filter.frontLang, snapshot.inputLang) || hasLang(filter.backLang, snapshot.outputLang) ||
                hasWords(filter.words, snapshot.inputText) || fitSize(filter.length, snapshot.inputText.length, snapshot.outputText.length))
                destinations.push(filter.destination)
        })
        return destinations.length? destinations: ["root"];

}

const addFlashcard = async (snapshot: ITranslationSnapshot) => {
    // NOTE: most recent cards are at the end of the array (it is assumed for now)
    const cards: Card[] = (await ChromeStorage.get("cards") as Card[] ?? []);
    const hiddenCount = cards.reduce((sum, card) => sum + (card.hidden ? 1 : 0), 0)
    const filters: Filter[] = (await ChromeStorage.get("filters") as Filter[] ?? []);
    let hidden = hiddenCount < 30 ? Math.random() < 0.5 : false; //set cutoff at 30
    for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].location !== "root") continue;
        const isOldCard = snapshot.inputTime - cards[i].timeCreated >= 30 * 1000; //some arbitrary cutoff point for similarity checking

        //exact match? definitely don't need it
        if (cards[i].front.text === snapshot.inputText || (!isOldCard && similar(cards[i].front.text, snapshot.inputText))) {
            hidden = !!cards[i].hidden; //if visible property is undefined, it's also visible (!! converts undefined to false)
            cards.splice(i, 1);
            break; //why would you want to overwrite anything extra?
        }
    }

    filterCards(snapshot, filters).forEach((dest) => {
        cards.push({
            hidden,
            front: {
                text: snapshot.inputText,
                lang: snapshot.inputLang
            }, back: {
                text: snapshot.outputText,
                lang: snapshot.outputLang
            },
            id: nanoid(),
            location: dest, //The Just Collected folder
            timeCreated: snapshot.inputTime,
            source: snapshot.source,
    
        });
    })

    logger.info("Adding snapshot", snapshot);

    await ChromeStorage.setPair("cards", cards);
}
const getLangCode = (lang: string) => {
    lang = lang.toLowerCase();
    const langCode: string = ISO6391.validate(lang) ? lang : ISO6391.getCode(lang); //if it's already the code you don't have to do anything
    if (langCode === "") {
        logger.warn(`Unsupported language ${lang}`);
        return lang; //we'll just preserve this value for now... 
    }
    return langCode;
}
const uploadStorage = async () => {
    const allData = await ChromeStorage.getAll();
    logger.info("Uploading to firebase...");
    if ("userId" in allData && typeof allData.userId === "string") {
        logger.info("Found userId", allData.userId);
        await addData(allData.userId, allData);
    }
}


chrome.alarms.onAlarm.addListener(uploadStorage);
chrome.runtime.onConnect.addListener(
    function (port) {
        if (port.name === "snapshot") {
            port.onMessage.addListener(function (translationSnapshot: ITranslationSnapshot) {
                translationSnapshot.inputLang = getLangCode(translationSnapshot.inputLang);
                translationSnapshot.outputLang = getLangCode(translationSnapshot.outputLang);

                if (translationSnapshot.validated || (currentWebRequest.input === translationSnapshot.inputText && currentWebRequest.timeCompleted && +new Date() - currentWebRequest.timeCompleted >= 200)) {
                    //if there was no network request (cuz the translation app cached the data somewhere or if the request is complete)
                    // const timeAfterOutput = (+new Date() - (currentWebRequest.timeCompleted ?? 0));
                    // const timeAfterInput = +new Date() - translationSnapshot.inputTime;
                    // logger.debug(`input to output time: ${timeAfterInput - timeAfterOutput}`); //TODO: Do some more filtering here; also if this is negative it means that the web request legit does not match the current one (the user just retyped the thing for no apparent reason)
                    // logger.debug(`output time to now ${timeAfterOutput}`);
                    // logger.debug(timeAfterInput);
                    logger.info("Adding snapshot", translationSnapshot);
                    addFlashcard(translationSnapshot);
                    port.postMessage(true);
                } else {
                    logger.info("Skipped request", translationSnapshot);
                    port.postMessage(false);
                }
            });

        }
    }
);

/** 
 * Storage Versioning
 * 1 - Beta (First release)
 * 2 - Saved Languages are now normalized to the ISO-639-1 standard
 * 3 - User ID (for Firebase)
 */
async function updateStorageVersion() {
    const currentVersion = await ChromeStorage.get("storageVersion") as number | undefined;
    logger.debug(`Current storage version: ${currentVersion}`);
    // Fallthrough is intended as you want to update whatever storage version you have to the latest.
    switch (currentVersion) {
        case undefined:
        /*@ts-ignore*/
        // eslint-disable-next-line no-fallthrough
        case 1:
            const cards = ((await ChromeStorage.get("cards")) ?? []) as Card[];
            for (const card of cards) {
                card.front.lang = getLangCode(card.front.lang);
                card.back.lang = getLangCode(card.back.lang);
            }
            await ChromeStorage.setPair("cards", cards);
        /*@ts-ignore*/
        // eslint-disable-next-line no-fallthrough
        case 2:
            await ChromeStorage.setPair("userId", nanoid(5));
        /*@ts-ignore*/
        // eslint-disable-next-line no-fallthrough
        case 3:
            const folders = ((await ChromeStorage.get("folders")) ?? []) as Folder[];
            if (!folders.length) {
                await ChromeStorage.setPair("folders", [
                    //move the folder creation to backend
                    {
                        name: "Saved",
                        id: nanoid(),
                    },
                    {
                        name: "Just Collected",
                        id: "root",
                    },
                ]);
            }
        /*@ts-ignore*/
        // eslint-disable-next-line no-fallthrough
        case 4:
            logger.info("Updated to storage version 4");
            await ChromeStorage.setPair("storageVersion", 4);
            break;
        default:
            throw new Error(`Invalid storage version ${currentVersion}`);
    }
};

chrome.runtime.onInstalled.addListener(async () => {
    await updateStorageVersion();
    const existingFirebaseAlarm = await chrome.alarms.get("firebaseUpload");
    if (!existingFirebaseAlarm) {
        logger.debug("Setting Firebase alarm");
        chrome.alarms.create("firebaseUpload", {
            periodInMinutes: 60,
            delayInMinutes: 0,
        });
    } else {
        logger.debug("Firebase alarm exists");
    }
}); //run this only on first load 

