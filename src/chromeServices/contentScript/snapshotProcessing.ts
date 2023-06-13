import { logger } from "../logger";
import { ITranslationSnapshot } from "../types";
import { sendSnapshot } from "./messaging";


let timeIntervals: number[] = [];
export function processCurrentSnapshot(snapshot: ITranslationSnapshot) {
    // logger.debug(snapshot);
    console.log(snapshot.newInputText);
    const timeDifferenceMs = +new Date() - snapshot.inputTime;
    timeIntervals.push(timeDifferenceMs);
    //let's see if there's anything viable to send over (NOTE: this gets further processed in the backend)
    if (timeDifferenceMs >= 500 && (snapshot.newInputText === snapshot.inputText || !snapshot.newInputText.startsWith(snapshot.inputText))) { //if it's the same then that's a courtesy ping (so we record it)
        if (snapshot.inputText !== "" && snapshot.outputText !== "") {
            sendSnapshot(snapshot);
        }
    }
}

