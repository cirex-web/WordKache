import React from "react";

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

/** Checks if i is between start and end (inclusive), regardless if start is greater than or less than end */
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
    const targetIndex = selectionIds.indexOf(selectionId);

    //right is higher than left (inclusive filled segment)
    const leftIndex = getRangeEndpoint(pivotIndexRef.current, -1, selectionIds, activeSelectionIds);
    const rightIndex = getRangeEndpoint(pivotIndexRef.current, 1, selectionIds, activeSelectionIds);

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
      return (
        activeSelectionIdsCopy.filter((activeSelectionId) => activeSelectionId !== selectionId)
      );
    } else {
      return ([...activeSelectionIdsCopy, selectionId]);
    }
  }
};