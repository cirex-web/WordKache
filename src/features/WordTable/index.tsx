import React, { useEffect, useState } from "react";
import { Card } from "../../types";
import { similar } from "../../utils/strings";
import Styles from "./index.module.css";
import { Table, Input, Collapse} from 'reactstrap';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';

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

  const toggle = () => setIsOpen(!isOpen);

  //Search
  const fuse = new Fuse(filteredCards, {
    keys: [
      'front.text',
      'back.text'
    ]
  });
  const [searchInp, setInput] = useState('')
  
  const results = fuse.search(searchInp);
  
  const searchResults = (searchInp.length == 0) ? filteredCards : results.map(result => result.item);

  //Language
  const [language, setLanguage] = useState('Translation');

   return (
    <>
    <Table bordered hover dark>
      <tbody>
        <tr style = {{position: "sticky", top:"0"}}>
          <th style = {{textAlign: "left"}}> <FaSearch onClick={toggle}/> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Original</th>
          <th style = {{textAlign: "center"}}>{language}</th>
        </tr>
        {searchResults.map(
          (wordEntry, i) =>
            wordEntry.good && (
              <tr key={i}>
                <td>{wordEntry.front.text}</td>
                <td onMouseEnter={() => setLanguage(wordEntry.back.lang)} onMouseLeave={() => setLanguage("Translation")}>{wordEntry.back.text}</td>
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
