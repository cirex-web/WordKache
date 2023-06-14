import { Filter } from "../../types/storageTypes";
import { logger } from "../logger";
import { ITranslationSnapshot } from "../types";

const matchSize = (lengthFilter: { direction: "greater" | "less", number: number } | undefined, frontLength: number, backLength: number) => {
    if (!lengthFilter) return true;
    if (lengthFilter.direction === "greater") {
        return (
            Math.max(frontLength, backLength) >
            lengthFilter.number
        );
    } else {
        return (
            Math.min(frontLength, backLength) <=
            lengthFilter.number
        );
    }
};

const matchWords = (words: string[] | undefined, text: string) => {
    if (words === undefined)
        return true;
    return words.some((word) => text.includes(word));
};

const matchLang = (langs: string[] | undefined, cardLang: string) => (langs === undefined || langs.includes(cardLang))


export const getDestinationFolders = (snapshot: ITranslationSnapshot, filters: Filter[]) => {
    if (!filters.length) return ["root"];


    let destinations: string[] = [];

    filters.forEach((filter) => {
        if (matchLang(filter.frontLang, snapshot.inputLang) && matchLang(filter.backLang, snapshot.outputLang) &&
            matchWords(filter.words, snapshot.inputText) && matchSize(filter.length, snapshot.inputText.length, snapshot.outputText.length))
            destinations.push(filter.destination)
    });
    logger.info(filters, destinations);
    return destinations.length ? destinations : ["root"];

}
