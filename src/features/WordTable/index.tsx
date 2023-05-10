import Fuse from "fuse.js";
import React, { useEffect, useState } from "react";
import { Card } from "../../storageTypes";
import { Text } from "../../components/Text";
import { UseFolderContext } from "../App";
import { TableHeader } from "./TableHeader";
import { WordPanel } from "./WordPanel";
import css from "./index.module.css";
import searchEmpty from "../../assets/searchEmpty.svg";
import folderEmpty from "../../assets/folderEmpty.svg";
import classNames from "classnames";
import { act } from "react-dom/test-utils";
const Placeholder = ({
  image,
  text,
  className,
}: {
  image: string;
  text: string;
  className?: string;
}) => {
  return (
    <div className={css.placeholder + " " + className}>
      <img src={image} alt="" height={100} />
      <Text type="heading">{text}</Text>
    </div>
  );
};

const WordTable = ({
  cards,
  moveCards,
  deleteCards,
}: {
  cards: Card[];
  moveCards: (cardIds: string[], folderId?: string) => void;
  deleteCards: (cardIds: string[]) => void;
}) => {
  const { activeFolder } = UseFolderContext();
  const [activeCardIds, setActiveCardsIds] = useState<string[]>([]);
  const [searchInput, setInput] = useState("");
  let pivotIndexRef = React.useRef(0);
  let lastSelected = React.useRef("");

  //Search
  const fuse = new Fuse(cards, {
    keys: ["front.text", "back.text"],
  });

  const filteredCards = !searchInput.length
    ? [...cards].reverse() //don't mutate the original array or bad things will happen...
    : fuse.search(searchInput).map((result) => result.item);
  const activeCards = filteredCards.filter((card) =>
    activeCardIds.includes(card.id)
  );

  const updateContiguousSelection = (activeCardIds: string[], goingUp: boolean) => {
    const cardIds = filteredCards.map((card) => card.id);
    const lastSelectedInd = cardIds.indexOf(lastSelected.current);
    for (let i = lastSelectedInd; goingUp ? (i < cardIds.length) : i >= 0; i += goingUp ? 1:-1) {
      if (activeCardIds.includes(cardIds[i])) {
        lastSelected.current = cardIds[i];
        continue;
      }
      break;
    }
  }

  const handleRowSelect = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    cardId: string
  ) => {

    if (event.shiftKey) {
      const cardIds = filteredCards.map((card) => card.id);
      const cardInd = cardIds.indexOf(cardId);
      const lastSelectedInd = cardIds.indexOf(lastSelected.current);
      const activeCardIdsCopy = (cardIds.filter((cardId, i) =>
        (activeCardIds.includes(cardId)
        && ((i - pivotIndexRef.current) * (i - lastSelectedInd) > 0))
        || ((i - cardInd) * (i - pivotIndexRef.current)) <= 0));
      lastSelected.current = cardId;
      setActiveCardsIds(activeCardIdsCopy);
      updateContiguousSelection(activeCardIdsCopy, cardInd > pivotIndexRef.current);
    }
    else {
      const activeCardIdsCopy =
        event.ctrlKey ? [...activeCardIds] : [];

      if (activeCardIdsCopy.includes(cardId)) {
        setActiveCardsIds(
          activeCardIdsCopy.filter((activeCardId) => activeCardId !== cardId)
        );
      } else {
        setActiveCardsIds([...activeCardIdsCopy, cardId]);
      }
      lastSelected.current = cardId;
      pivotIndexRef.current = filteredCards.findIndex((card) => card.id==cardId);
    }
  };

  // Deselect any selected cards that go off into the abyss when a filter query is typed
  useEffect(() => {
    const newActiveCardsIds = activeCardIds.filter((cardId) =>
      filteredCards.some((card) => card.id === cardId)
    );
    if (newActiveCardsIds.length < activeCardIds.length)
      setActiveCardsIds(newActiveCardsIds); //we don't want an infinite loop - that's why this conditional check is here
  }, [filteredCards, activeCardIds]);

  /** Selects the next card in the table if only one card is currently selected */
  const selectNewCard = () => {
    const nextIndex =
      activeCardIds.length === 1
        ? filteredCards.findIndex((card) => card.id === activeCardIds[0]) + 1
        : filteredCards.length;

    if (nextIndex < filteredCards.length && nextIndex >= 0) {
      setActiveCardsIds([filteredCards[nextIndex].id]);
    } else {
      setActiveCardsIds([]);
    }
  };

  return (
    <div className={css.container}>
      <TableHeader
        folderName={activeFolder.name}
        setSearchInput={setInput}
        cards={cards}
      />
      {filteredCards.length ? (
        <div className={css.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>
                  <Text type="subheading">Original</Text>
                </th>
                <th>
                  <Text type="subheading">Translation</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr
                  key={card.id}
                  onMouseDown={(ev) => handleRowSelect(ev, card.id)}
                  className={classNames({
                    [css.selected]: activeCardIds.includes(card.id),
                  })}
                >
                  <td>
                    <Text
                      type="paragraph"
                      noWrap
                      dull={
                        activeCardIds.length > 0 &&
                        !activeCardIds.includes(card.id)
                      }
                    >
                      {card.front.text}
                    </Text>
                  </td>
                  <td>
                    <Text
                      type="paragraph"
                      noWrap
                      dull={
                        activeCardIds.length > 0 &&
                        !activeCardIds.includes(card.id)
                      }
                    >
                      {card.back.text}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : cards.length ? (
        <Placeholder image={searchEmpty} text="No cards match your search" />
      ) : (
        <Placeholder
          image={folderEmpty}
          text="This folder is currently empty"
        />
      )}
      {activeCards.length > 0 && (
        <WordPanel
          cards={activeCards}
          saveCard={() => {
            selectNewCard();
            moveCards(activeCardIds);
          }}
          deleteCard={() => {
            selectNewCard();
            deleteCards(activeCardIds);
          }}
        />
      )}
    </div>
  );
};

export default WordTable;
