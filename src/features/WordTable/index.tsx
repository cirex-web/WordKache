import React, { useEffect, useState } from "react";
import { Card } from "../../types";
import { similar } from "../../utils/strings";
import "./index.module.css";
import { Text } from "../../components/Text";
const WordTable = ({ cards }: { cards: Card[] }) => {
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
      <tbody>
        {filteredCards.map(
          (wordEntry, i) =>
            wordEntry.good && (
              <tr key={i}>
                <td>
                  <Text type="paragraph" noWrap>
                    {wordEntry.front.text}
                  </Text>
                </td>
                <td>
                  <Text type="paragraph" noWrap>
                    {wordEntry.back.text}
                  </Text>
                </td>
              </tr> //TODO: words typed to saved words ratio
            )
        )}
      </tbody>
    </table>
  );
};

export default WordTable;
