import { LOGGER } from "../logger";
import { Site, translatorSites } from "./site";
import { processCurrentSnapshot } from "./snapshotProcessing";
import { onLocationChange, getURL } from "./urlMonitor";

LOGGER.INFO("Kache Content script running!");
let existingMatchedSite: Site | null = null;


const getMatchingTranslatorConfig = (): Site | null => {
    const url = getURL();
    for (const site of translatorSites) {
        if (site.matchURL(new URL(url))) return site;
    }
    return null;
}


const keyPressEventHandler = (event: Event) => {

    if (existingMatchedSite === null) {
        console.warn("Keypress event handler not disposed of properly - siteConfigId is undefined");
        return;
    }

    processCurrentSnapshot({ ...existingMatchedSite.getTranslationSnapshot(), newInputText: (event.target as HTMLInputElement).value }); //snapshot right before UI components (like the textbox) change
}

onLocationChange(() => {

    const matchedSite = getMatchingTranslatorConfig();
    if (matchedSite !== existingMatchedSite) {
        if (existingMatchedSite !== null) {
            //remove existing event listeners if possible
            existingMatchedSite.getTextbox().removeEventListener('input', keyPressEventHandler);
        }
        if (matchedSite !== null) {
            console.log(`Listening for activity in text box on site ${matchedSite}`)
            matchedSite.getTextbox().addEventListener('input', keyPressEventHandler);
        } else {
            LOGGER.INFO("No site configurations found")
        }
        existingMatchedSite = matchedSite;
    }
});
