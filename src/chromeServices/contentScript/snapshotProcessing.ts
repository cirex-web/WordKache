import { ITranslationSnapshot, MTranslationSnapshot } from "../types";
import { sendSnapshot } from "./messaging";

let previousTimeMs = +new Date();
let previousInput = "";
let snapshotBeforeDeletionStarted: MTranslationSnapshot;
let prevAction: "addition" | "deletion";

export function processCurrentSnapshot(snapshot: ITranslationSnapshot) {
    console.log(snapshot);
    if (snapshot.inputText === previousInput) return; //user performed some non text mutation operation (like clicking, doing CMD-A, etc.)
    previousInput = snapshot.inputText;
    const curTimeMs = +new Date();
    const timeDifferenceMs = curTimeMs - previousTimeMs;
    const currentAction = snapshot.newInputText.length > snapshot.inputText.length ? "addition" : "deletion";


    //let's see if there's anything viable to send over (NOTE: this gets further processed in the backend)
    if (timeDifferenceMs >= 200 && prevAction !== currentAction) {
        if (snapshot.inputText !== "" && snapshot.outputText !== "") {
            sendSnapshot({ ...snapshot, inputTime: previousTimeMs });
        }
    } else if (snapshot.newInputText === "" && +new Date() - snapshotBeforeDeletionStarted.inputTime > 500) { //sanity time check to make sure it wasn't a quick delete
        sendSnapshot(snapshotBeforeDeletionStarted); //for continuous deletion following translation
    }
    previousTimeMs = curTimeMs;
    prevAction = currentAction;
    console.assert(snapshot.newInputText.length !== snapshot.inputText.length);
}

