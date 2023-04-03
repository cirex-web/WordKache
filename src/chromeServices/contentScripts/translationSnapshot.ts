import { TranslationSnapshot } from "../configTypes";

//TODO: try catch sendMessage
let previousTime = +new Date();
export function processCurrentSnapshot(translationData: TranslationSnapshot) {
    const curTime = +new Date();
    const timeDifferenceMs = curTime - previousTime;
    if (timeDifferenceMs >= 2000) {
        if (translationData.inputText !== "" && translationData.outputText !== "") {
            chrome.runtime.sendMessage(JSON.stringify(translationData)); //TODO: finish message passing and also debug logging
        }
    }
    previousTime = curTime;
}