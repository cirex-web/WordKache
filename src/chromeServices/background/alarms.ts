import { addData } from "../../utils/firebase";
import { ChromeStorage } from "../../utils/storage/storage";
import { logger } from "../logger";

export const uploadStorage = async (alarm: chrome.alarms.Alarm) => {
    if (alarm.name !== "firebaseUpload") return;
    const allData = await ChromeStorage.getAll();
    logger.info("Uploading to firebase...");
    if ("userId" in allData && typeof allData.userId === "string") {
        logger.info("Found userId", allData.userId);
        await addData(allData.userId, allData);
    }
}
export const preloadHTML = async (alarm: chrome.alarms.Alarm) => {
    if (alarm.name !== "preloadHTML") return;
    if (!await chrome.offscreen.hasDocument()) {
        await chrome.offscreen.createDocument({
            url: "index.html",
            reasons: [chrome.offscreen.Reason.DISPLAY_MEDIA],
            justification: "Helps with faster load times of popup"
        });
        logger.info("Set up hidden HTML page for faster load times!");
    }
}

export const addAlarm = async (name: string, alarmInfo: chrome.alarms.AlarmCreateInfo) => {
    const existingAlarm = await chrome.alarms.get(name);
    if (!existingAlarm) {
        chrome.alarms.create(name, alarmInfo);
    }
}


