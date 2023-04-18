import { IExtendedTranslationSnapshot, MTranslationSnapshot } from "../types";
import { nanoid } from 'nanoid'
const port = chrome.runtime.connect({ name: "snapshot" });
const sessionId = nanoid();

port.onMessage.addListener((msg) => {
    console.log("from port", msg);
});

/** just validates that whatever data is sent is actually in the proper format */
const _sendSnapshot = (data: MTranslationSnapshot) => {
    port.postMessage(data);
}
export const sendSnapshot = (snapshot: IExtendedTranslationSnapshot) => {
    _sendSnapshot(snapshot);
    console.log("sent!", snapshot)
}