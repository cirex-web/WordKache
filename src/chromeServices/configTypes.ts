export type scrapeMethod = {
    type: "URL_REGEX",
    regex: string //returned string is the first capture group
} | {
    type: "URL_PARAM",
    param: string
} | {
    type: "DOM",
    js: (body: HTMLElement) => string //function that takes in DOM element and returns desired string
};

export type getTextBox = (body: HTMLElement) => HTMLElement | null
export interface SiteConfig {
    urlChecks: {
        host: string,
        subpage?: string,
        urlParams?: { [key: string]: (string | number) }
    }
    input: {
        getTextBox: getTextBox,
        text?: scrapeMethod,
        lang: scrapeMethod
    },
    output: {
        lang: scrapeMethod,
        text: scrapeMethod
    }
};
export interface TranslationSnapshot {
    inputText: string;
    inputLang: string;
    outputText: string;
    outputLang: string;
}