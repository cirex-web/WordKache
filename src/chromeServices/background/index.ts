import { logger } from "../logger";
import { ChromeStorage } from "../../utils/storage";
import { ITranslationSnapshot } from "../types";
import { requestParsers } from "./requestParser";
import { Card } from "../../storageTypes";
import { similar } from "../../utils/strings";
import { nanoid } from "nanoid";
import ISO6391 from 'iso-639-1';
import { isVisible } from "@testing-library/user-event/dist/utils";

logger.info("Kache background script init!")



//keys are all lowercase
const languageMap = {
    "english": "en",
    "spanish": "es",
} as const //If not in this map just ignore (trash value)
const SUPPORTED_LANGUAGES = ['en', 'es'];


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

const addFlashcard = async (snapshot: ITranslationSnapshot) => {
    const cards: Card[] = (await ChromeStorage.get("cards") as Card[] ?? []);

    // NOTE: most recent cards are at the end of the array (it is assumed for now)
    let isVisible : boolean = true;
    for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].location !== "root") continue;
        const oldCard = snapshot.inputTime - cards[i].timeCreated >= 30 * 1000; //some arbitrary cutoff point for similarity checking
        //exact match? definitely don't need it
        if (cards[i].front.text === snapshot.inputText || (!oldCard && similar(cards[i].front.text, snapshot.inputText))) {
            isVisible = cards[i].visible;
            cards.splice(i, 1);
        } else {
            isVisible = Math.random() < 0.5 ? true : false;
            break;
        }
    }
        cards.push({
        front: {
            text: snapshot.inputText,
            lang: snapshot.inputLang
        }, back: {
            text: snapshot.outputText,
            lang: snapshot.outputLang
        },
        id: nanoid(),
        location: "root", //The Just Collected folder
        timeCreated: snapshot.inputTime,
        source: snapshot.source,
        visible: isVisible
    });
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
            ChromeStorage.setPair("cards", cards);
        // eslint-disable-next-line no-fallthrough
        case 2:
            logger.info("Storage updated to version 2!");
            break;
        default:
            throw new Error(`Invalid storage version ${currentVersion}`);

    }
    await ChromeStorage.setPair("storageVersion", 2);

};
chrome.runtime.onInstalled.addListener(updateStorageVersion); //run this only on first load 

