import { sanitize } from "../../utils/strings";
import { logger } from "../logger";
import { ITranslationSnapshot, MTranslationSnapshot } from "../types";
import { sendSnapshot } from "./messaging";

let previousTimeMs = +new Date();

export function processCurrentSnapshot(snapshot: ITranslationSnapshot) {
    for (const [key, val] of Object.entries(snapshot)) {
        snapshot[key as keyof ITranslationSnapshot] = sanitize(val);
    }
    logger.debug(snapshot);

    const curTimeMs = +new Date();
    const timeDifferenceMs = curTimeMs - previousTimeMs;

    //let's see if there's anything viable to send over (NOTE: this gets further processed in the backend)
    if (timeDifferenceMs >= 200 && !snapshot.newInputText.substring(0, snapshot.newInputText.length - 1).startsWith(snapshot.inputText)) { //if it's the same then that's a courtesy ping (so we record it)
        if (snapshot.inputText !== "" && snapshot.outputText !== "") {
            sendSnapshot({ ...snapshot, inputTime: previousTimeMs });
        }
    }
    previousTimeMs = curTimeMs;
}

