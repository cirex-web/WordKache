import React, { useEffect, useState } from "react";
import { WordList } from "../../types";
import { Card } from "../../chromeServices/types"; //TODO: this sucks
import { ChromeStorage } from "../../chromeServices/storage"; //TODO: also this
import { similar } from "../../utils/stringMatching";

const WordTable = ({ words }: { words: WordList }) => {
  const [cards, setCards] = useState<Card[]>([]); //TODO: oh gosh move this somewhere else maybe a context
  useEffect(() => {
    chrome.storage.local.onChanged.addListener((changes) => {
      if ("pending" in changes) {
        setCards(changes.pending.newValue as Card[]);
      }
    });
    ChromeStorage.get("pending").then((res) => setCards(res as Card[]));
  }, []);
  const filteredCards = [];

  for (let i = 0; i < cards.length - 1; i++) {
    filteredCards.push({
      ...cards[i],
      good: !similar(cards[i].front.text, cards[i + 1].front.text),
    });
  }

  return (
    <table>
      <colgroup>
        <col span={1} style={{ width: "50%" }}></col>
        <col span={1} style={{ width: "50%" }}></col>
      </colgroup>
      <tbody>
        {filteredCards.map((wordEntry, i) => (
          <tr
            key={i}
            style={{ backgroundColor: wordEntry.good ? "green" : "red" }}
          >
            <td>{wordEntry.front.text}</td>
            <td>{wordEntry.back.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WordTable;
