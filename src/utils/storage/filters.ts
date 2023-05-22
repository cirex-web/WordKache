import { Filter } from "../../types/storageTypes"
import { ChromeStorage, useStorage } from "./storage"

const defaultArray: any[] = [];
export const useFilters = () => {
    const filters = useStorage<Filter[]>("filters", defaultArray);

    const deleteFilters = (filterIds: string[]) => {
        if (!filters) return;
        ChromeStorage.setPair(
            "filters",
            filters?.filter((filter) => !filterIds.includes(filter.id))
        );
    };

    const addFilter = (newFilter: Filter) => {
        const assertFilters = filters === undefined ? [] : filters;
        ChromeStorage.setPair("filters", [...assertFilters, newFilter]);
    };
    return { filters, deleteFilters, addFilter };
}

//TODO: disable filter
// TODO: Move to backend
// const filterCards = (folderCards: Card[], filters: Filter[]) => {
//     if (cards === undefined || !folderCards.length || !filters.length) return;

//     const fitSize = (filter: Filter, card: Card) => {
//       if (!filter.length) return false;
//       if (filter.length.direction === "greater") {
//         return (
//           Math.max(card.back.text.length, card.front.text.length) >
//           filter.length.number
//         );
//       } else {
//         return (
//           Math.min(card.back.text.length, card.front.text.length) <=
//           filter.length.number
//         );
//       }
//     };
// let moveCards = new Map<string, string>();
//     for (const filter of filters) {
//       for (const card of folderCards) {
//         if (
//           filter.frontLang === undefined ||
//           filter.frontLang!.includes(card.front.lang)
//         ) {
//           //extended and statements
//           if (
//             filter.backLang === undefined ||
//             filter.backLang!.includes(card.back.lang)
//           ) {
//             if (filter.words === undefined || hasWords(filter, card)) {
//               if (filter.length === undefined || fitSize(filter, card)) {
//                 moveCards.set(card.id, filter.destination);
//               }
//             }
//           }
//         }
//       }
//     }
//     for (const card of cards) {
//       if (moveCards.has(card.id)) card.location = moveCards.get(card.id)!; //pass by reference so no need to make new cards
//     }
//     ChromeStorage.setPair("cards", cards);
//   };

//   const hasWords = (filter: Filter, card: Card) =>
//     filter.words!.every(
//       (word) => card.back.text.includes(word) || card.front.text.includes(word)
//     ); //bad implementation because doesn't check for white space, please remake with regex
