import { sanitize } from "../../utils/strings";
import { logger } from "../logger";
import { ITranslationSnapshot, MTranslationSnapshot } from "../types";
import { sendSnapshot } from "./messaging";

let previousTimeMs = +new Date();
let timeIntervals: number[] = [];
export function processCurrentSnapshot(snapshot: ITranslationSnapshot) {
    if (!snapshot.newInputText) snapshot.newInputText = snapshot.inputText; //assuming no change... (ex. when tab loses focus)

    for (const [key, val] of Object.entries(snapshot)) {
        snapshot[key as keyof ITranslationSnapshot] = sanitize(val);
    }
    logger.debug(snapshot);

    const curTimeMs = +new Date();
    const timeDifferenceMs = curTimeMs - previousTimeMs;
    timeIntervals.push(timeDifferenceMs);
    //let's see if there's anything viable to send over (NOTE: this gets further processed in the backend)
    if (timeDifferenceMs >= 200 && (snapshot.newInputText === snapshot.inputText || !snapshot.newInputText.startsWith(snapshot.inputText))) { //if it's the same then that's a courtesy ping (so we record it)
        if (snapshot.inputText !== "" && snapshot.outputText !== "") {
            sendSnapshot({ ...snapshot, inputTime: previousTimeMs });
        }
    }
    previousTimeMs = curTimeMs;
}

