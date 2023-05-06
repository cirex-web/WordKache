import Fuse from "fuse.js";
import React, { useState } from "react";
import { Card } from "../../storageTypes";
import { Text } from "../../components/Text";
import { UseFolderContext } from "../App";
import { TableHeader } from "./TableHeader";
import { WordPanel } from "./WordPanel";
import css from "./index.module.css";
import searchEmpty from "../../assets/searchEmpty.svg";
import folderEmpty from "../../assets/folderEmpty.svg";
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

  const filteredCards = !searchInput.length
    ? cards
    : fuse.search(searchInput).map((result) => result.item);

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
