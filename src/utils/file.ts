import { Card } from "../types/storageTypes";

export const downloadFile = (fileName: string, data: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
    a.download = fileName;
    a.click();
}
export const saveFlashcards = (folderName: string, cards: Card[]) => {
    downloadFile(folderName + ".tsv", makeTextString(cards));
}
export const copyFlashcards = (cards: Card[]) => {
    navigator.clipboard.writeText(makeTextString(cards));
}

const makeTextString = ((cards: Card[]) => cards.map(card => card.front.text + "\t" + card.back.text).join("\n"));