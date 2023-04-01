import { wait } from "../../utils";
import { SiteConfig, scrapeMethod, getTextBox, TranslationSnapshot } from "../configTypes";
import { siteConfigs } from "./siteConfig";
import { processCurrentSnapshot } from "./translationSnapshot";
import { addLocationChangeCallback, getURL } from "./urlMonitor";



console.log("Kache Content script running!");
let siteConfigId: undefined | number = undefined;


const _isValidTranslatorURL = (url: URL, translatorConfig: SiteConfig) => {
    const checks = translatorConfig.urlChecks;
    if (checks.host !== url.hostname) return false;
    for (const [key, value] of Object.entries(checks.urlParams ?? {})) {
        if (url.searchParams.get(key) !== value) {
            return false;
        };
    }
    if (checks.subpage && checks.subpage !== url.pathname) return false;
    return true;

}
const scrapeText = (method: scrapeMethod): string => {
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
const scrapeTextFromTextbox = (getTextbox: getTextBox) => {
    const textBox = getTextbox(document.body);
    return textBox?.textContent ?? "";
}
const getMatchingTranslatorConfig = (): number | undefined => {
    const url = getURL();
    for (let i = 0; i < siteConfigs.length; i++) {
        if (_isValidTranslatorURL(url, siteConfigs[i])) return i;
    }
    return undefined;
}

let previousTranslationValues: TranslationSnapshot = {
    inputText: "",
    inputLang: "",
    outputText: "",
    outputLang: ""
}
const getTranslationSnapshot = (siteConfigId: number): TranslationSnapshot => {
    console.assert(!document.hidden);
    const siteConfig = siteConfigs[siteConfigId];
    const inputText = siteConfig.input.text ? scrapeText(siteConfig.input.text) : scrapeTextFromTextbox(siteConfig.input.getTextBox);
    const inputLang = scrapeText(siteConfig.input.lang);
    const outputLang = scrapeText(siteConfig.output.lang);
    const outputText = scrapeText(siteConfig.output.text);
    return { inputText, inputLang, outputText, outputLang };

}

// const main = async () => {
//     while (chrome.runtime.id) {

//         const currentTranslationValues = obtainCurrentTranslation();
//         if (currentTranslationValues) {
//             if (JSON.stringify(currentTranslationValues) !== JSON.stringify(previousTranslationValues)) {
//                 previousTranslationValues = currentTranslationValues;
//                 processCurrentSnapshot(currentTranslationValues);
//                 // console.log(currentTranslationValues);
//                 // await chrome.runtime.sendMessage(currentTranslationValues);
//             }
//         }
//         await wait(100);
//     }
// }
const keyPressEventHandler = (key: string) => {
    if (typeof siteConfigId === "undefined") {
        console.warn("Keypress event handler not disposed of properly - siteConfigId is undefined");
        return;
    }
    processCurrentSnapshot(getTranslationSnapshot(siteConfigId)); //snapshot right before UI components change
}

addLocationChangeCallback(() => {

    const newSiteConfigId = getMatchingTranslatorConfig();
    if (siteConfigId !== newSiteConfigId) {
        siteConfigId = newSiteConfigId;
        if (typeof siteConfigId !== "undefined") {
            console.log(`Listening for activity in textbox on site ${siteConfigs[siteConfigId].urlChecks.host}`)
            siteConfigs[siteConfigId].input.getTextBox(document.body)?.addEventListener('keydown', (event) => keyPressEventHandler(event.key));
            siteConfigs[siteConfigId].input.getTextBox(document.body)?.addEventListener('click', () => keyPressEventHandler("click"));
        } else {
            console.log("No site configurations found")
        }
    }
});

// main().then(() => {
//     console.log("Kache stopped")
// });