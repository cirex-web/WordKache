import React from "react";
import { act } from "react-dom/test-utils";

const getRangeEndpoint = (startIndex: number, direction: number, cardIds: string[], activeCardIds: string[]) => {
    if (direction === 0) return startIndex;
    let returnI = -1;
    for (let i = startIndex; i < cardIds.length && i >= 0; i += direction) {
      if (activeCardIds.includes(cardIds[i])) {
        returnI = i;
      } else {
        break;
      }
    }
    return returnI;
  };
  
  const inRange = (i: number, start: number, end: number) =>
    Math.sign(i - start) * Math.sign(i - end) <= 0;
  
export const handleRowSelect = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    cardId: string,
    cardIds: string[],
    activeCardIds: string[],
    pivotIndexRef: React.MutableRefObject<number>
  ) => {

    if (event.shiftKey) {
      //const cardIds = filteredCards.map((card) => card.id);
      const targetIndex = cardIds.indexOf(cardId);

      const leftIndex = getRangeEndpoint(pivotIndexRef.current, 1, cardIds, activeCardIds);
      const rightIndex = getRangeEndpoint(pivotIndexRef.current, -1, cardIds, activeCardIds); //not really left or right, but bear with me (non-inclusive filled segment)

      return (
        cardIds.filter(
          (cardId, i) =>
            (activeCardIds.includes(cardId) &&
              !inRange(i, rightIndex, leftIndex)) ||
            inRange(i, pivotIndexRef.current, targetIndex)
        )
      );
    } else {
      const activeCardIdsCopy =
        event.ctrlKey || event.metaKey ? [...activeCardIds] : [];
      pivotIndexRef.current = cardIds.indexOf(cardId);
      
        if (activeCardIdsCopy.includes(cardId)) {
        return(
          activeCardIdsCopy.filter((activeCardId) => activeCardId !== cardId)
        );
      } else {
        return([...activeCardIdsCopy, cardId]);
      }
    }
  };