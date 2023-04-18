import { logger } from "../logger";
import { Site, translatorSites } from "./site";
import { processCurrentSnapshot } from "./snapshotProcessing";
import { onLocationChange, getURL } from "./urlMonitor";

let existingMatchedSite: Site | null = null;
let selectedText = {} //disclaimer: when text is deselected this isn't updated, so we do need a sanity check somewhere else

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
    const target = event.target as HTMLInputElement;
    processCurrentSnapshot({ ...existingMatchedSite.getTranslationSnapshot(), newInputText: target.value }); //snapshot right before UI components (like the textbox) change
}
const selectEventHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log(target.selectionStart, target.selectionEnd);

}
onLocationChange(() => {

    const matchedSite = getMatchingTranslatorConfig();
    if (matchedSite !== existingMatchedSite) {
        if (existingMatchedSite !== null) {
            //remove existing event listeners if possible
            existingMatchedSite.getTextbox().removeEventListener('input', keyPressEventHandler);
            existingMatchedSite.getTextbox().removeEventListener('keydown', selectEventHandler);

        }
        if (matchedSite !== null) {
            logger.info(`Listening for activity in text box on site ${matchedSite}`)
            matchedSite.getTextbox().addEventListener('input', keyPressEventHandler);
            matchedSite.getTextbox().addEventListener('keydown', selectEventHandler);

        } else {
            logger.info("No site configurations found")
        }
        existingMatchedSite = matchedSite;
    }
});
