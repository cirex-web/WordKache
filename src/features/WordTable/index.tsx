import Fuse from "fuse.js";
import React, { useState } from "react";
import { Card } from "../../storageTypes";
import { Text } from "../../components/Text";
import { UseFolderContext } from "../App";
import { TableHeader } from "./TableHeader";
import { WordPanel } from "./WordPanel";
import css from "./index.module.css";
import { Input } from "../../components/Input";
import { Icon } from "../../components/Icon";
const WordTable = ({
  cards,
  moveCard,
}: {
  cards: Card[];
  moveCard: (cardId: string, folderId?: string) => void;
}) => {
  const { activeFolder } = UseFolderContext();
  const [activeCard, setActiveCard] = useState<Card>();

  //Toggle Search
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  //Search
  const fuse = new Fuse(cards, {
    keys: ["front.text", "back.text"],
  });

  const [searchInp, setInput] = useState("");

  const results = fuse.search(searchInp);

  const searchResults = !searchInp.length
    ? cards
    : results.map((result) => result.item);

  //Language

  return (
    <div className={css.container}>
      <TableHeader folderName={activeFolder.name} />
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
            {/* <Icon name="search" /> */}
          </thead>
          <tbody>
            {searchResults
              .filter((card) => card.location === activeFolder.id && card.view === true)
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
      </div>

      <Input
        placeholder="type a word"
        onChange={(event) => setInput(event.currentTarget.value)}
      />

      {activeCard && (
        <WordPanel
          cardInfo={activeCard}
          onSave={() => moveCard(activeCard.id)}
        />
      )}
    </div>
  );
};

export default WordTable;
