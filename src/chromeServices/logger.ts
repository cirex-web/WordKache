import { ChromeStorage } from "./storage";

export const LOGGER = {
    PRINT:(s:string,type:string)=>console.log(`[WordKache][${type}] ${s}`),
    DEBUG:(s:string)=>LOGGER.PRINT(s,"DEBUG"),
    INFO:(s:string)=>LOGGER.PRINT(s,"INFO")

}
export const sendLog = async (message: string | { [key: string | number]: any }) => {
    const existingLogs: any[] = JSON.parse((await chrome.storage.local.get("logs"))["logs"]) || [];
    await ChromeStorage.set({ logs: JSON.stringify([...existingLogs, { time: +new Date(), message }]) });
}