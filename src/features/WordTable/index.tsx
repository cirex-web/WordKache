import React, { useEffect, useState } from "react";
import { WordList } from "../../types";
import { Card } from "../../chromeServices/types"; //TODO: this sucks
import { ChromeStorage } from "../../utils/storage"; //TODO: also this
import { similar } from "../../utils/strings";
import "./index.module.css"
const WordTable = ({ words }: { words: WordList }) => {
  const [cards, setCards] = useState<Card[]>([]); //TODO: oh gosh move this somewhere else maybe a context
  useEffect(() => {
    chrome.storage?.local.onChanged.addListener((changes) => {
      //TODO: perhaps some actually typed storage?
      if ("pending" in changes) {
        setCards(changes.pending.newValue as Card[]);
      }
    });
    ChromeStorage.get("pending").then((res) => setCards(res as Card[]));
  }, []);
  const filteredCards = [];
  let latestGoodText = "";
  for (let i = cards.length - 1; i >= 0; --i) {
    const good =
      i === cards.length - 1 || !similar(cards[i].front.text, latestGoodText);

    filteredCards.push({
      ...cards[i],
      good: good,
    });
    if (good) latestGoodText = cards[i].front.text;
  }
  console.log(filteredCards);

  return (
    <table>
      <colgroup>
        <col span={1} style={{ width: "50%" }}></col>
        <col span={1} style={{ width: "50%" }}></col>
      </colgroup>
      <tbody>
        {filteredCards.map(
          (wordEntry, i) =>
            wordEntry.good && (
              <tr key={i}>
                <td>{wordEntry.front.text}</td>
                <td>{wordEntry.back.text}</td>
              </tr>//words typed to saved words ratio
            )
        )}
      </tbody>
    </table>
  );
};

export default WordTable;
