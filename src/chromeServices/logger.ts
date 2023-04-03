
export const sendLog = async (message: string | { [key: string | number]: any }) => {
    const existingLogs: any[] = JSON.parse((await chrome.storage.local.get("logs"))["logs"]) || [];
    await chrome.storage.local.set({ logs: JSON.stringify([...existingLogs, { time: +new Date(), message }]) });
}