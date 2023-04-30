import React, { useState } from "react";
import { Card } from "../../storageTypes";
import {} from "../../utils/strings";
import css from "./index.module.css";
import { Text } from "../../components/Text";
import { UseFolderContext } from "../App";
import { TableHeader } from "./TableHeader";
import { WordPanel } from "./WordPanel";

const WordTable = ({
  cards,
  moveCard,
}: {
  cards: Card[];
  moveCard: (cardId: string, folderId?: string) => void;
}) => {
  const { activeFolder } = UseFolderContext();
  const [activeCard, setActiveCard] = useState<Card>();

  return (
    <div className={css.container}>
      <TableHeader folderName={activeFolder.name} />
      <div className={css.table}>
        <table>
          <tbody>
            {cards
              .filter((card) => card.location === activeFolder.id)
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
