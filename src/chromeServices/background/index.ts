import { MTranslationSnapshot } from "../types";

console.log("Kache background script init!")

const languageMap = {
    "english": "en",
} //If not in this map just ignore (trash value)
const SUPPORTED_LANGUAGES = ['en', 'es'];
// const savedTranslations: TranslationSnapshot[] = [];

//you mean someone could just open another tab of the same thing, make another query, (but fast) so the code uses the cached value cuz it thinks it's the same?

let currentWebRequest: {
    id: string,
    input: string,
    timeCompleted?: number //undefined if it's not compeleted 
} = {
    "id": "",
    "input": "",
} //current singular request (assuming that you wouldn't be translating on multiple sites at the same exact time)
chrome.webRequest.onBeforeRequest.addListener((requestDetails) => {
    // for (const config of URL_CONFIGS) {
    //     if (config.match(new URL(requestDetails.url))) {


    //     }
    // }
}, {
    urls: [
        "http://*/*",
        "https://*/*"
    ],
    types: ["xmlhttprequest"]
}, ['requestBody']);
chrome.webRequest.onCompleted.addListener((request) => {
    if (request.requestId === currentWebRequest.id) { //older requests don't matter
        currentWebRequest.timeCompleted = +new Date();
    }
}, {
    urls: ["http://*/*",
        "https://*/*"]
});
chrome.runtime.onConnect.addListener(
    function (port) {
        if (port.name === "snapshot") {
            const localCache: { [url: string]: Map<string, string> } = {};
            chrome.webRequest.onCompleted.addListener((request) => {
                console.log("INHERE!!!!");
                if (request.requestId === currentWebRequest.id) { //older requests don't matter
                    currentWebRequest.timeCompleted = +new Date();
                }
            }, {
                urls: ["http://*/*",
                    "https://*/*"]
            });
            port.onMessage.addListener(function (translationSnapshot: MTranslationSnapshot) {
                console.log(translationSnapshot);
                if (currentWebRequest.input !== translationSnapshot.inputText || currentWebRequest.timeCompleted) {
                    //if there was no network request (cuz the translation app cached the data somewhere or if the request is complete)
                    const timeAfterDefinitionLoad = (+new Date() - (currentWebRequest.timeCompleted ?? 0));
                    const timeAfterInput = +new Date() - translationSnapshot.inputTime;
                    if (currentWebRequest.input === translationSnapshot.inputText) {
                        console.log("Matched to web request!");
                        console.log(`input to output time: ${timeAfterInput - timeAfterDefinitionLoad}`); //TODO: Do some more filtering here; also if this is negative it means that the web request legit does not match the current one (the user just retyped the thing for no apparent reason)
                        console.log(`output time to now ${timeAfterDefinitionLoad}`);
                    }

                    console.log("Adding snapshot:", translationSnapshot);
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
