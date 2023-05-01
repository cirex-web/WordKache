import React, { useEffect, useState } from "react";
import { Card } from "../../types";
import { similar } from "../../utils/strings";
import Styles from "./index.module.css";
import { Table, Input, Collapse} from 'reactstrap';
import { FaSearch } from 'react-icons/fa';

const WordTable = ({ cards }: { cards: Card[] }) => {

  //Filter Cards
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
  
  //Toggle Search
  const [isOpen, setIsOpen] = useState(false);
  const [searchInp, setInput] = useState('')

  const toggle = () => setIsOpen(!isOpen);

   return (
    <>
    <Table bordered hover dark>
      <tbody>
        <tr style = {{position: "sticky", top:"0"}}>
          <th style = {{textAlign: "left"}}> <FaSearch className = {Styles.icon_container} onClick={toggle}/> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Original</th>
          <th style = {{textAlign: "center"}}>Translation</th>
        </tr>
        {filteredCards.map(
          (wordEntry, i) =>
            wordEntry.good && (
              <tr key={i}>
                <td>{wordEntry.front.text}</td>
                <td>{wordEntry.back.text}</td>
              </tr> //words typed to saved words ratio
            )
        )}

      </tbody>
    </Table>
    <Collapse isOpen = {isOpen} className = {Styles.text_box}><Input placeholder="type a word" onChange={event => setInput(event.target.value)}/></Collapse>
    </>
  );
};


export default WordTable;
