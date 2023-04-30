import { logger } from "../logger";
import { ChromeStorage } from "../../utils/storage";
import { ITranslationSnapshot } from "../types";
import { requestParsers } from "./requestParser";
import { Card } from "../../storageTypes";
import { similar } from "../../utils/strings";
import { nanoid } from "nanoid";

logger.info("Kache background script init!")

ChromeStorage.setPair("storageVersion", 1);

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
    for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].location !== "root") continue;
        const oldCard = snapshot.inputTime - cards[i].timeCreated >= 30 * 1000; //some arbitrary cutoff point for similarity checking
        //exact match? definitely don't need it
        if (cards[i].front.text === snapshot.inputText || (!oldCard && similar(cards[i].front.text, snapshot.inputText))) {
            cards.splice(i, 1);
        } else {
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
        source: snapshot.source
    });

    await ChromeStorage.setPair("cards", cards);
}
const normalizeLanguage = (lang: string) => {
    lang = lang.toLowerCase();
    if (lang in languageMap) lang = languageMap[lang as keyof typeof languageMap];
    if (!(SUPPORTED_LANGUAGES.includes(lang))) {
        logger.warn(`Unsupported language ${lang}`);
    }
    return lang;
}
chrome.runtime.onConnect.addListener(
    function (port) {
        if (port.name === "snapshot") {
            port.onMessage.addListener(function (translationSnapshot: ITranslationSnapshot) {
                translationSnapshot.inputLang = normalizeLanguage(translationSnapshot.inputLang);
                translationSnapshot.outputLang = normalizeLanguage(translationSnapshot.outputLang);

                if (translationSnapshot.validated || (currentWebRequest.input === translationSnapshot.inputText && currentWebRequest.timeCompleted && +new Date() - currentWebRequest.timeCompleted >= 200)) {
                    //if there was no network request (cuz the translation app cached the data somewhere or if the request is complete)
                    const timeAfterOutput = (+new Date() - (currentWebRequest.timeCompleted ?? 0));
                    const timeAfterInput = +new Date() - translationSnapshot.inputTime;
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
)

export { }
