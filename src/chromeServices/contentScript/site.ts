import { sanitize } from "../../utils/strings";
import { ISiteConfig, scrapeMethod } from "../types";
import { siteConfigs } from "./siteConfig";
import { getURL } from "./urlMonitor";



/** Responsible for getting DOM elements/data and determining it if should do the aforementioned tasks */
export class Site {

    #siteConfig: ISiteConfig;

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
    // getTextboxText = () => {
    //     return this.getTextbox()?.textContent ?? "";
    // }
    toString = () => {
        return this.#siteConfig.urlChecks.host;
    }
    getTranslationSnapshot = () => {
        const inputText = Site.scrapeText(this.#siteConfig.input.text);
        const inputLang = Site.scrapeText(this.#siteConfig.input.lang);
        const outputLang = Site.scrapeText(this.#siteConfig.output.lang);
        const outputText = Site.scrapeText(this.#siteConfig.output.text);
        return { inputText, inputLang, outputText, outputLang };
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
