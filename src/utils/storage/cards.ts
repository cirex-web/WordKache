import { nanoid } from "nanoid";
import { Card } from "../../types/storageTypes";
import { useStorage } from "./storage";

const emptyArray: any[] = [];
export const useCards = () => {
    const [cards, updateCards] = useStorage<Card[]>("cards", emptyArray);
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
        updateCards(newCards);
    };
    const deleteCards = (cardIds: string[]) => {
        if (!cards) return;
        const cardsClone = [...cards];
        for (const card of cards) {
            if (cardIds.includes(card.id)) card.deleted = true; //fake deletion
        }
        updateCards(cardsClone);

    };
    return { cards, moveCards, deleteCards };
}