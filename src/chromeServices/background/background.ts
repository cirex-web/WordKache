import { TranslationSnapshot } from "../configTypes";

console.log("Kache background script init!")

const languageMap = {
    "english": "en",
} //If not in this map just ignore (trash value)
const SUPPORTED_LANGUAGES = ['en', 'es'];
const savedTranslations: TranslationSnapshot[] = [];

chrome.webRequest.onBeforeRequest.addListener((requestDetails) => {
    console.log(requestDetails.requestBody);
}, {
    urls: [
        "http://*/*",
        "https://*/*"
    ],
    types: ["xmlhttprequest"]
});

chrome.runtime.onMessage.addListener(
    function (request: TranslationSnapshot, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        // console.log(request);
        savedTranslations.push(request);
        console.log(savedTranslations);
    }
);

export { }
