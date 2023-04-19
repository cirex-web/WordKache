import { logger } from "../logger";
import { IExtendedTranslationSnapshot, MTranslationSnapshot } from "../types";
import { nanoid } from 'nanoid'
let port: chrome.runtime.Port;
const connect = () => {
    logger.debug("Created port connection")
    port = chrome.runtime.connect({ name: "snapshot" });
    port.onMessage.addListener((msg) => {
        logger.info("from port", msg);
    });
    port.onDisconnect.addListener(connect);
}
connect();

/** just validates that whatever data is sent is actually in the proper format */
const _sendSnapshot = (data: MTranslationSnapshot) => {
    try {
        port.postMessage(data);
    } catch (e) {
        alert("WordKache extension context invalidated - Please refresh the page.");
    }
}
export const sendSnapshot = (snapshot: IExtendedTranslationSnapshot) => {
    _sendSnapshot(snapshot);
    logger.info("sent!", snapshot)
}