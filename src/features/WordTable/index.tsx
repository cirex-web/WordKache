import Fuse from "fuse.js";
import React, { useEffect, useState } from "react";
import { Card } from "../../types/storageTypes";
import { Text } from "../../components/Text";
import { TableHeader } from "./TableHeader";
import { WordPanel } from "./WordPanel";
import css from "./index.module.css";
import searchEmpty from "../../assets/searchEmpty.svg";
import folderEmpty from "../../assets/folderEmpty.svg";
import { Icon } from "../../components/Icon";
import classNames from "classnames";
import { handleRowSelect } from "../../utils/rangeSelect";
import { copyFlashcards } from "../../utils/file";
import { useFolderContext } from "../../contexts/FolderProvider";
import { useFolderNavContext } from "../../contexts/FolderNavProvider";

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
    <div className={classNames(css.placeholder, className)}>
      <img src={image} alt="" height={100} />
      <Text type="heading">{text}</Text>
    </div>
  );
};

const WordTable = ({
  cards,
  moveCards,
  deleteCards,
  flipCards,
}: {
  moveCards: (cardIds: string[], folderIds: string[]) => void;
  deleteCards: (cardIds: string[]) => void;
  flipCards: (cardIds: string[]) => void;
  cards: Card[];
}) => {
  const sortOrder: string[] = ["recent", "lexo", "rLexo"];

  const [filterFront, setFrontFilter] = useState<string[]>([]);
  const [filterBack, setBackFilter] = useState<string[]>([]);
  const [sortFront, setSortFront] = useState("recent");
  const [sortBack, setSortBack] = useState("recent");
  const [sort, setSort] = useState("null");
  const { folders } = useFolderContext();
  const { activeFolderId, selectedFolderIds } = useFolderNavContext();

  const [activeCardIds, setActiveCardsIds] = useState<string[]>([]);
  const [searchInput, setInput] = useState("");
  const pivotIndexRef = React.useRef(0);

  const cardsUnderCurrentFolder = cards
    ?.filter(
      (card) =>
        card.location === activeFolderId && !card.hidden && !card.deleted //top-level filtering
    )
    .sort((a, b) => b.timeCreated - a.timeCreated); //TODO: should this really be here
  //Search
  const fuse = new Fuse(cardsUnderCurrentFolder, {
    keys: ["front.text", "back.text"],
  });

  let filteredCards = !searchInput.length
    ? [...cardsUnderCurrentFolder].reverse() //don't mutate the original array or bad things will happen...
    : fuse.search(searchInput).map((result) => result.item);

  const activeCards = filteredCards.filter((card) =>
    activeCardIds.includes(card.id)
  );

  const handleFilters = (newFilter: string, type: string) => {
    switch (type) {
      case "frontAdd":
        setFrontFilter([...filterFront, newFilter]);
        break;
      case "frontDelete":
        setFrontFilter(filterFront.filter((f) => f !== newFilter));
        break;
      case "backAdd":
        setBackFilter([...filterBack, newFilter]);
        break;
      case "backDelete":
        setBackFilter(filterBack.filter((f) => f !== newFilter));
        break;
      default:
        console.log("Error: Invalid filter type");
        break;
    }
  };

  const frontSort = (main: boolean = true) => {
    if (sortFront === "recent") {
    } else {
      filteredCards.sort((a, b) =>
        main || a.back.text === b.back.text
          ? a.front.text.localeCompare(b.front.text)
          : 0
      );
      if (sortFront === "rLexo") filteredCards.reverse();
    }
    if (main) backSort(false);
  };

  const backSort = (main: boolean = true) => {
    if (sortBack === "recent") {
    } else {
      filteredCards.sort((a, b) =>
        main || a.front.text === b.front.text
          ? a.back.text.localeCompare(b.back.text)
          : 0
      );
      if (sortBack === "rLexo") filteredCards.reverse();
    }
    if (main) frontSort(false);
  };

  if (sort === "front") frontSort();
  else backSort();

  filteredCards = filteredCards.filter(
    (card) =>
      (!filterFront.length || filterFront.includes(card.front.lang)) &&
      (!filterBack.length || filterBack.includes(card.back.lang))
  );

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

  const handleKeyboardShortcuts = (
    event: React.KeyboardEvent<HTMLTableElement>
  ) => {
    if (event.key === "Escape") {
      setActiveCardsIds([]);
      event.preventDefault();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "a") {
      setActiveCardsIds(filteredCards.map((card) => card.id));
      event.preventDefault();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "c")
      copyFlashcards(activeCards);
  };
  return (
    <div className={css.container}>
      <TableHeader
        folderName={
          folders.find((folder) => folder.id === activeFolderId)?.name ??
          "Error"
        }
        setSearchInput={setInput}
        handleFilters={handleFilters}
        cards={cardsUnderCurrentFolder}
        filteredCards={filteredCards}
      />
      {filteredCards.length ? (
        <div style={{ flexGrow: 1 }}>
          <table onKeyDown={handleKeyboardShortcuts}>
            <thead style={{ top: "46.5px" }}>
              {/* TODO: Seriously hacky fix cuz I'm sleep deprived */}
              <tr>
                <th
                  className={css.headerContainer}
                  onClick={() => {
                    setSortFront(
                      sortOrder[
                        (sortOrder.indexOf(sortFront) + 1) % sortOrder.length
                      ]
                    );
                    setSort("front");
                  }}
                >
                  <Text type="subheading">Original</Text>
                  <span
                    className={css.sort}
                    style={{
                      color:
                        sort === "front" ? "var(--accent-1)" : "var(--light-1)",
                    }}
                  >
                    <Icon
                      name="expand_less"
                      style={{
                        opacity: !(sortOrder.indexOf(sortFront) % 2) ? 1 : 0,
                      }}
                    />
                    <Icon
                      name="expand_more"
                      style={{
                        opacity: sortOrder.indexOf(sortFront) <= 1 ? 1 : 0,
                      }}
                    />
                  </span>
                </th>
                <th
                  className={css.headerContainer}
                  onClick={() => {
                    setSortBack(
                      sortOrder[
                        (sortOrder.indexOf(sortBack) + 1) % sortOrder.length
                      ]
                    );
                    setSort("back");
                  }}
                >
                  <Text type="subheading">Translation</Text>
                  <span
                    className={css.sort}
                    style={{
                      color:
                        sort === "back" ? "var(--accent-1)" : "var(--light-1)",
                    }}
                  >
                    <Icon
                      name="expand_less"
                      style={{
                        opacity: !(sortOrder.indexOf(sortBack) % 2) ? 1 : 0,
                      }}
                    />
                    <Icon
                      name="expand_more"
                      style={{
                        opacity: sortOrder.indexOf(sortBack) <= 1 ? 1 : 0,
                      }}
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr
                  key={card.id}
                  onMouseDown={(ev) =>
                    setActiveCardsIds(
                      handleRowSelect(
                        ev,
                        card.id,
                        filteredCards.map((card) => card.id),
                        activeCardIds,
                        pivotIndexRef
                      )
                    )
                  }
                  tabIndex={0}
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
      ) : cardsUnderCurrentFolder.length ? (
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
            moveCards(
              activeCardIds,
              selectedFolderIds.filter((id) => id !== activeFolderId)
            );
          }}
          deleteCard={() => {
            selectNewCard();
            deleteCards(activeCardIds);
          }}
          flipCards={() => {
            flipCards(activeCardIds);
          }}
        />
      )}
    </div>
  );
};

export default WordTable;
