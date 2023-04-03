import { TranslationSnapshot } from "../configTypes";
import { URL_CONFIGS } from "./urlConfig";

console.log("Kache background script init!")

const languageMap = {
    "english": "en",
} //If not in this map just ignore (trash value)
const SUPPORTED_LANGUAGES = ['en', 'es'];
const savedTranslations: TranslationSnapshot[] = [];

let completed_query = {
    "input": "",
    "time": +new Date()
}; //most recent completed translation
let active_request_data = {
    "id": "",
    "query": ""
}; //most recent translation request (past ones don't matter lol)
chrome.webRequest.onBeforeRequest.addListener((requestDetails) => {
    for (const config of URL_CONFIGS) {
        if (config.match(new URL(requestDetails.url))) {

            const requestBody = requestDetails.requestBody!;
            if (!requestBody.error) {
                active_request_data = {
                    id: requestDetails.requestId,
                    query: config.parseBody(requestBody.formData)
                };
                console.log(active_request_data);

            }
        }
    }
}, {
    urls: [
        "http://*/*",
        "https://*/*"
    ],
    types: ["xmlhttprequest"]
}, ['requestBody']);
chrome.webRequest.onCompleted.addListener((request) => {
    if (request.requestId === active_request_data.id) {
        completed_query = {
            input: active_request_data.query,
            time: +new Date()
        }
        console.log(completed_query);
    }
}, {
    urls: ["http://*/*",
        "https://*/*"]
})
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
