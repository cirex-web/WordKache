import { logger } from "../logger";
import { ITranslationSnapshot } from "../types";

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

export const sendSnapshot = (snapshot: ITranslationSnapshot) => {
    try {
        port.postMessage(snapshot);
        logger.info("sent!", snapshot)
    } catch (e) {
        alert("WordKache extension context invalidated - Please refresh the page.");
    }
}