import React from "react";
import { WordList } from "../types";

const WordTable = ({ words }: { words: WordList }) => {
  return (
    <table>
      <colgroup>
        <col span={1} style={{ width: "50%" }}></col>
        <col span={1} style={{ width: "50%" }}></col>
      </colgroup>
      <tbody>
        {words.map((wordEntry, i) => (
          <tr key={i}>
            <td>{wordEntry.front.word}</td>
            <td>{wordEntry.back.word}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WordTable;
