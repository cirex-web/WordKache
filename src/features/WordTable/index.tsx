import Fuse from "fuse.js";
import React, { useState } from "react";
import { Card } from "../../storageTypes";
import { Text } from "../../components/Text";
import { UseFolderContext } from "../App";
import { TableHeader } from "./TableHeader";
import { WordPanel } from "./WordPanel";
import css from "./index.module.css";

const WordTable = ({
  cards,
  moveCards: moveCard,
  deleteCards: deleteCard,
}: {
  cards: Card[];
  moveCards: (cardIds: string[], folderId?: string) => void;
  deleteCards: (cardIds: string[]) => void;
}) => {
  const { activeFolder } = UseFolderContext();
  const [activeCards, setActiveCards] = useState<Card[]>([]);

  //Search
  const fuse = new Fuse(cards, {
    keys: ["front.text", "back.text"],
  });

  const [searchInput, setInput] = useState("");

  const searchResults = !searchInput.length
    ? cards
    : fuse
        .search(searchInput)
        .map((result) => result.item)
        .reverse();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    card: Card
  ) => {
    if (event.shiftKey) {
      setActiveCards([...activeCards, card]);
    } else {
      setActiveCards([card]);
    }
  };

  return (
    <div className={css.container}>
      <TableHeader
        folderName={activeFolder.name}
        setSearchInput={setInput}
        cards={cards}
      />
      <div className={css.tableContainer}>
        {searchResults.length ? (
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
              {searchResults
                .map((card) => (
                  <tr
                    key={card.id}
                    onMouseDown={(e) => handleMouseDown(e, card)}
                    className={activeCards.includes(card) ? css.selected : ""}
                  >
                    <td>
                      <Text type="paragraph" noWrap>
                        {card.front.text}
                      </Text>
                    </td>
                    <td>
                      <Text type="paragraph" noWrap>
                        {card.back.text}
                      </Text>
                    </td>
                  </tr>
                ))
                .reverse()}
            </tbody>
          </table>
        ) : (
          <div className={css.emptyState}>
            <Text type="subheading">
              {" "}
              Sorry, it seems you don't have any words{" "}
            </Text>
          </div>
        )}
      </div>

      {activeCards.length && (
        <WordPanel
          cardInfo={activeCards[activeCards.length - 1]}
          saveCard={() => moveCard(activeCards.map((card) => card.id))}
          deleteCard={() => deleteCard(activeCards.map((card) => card.id))}
        />
      )}
    </div>
  );
};

export default WordTable;
