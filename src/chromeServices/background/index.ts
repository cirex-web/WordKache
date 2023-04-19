import { logger } from "../logger";
import { ChromeStorage } from "../storage";
import { Card, MTranslationSnapshot } from "../types";
import { requestParsers } from "./requestParser";

logger.info("Kache background script init!")

const languageMap = {
    "english": "en",
} as const //If not in this map just ignore (trash value)
const SUPPORTED_LANGUAGES = ['en', 'es'];
// const savedTranslations: TranslationSnapshot[] = [];


let currentWebRequest: {
    id: string,
    input: string,
    timeCompleted?: number //undefined if it's not compeleted 
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

const addFlashcard = async (snapshot: MTranslationSnapshot) => {
    const existingPendingCards: Card[] = await ChromeStorage.get("pending") as any ?? [];
    existingPendingCards.push({
        front: {
            text: snapshot.inputText,
            lang: snapshot.inputLang
        }, back: {
            text: snapshot.outputText,
            lang: snapshot.outputLang
        }
    });
    await ChromeStorage.setPair("pending", existingPendingCards);

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
            port.onMessage.addListener(function (translationSnapshot: MTranslationSnapshot) {
                translationSnapshot.inputLang = normalizeLanguage(translationSnapshot.inputLang);
                translationSnapshot.outputLang = normalizeLanguage(translationSnapshot.outputLang);
                
                if (currentWebRequest.input === translationSnapshot.inputText && currentWebRequest.timeCompleted && +new Date() - currentWebRequest.timeCompleted >= 200) {
                    //if there was no network request (cuz the translation app cached the data somewhere or if the request is complete)
                    const timeAfterDefinitionLoad = (+new Date() - (currentWebRequest.timeCompleted ?? 0));
                    const timeAfterInput = +new Date() - translationSnapshot.inputTime;
                    logger.debug(`input to output time: ${timeAfterInput - timeAfterDefinitionLoad}`); //TODO: Do some more filtering here; also if this is negative it means that the web request legit does not match the current one (the user just retyped the thing for no apparent reason)
                    logger.debug(`output time to now ${timeAfterDefinitionLoad}`);


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
