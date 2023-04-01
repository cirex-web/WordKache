import { TranslationSnapshot } from "../configTypes";

//TODO: try catch sendMessage
let previousTime = +new Date();
export function processCurrentSnapshot(translationData: TranslationSnapshot) {
    const curTime = +new Date();
    const timeDifferenceMs = curTime - previousTime;
    if (timeDifferenceMs >= 2000) {
        if (translationData.inputText !== "" && translationData.outputText !== "") {

            console.log(JSON.stringify(translationData));
        }
    }
    previousTime = curTime;
}