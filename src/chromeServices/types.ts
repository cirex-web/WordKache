
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
        /** You can leave this one blank if there's no way to get the text before it changes */
        text?: scrapeMethod,
        lang: scrapeMethod
    },
    output: {
        lang: scrapeMethod,
        text: scrapeMethod
    },
    /** Identifying name */
    name: string;
    /** Optional frontend validation to make sure that output accurately reflects input (will override backend validation) */
    validate?: () => boolean
};

export interface ITranslationSnapshot {
    inputText: string;
    inputLang: string;
    outputText: string;
    outputLang: string;
    newInputText: string; //what the input will be right after the snapshot
    /** If output has been validated on the frontend */
    validated?: boolean;
    inputTime: number;
    source: string;
    hidden: boolean;
}

/** For background script request capturing */
export interface IRequestParserConfig {
    match: (url: URL) => boolean;
    parseBody: (body: any) => any;
};

