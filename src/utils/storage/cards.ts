import { nanoid } from "nanoid";
import { Card } from "../../types/storageTypes";
import { ChromeStorage, useStorage } from "./storage";

const emptyArray: any[] = [];
export const useCards = () => {
    const cards = useStorage<Card[]>("cards", emptyArray);
    const updateStorage = (newCards: Card[]) => {
        ChromeStorage.setPair("cards", newCards);
    }
    /**
     * 
     * @param cardIds 
     * @param folderIds You should not be passing in the active folder to this. If you do, it's going to clone all the cards lol
     * @returns 
     */
    const moveCards = (cardIds: string[], folderIds: string[]) => {
        if (!cards) return;
        const newCards: Card[] = [];
        for (const card of cards) {
            if (cardIds.includes(card.id)) {
                for (const folderId of folderIds) {
                    newCards.push({ ...card, timeCreated: +new Date(), id: nanoid(), location: folderId }); //copy card
                }
            } else newCards.push(card);
        }
        updateStorage(newCards);
    };
    const deleteCards = (cardIds: string[]) => {
        if (!cards) return;
        const cardsClone = [...cards];
        for (const card of cards) {
            if (cardIds.includes(card.id)) card.deleted = true; //fake deletion
        }
        updateStorage(cardsClone);

    };
    return { cards, moveCards, deleteCards };
}