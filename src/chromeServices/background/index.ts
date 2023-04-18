import { ChromeStorage } from "../storage";
import { Card, MTranslationSnapshot } from "../types";
import { requestParsers } from "./requestParser";

console.log("Kache background script init!")

const languageMap = {
    "english": "en",
} //If not in this map just ignore (trash value)
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
            console.log("make", currentWebRequest);
        }
    }
}, {
    urls: ["http://*/*",
        "https://*/*"]
}, ["requestBody"]);
chrome.webRequest.onCompleted.addListener((request) => {
    if (request.requestId === currentWebRequest.id) { //older requests don't matter
        currentWebRequest.timeCompleted = +new Date();
    }
    // console.log(currentWebRequest);
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
    console.log(existingPendingCards);
    await ChromeStorage.setPair("pending", existingPendingCards);

}

chrome.runtime.onConnect.addListener(
    function (port) {
        if (port.name === "snapshot") {
            port.onMessage.addListener(function (translationSnapshot: MTranslationSnapshot) {

                console.log(translationSnapshot);
                if (currentWebRequest.input === translationSnapshot.inputText && currentWebRequest.timeCompleted) {
                    //if there was no network request (cuz the translation app cached the data somewhere or if the request is complete)
                    const timeAfterDefinitionLoad = (+new Date() - (currentWebRequest.timeCompleted ?? 0));
                    const timeAfterInput = +new Date() - translationSnapshot.inputTime;
                    console.log("Matched to web request!");
                    console.log(`input to output time: ${timeAfterInput - timeAfterDefinitionLoad}`); //TODO: Do some more filtering here; also if this is negative it means that the web request legit does not match the current one (the user just retyped the thing for no apparent reason)
                    console.log(`output time to now ${timeAfterDefinitionLoad}`);


                    console.log("Adding snapshot:", translationSnapshot);
                    addFlashcard(translationSnapshot);
                    port.postMessage(true);
                } else {
                    console.log("skipped request", translationSnapshot, currentWebRequest);
                    port.postMessage(false);
                }
            });

        }
    }
);

export { }
