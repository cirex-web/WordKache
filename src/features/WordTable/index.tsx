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
  moveCard,
  deleteCard,
}: {
  cards: Card[];
  moveCard: (cardId: string, folderId?: string) => void;
  deleteCard: (cardId: string) => void;
}) => {
  const { activeFolder } = UseFolderContext();
  const [activeCard, setActiveCard] = useState<Card>();

  //Search
  const fuse = new Fuse(cards, {
    keys: ["front.text", "back.text"],
  });

  const [searchInput, setInput] = useState("");

  const searchResults = !searchInput.length
    ? cards
    : fuse.search(searchInput).map((result) => result.item).reverse();
  
 
  return (
    <div className={css.container}>
      <TableHeader
        folderName={activeFolder.name}
        setSearchInput={setInput}
        cards={cards}
      />
      <div className={css.tableContainer}>
          {
            searchResults.length ?(
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
                  onMouseDown={() => setActiveCard(card)}
                  className={card.id === activeCard?.id ? css.selected : ""}
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
        ):
          <div className = {css.emptyState}><Text type="subheading" > Sorry, it seems you don't have any words </Text></div>}
      </div>
      {activeCard && (
        <WordPanel
          cardInfo={activeCard}
          saveCard={() => moveCard(activeCard.id)}
          deleteCard={() => deleteCard(activeCard.id)}
        />
      )}
    </div>
  );
};

export default WordTable;
