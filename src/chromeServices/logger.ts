import { ChromeStorage } from "../utils/storage/storage";
const COLORS = {
    "DEBUG": "gray",
    "INFO": "lightblue",
    "WARN": "yellow"
} as const
let existingLogs: any[] = []
ChromeStorage.get("logs").then((logs) => {
    if (logs) existingLogs = logs as any[];
});
let shouldLog: boolean;
ChromeStorage.get("debug").then((data) => shouldLog = !!data);

export const logger = {
    print: (type: "DEBUG" | "INFO" | "WARN", ...args: any[]) => {
        if (shouldLog) console.log(`%c[WordKache]%c[${type}][${+new Date()}]`, 'color:"rgb(24 100 205)";font-weight:bold', `color:${COLORS[type]}`, ...args);
        for (const arg of args) {
            sendLog(arg);
        }
    },
    debug: (...args: any[]) => logger.print("DEBUG", ...args),
    info: (...args: any[]) => logger.print("INFO", ...args),
    warn: (...args: any[]) => logger.print("WARN", ...args)

}
export const sendLog = async (message: string | { [key: string | number]: any }) => {
    existingLogs.push({ time: +new Date(), message });
    // await ChromeStorage.setPair("logs", existingLogs); //let's just let this be for now
}