export const ChromeStorage = {
    "get": (key: string) => {
        return new Promise(async (re) => {
            const obj = await chrome.storage.local.get(key);
            re(obj[key]);
        });
    },
    "set": (items: {
        [key: string]: any;
    }) => chrome.storage.local.set(items),
    "setPair": (key: string, value: any) => ChromeStorage.set({ [key]: value })
};