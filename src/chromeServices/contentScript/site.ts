import { ISiteConfig, ITranslationSnapshot, scrapeMethod } from "../types";
import { siteConfigs } from "./siteConfig";
import { getURL } from "./urlMonitor";



/** Responsible for getting DOM elements/data */
export class Site {

    #siteConfig: ISiteConfig;
    #previousInput: string = "";
    #inputTime: number = +new Date();
    constructor(configData: ISiteConfig) {
        this.#siteConfig = configData;
    }
    static scrapeText = (method: scrapeMethod): string => {
        switch (method.type) {
            case "DOM":
                return method.js(document.body);
            case "URL_PARAM":
                return getURL().searchParams.get(method.param) ?? "";
            case "URL_REGEX":
                const regex = RegExp(method.regex);
                const matches = regex.exec(decodeURI(getURL().toString()));
                return matches?.[1] ?? "";
        }
    }

    getTextbox = () => {
        const textBox = this.#siteConfig.input.getTextBox(document.body);
        if (textBox === null) throw new Error(`Textbox for site config of URL ${this} does not exist. Please fix ASAP`);
        return textBox;
    }
    toString = () => {
        return this.#siteConfig.urlChecks.host;
    }
    getTranslationSnapshot = (newInputText: string | null): ITranslationSnapshot => {
        //when newInputText is null it means that it didn't change
        const inputText = this.#siteConfig.input.text ? Site.scrapeText(this.#siteConfig.input.text) : this.#previousInput;
        //if not possible to get inputText (before change), just use previousInput, which is slightly less reliable        

        const inputLang = Site.scrapeText(this.#siteConfig.input.lang);
        const outputLang = Site.scrapeText(this.#siteConfig.output.lang);
        const outputText = Site.scrapeText(this.#siteConfig.output.text);
        const snapshot: ITranslationSnapshot = {
            inputText,
            inputLang,
            outputText,
            outputLang,
            validated: this.#siteConfig.validate?.call(this),
            newInputText: newInputText ?? this.#previousInput, //null check for newInputText
            inputTime: this.#inputTime,
            source: this.#siteConfig.name
        };
        if (newInputText !== null) { //an actual update (not some courtesy ping)
            this.#inputTime = + new Date(); //it's for the next input
            this.#previousInput = newInputText;
        }
        return snapshot;
    }

    matchURL = (url: URL) => {
        const checks = this.#siteConfig.urlChecks;
        if (checks.host !== url.hostname) return false;
        for (const [key, value] of Object.entries(checks.urlParams ?? {})) {
            if (url.searchParams.get(key) !== value) {
                return false;
            };
        }
        if (checks.subpage && checks.subpage !== url.pathname) return false;
        return true;
    }


}


export const translatorSites = siteConfigs.map(config => new Site(config));
