
import { similar } from "../../utils/strings";
import Styles from "./index.module.css";
import { Table, Input, Collapse} from 'reactstrap';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';
import React, { useState } from "react";
import { Card } from "../../storageTypes";
import {} from "../../utils/strings";
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


  //Toggle Search
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  //Search
  const fuse = new Fuse(cards, {
    keys: [
      'front.text',
      'back.text'
    ]
  });
    
  const [searchInp, setInput] = useState('')
  
  const results = fuse.search(searchInp);
  
  const searchResults = (searchInp.length == 0) ? cards : results.map(result => result.item);

  //Language
  const [language, setLanguage] = useState('Translation');

  return (
    <div className={css.container}>
      <TableHeader folderName={activeFolder.name} />
      <div className={css.table}>
        <Table bordered hover dark>
          <tbody>
            <tr style = {{position: "sticky", top:"0"}}>
              <th style = {{textAlign: "left"}}> <FaSearch onClick={toggle}/> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Original</th>
              <th style = {{textAlign: "center"}}>{language}</th>
            </tr>
            {searchResults
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
                  <td onMouseEnter={() => setLanguage(wordEntry.back.lang)} onMouseLeave={() => setLanguage("Translation")}>
                    <Text type="paragraph" noWrap>
                      {card.back.text}
                    </Text>
                  </td>
                </tr>
              ))
              .reverse()}
          </tbody>
        </Table>
        <Collapse isOpen = {isOpen} className = {Styles.text_box}><Input placeholder="type a word" onChange={event => setInput(event.target.value)}/></Collapse>
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
