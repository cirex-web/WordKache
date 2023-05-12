import React from "react";
import { act } from "react-dom/test-utils";

const getRangeEndpoint = (startIndex: number, direction: number, selectionIds: string[], activeSelectionIds: string[]) => {
    if (direction === 0) return startIndex;
    let returnI = -1;
    for (let i = startIndex; i < selectionIds.length && i >= 0; i += direction) {
      if (activeSelectionIds.includes(selectionIds[i])) {
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
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent> | React.MouseEvent<HTMLSpanElement, MouseEvent>,
    selectionId: string,
    selectionIds: string[],
    activeSelectionIds: string[],
    pivotIndexRef: React.MutableRefObject<number>
  ) => {

    if (event.shiftKey) {
      //const cardIds = filteredCards.map((card) => card.id);
      const targetIndex = selectionIds.indexOf(selectionId);

      const leftIndex = getRangeEndpoint(pivotIndexRef.current, 1, selectionIds, activeSelectionIds);
      const rightIndex = getRangeEndpoint(pivotIndexRef.current, -1, selectionIds, activeSelectionIds); //not really left or right, but bear with me (non-inclusive filled segment)

      return (
        selectionIds.filter(
          (selectionId, i) =>
            (activeSelectionIds.includes(selectionId) &&
              !inRange(i, rightIndex, leftIndex)) ||
            inRange(i, pivotIndexRef.current, targetIndex)
        )
      );
    } else {
      const activeSelectionIdsCopy =
        event.ctrlKey || event.metaKey ? [...activeSelectionIds] : [];
      pivotIndexRef.current = selectionIds.indexOf(selectionId);
      
        if (activeSelectionIdsCopy.includes(selectionId)) {
        return(
            activeSelectionIdsCopy.filter((activeSelectionId) => activeSelectionId !== selectionId)
        );
      } else {
        return([...activeSelectionIdsCopy, selectionId]);
      }
    }
  };