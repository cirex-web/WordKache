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
export interface ISiteConfig {
    urlChecks: {
        host: string,
        subpage?: string,
        urlParams?: { [key: string]: (string | number) }
    }
    input: {
        getTextBox: getTextBox,
        text: scrapeMethod,
        lang: scrapeMethod
    },
    output: {
        lang: scrapeMethod,
        text: scrapeMethod
    }
};

export interface ITranslationSnapshot {
    inputText: string;
    inputLang: string;
    outputText: string;
    outputLang: string;
    newInputText: string; //what the input will be right after the snapshot
}
export interface IExtendedTranslationSnapshot extends ITranslationSnapshot {
    inputTime: number
}
/** M stands for message passing */
export interface MTranslationSnapshot extends IExtendedTranslationSnapshot { }

/** For background script request capturing */
export interface IRequestParserConfig {
    match: (url: URL) => boolean;
    parseBody: (body: any) => any;
};

type Lang = 'en' | 'es' | string;
export interface Card {
    front: {
        text: string,
        lang: Lang
    },
    back: {
        text: string,
        lang: Lang
    }
}