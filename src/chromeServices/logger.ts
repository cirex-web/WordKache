import { ChromeStorage } from "./storage";
const COLORS = {
    "DEBUG": "gray",
    "INFO": "lightblue"
} as const

export const logger = {
    print: (type: "DEBUG" | "INFO",...args:any[]) => console.log(`%c[WordKache]%c[${type}]`, 'color:"rgb(24 100 205)";font-weight:bold', `color:${COLORS[type]}`,...args),
    debug: (...args:any[]) => logger.print("DEBUG", ...args),
    info: (...args:any[]) => logger.print("INFO", ...args)

}
export const sendLog = async (message: string | { [key: string | number]: any }) => {
    const existingLogs: any[] = JSON.parse((await chrome.storage.local.get("logs"))["logs"]) || [];
    await ChromeStorage.set({ logs: JSON.stringify([...existingLogs, { time: +new Date(), message }]) });
}