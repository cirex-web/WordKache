import { useEffect, useState } from "react";
import { Card, Folder } from "../storageTypes";
import { useWhatChanged } from "@simbathesailor/use-what-changed";

if (!chrome.storage) {
    let manualStorage: { "cards"?: Card[], "folders"?: Folder[] } = {
        "cards": [
            {
                "back": {
                    "lang": "es",
                    "text": "ah si"
                },
                "front": {
                    "lang": "en",
                    "text": "ahh yes"
                },
                "id": "LjX2SZb8eJ-JP7x7Vg_A3",
                location: "root"
            },
            {
                "back": {
                    "lang": "es",
                    "text": "¿eh?"
                },
                "front": {
                    "lang": "en",
                    "text": "huh?"
                },
                "id": "LvV7dajPnEkoE8q1MW8Zv",
                location: "root"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "espera, ¿por qué esto es tan lento?"
                },
                "front": {
                    "lang": "en",
                    "text": "wait why is this so darn slow um stop"
                },
                "id": "QtQXtFK1TiBWNf_bgnArF"
                , location: "root"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "ok entonces tiempo de error tipográfico"
                },
                "front": {
                    "lang": "en",
                    "text": "ok so typo time"
                },
                "id": "mlfgk-Hc1rj9cHkLlFQNm",
                location: "root"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "bien 2"
                },
                "front": {
                    "lang": "en",
                    "text": "alright 2"
                },
                "id": "n5iIVFz0pnHQKx4ZBGGVE",
                location: "root"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "OK entonces"
                },
                "front": {
                    "lang": "en",
                    "text": "ok so"
                },
                "id": "8dbC-JgLW7YqvLNMYMLeV",
                location: "root"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "esto parece que está funcionando"
                },
                "front": {
                    "lang": "en",
                    "text": "this does seem like it's working"
                },
                "id": "iZOo0n5F_-fB7SQV0Gr9x",
                location: "root"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "¡excelente!"
                },
                "front": {
                    "lang": "en",
                    "text": "great!"
                },
                "id": "vWnGNcwGGpeYNJii_STJZ",
                location: "2"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "Vaya...."
                },
                "front": {
                    "lang": "en",
                    "text": "oh...."
                },
                "id": "lhnvez_VR0IMFGALE_LAE",
                location: "2"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "sí"
                },
                "front": {
                    "lang": "en",
                    "text": "yup"
                },
                "id": "tcsMWTHR-Vd8FpDYvLn06",
                location: "1"

            },
            {
                "back": {
                    "lang": "es",
                    "text": "error tipográfico"
                },
                "front": {
                    "lang": "en",
                    "text": "typo yup"
                },
                "id": "LISNoNwKEV98eAYizNUPf",
                location: "1"

            }
        ],
        "folders": [
            {
                id: "1",
                name: "Saved",
            }
        ]
    };
    type EventListener = (changes: {
        [key: string]: chrome.storage.StorageChange;
    }) => void;
    let eventListeners: EventListener[] = [];

    const isValidKey = (key: string): key is keyof typeof manualStorage => {
        const valid = key === "cards" || key === "folders";
        if (!valid) console.warn("Attempted to get data with invalid key", key);
        return valid;
    }

    chrome.storage = {} as any;
    chrome.storage.local = {} as any;
    chrome.storage.local.get = (keys?: string | string[] | { [key: string]: any; } | null | undefined): Promise<{ [key: string]: any; }> => {
        return new Promise<any>((re) => {
            if (!keys) re({});
            if (typeof keys === "string" && isValidKey(keys)) {
                re({ [keys]: manualStorage[keys] });
            }
            if (Array.isArray(keys)) {
                let returnObj: { [key: string]: any; } = {};
                for (const key of keys) {
                    if (isValidKey(key))
                        returnObj[key] = manualStorage[key];
                }
                re({ returnObj });
            }
        });
    };

    chrome.storage.local.set = (items: {
        [key: string]: any;
    }): Promise<void> => {
        return new Promise<void>((re) => {
            for (const [key, val] of Object.entries(items)) {
                if (isValidKey(key)) manualStorage[key] = val;
            }
            re();
        })
    }
    chrome.storage.local.clear = (): Promise<void> => {
        return new Promise(re => {
            manualStorage = {};

            re();
        });
    }

    chrome.storage.local.onChanged = {
        addListener: (listener: EventListener): void => {
            eventListeners.push(listener);
        },
        removeListener: (listenerToRemove: EventListener): void => {
            eventListeners = eventListeners.filter(listener => listener !== listenerToRemove);
        }
    } as any;


}

export const useStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>();

    useEffect(() => {
        ChromeStorage.get(key).then((val) => setValue((val ?? defaultValue) as T));
        const updateValue = (changes: {
            [key: string]: chrome.storage.StorageChange;
        }) => {
            if (key in changes) {
                setValue(changes[key].newValue ?? defaultValue);
            }
        };
        chrome.storage.local.onChanged.addListener(updateValue);
        return () => chrome.storage.local.onChanged.removeListener(updateValue);
    }, [key, defaultValue]);
    return value;
}
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