import { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
import { saveFlashcards } from "../../../utils/file";
import { Card } from "../../../storageTypes";
import { Button } from "../../../components/Button";
import { useFocus } from "../../../utils/useFocus";

export const TableHeader = ({
  folderName,
  setSearchInput,
  addFilter,
  deleteFilter,
  cards,
}: {
  folderName: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  addFilter: Function;
  deleteFilter: Function; //This is giving me an error that it should be unique, someone please fix this
  cards: Card[];
}) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [inputRef] = useFocus();

  const uniqueLans = Array.from(new Set(cards.map((card) => card.back.lang)));

  return (
    <div className={css.header}>
      <Text type="heading" bold noWrap className={css.heading}>
        {folderName}

        <span className={css.buttonsTray}>
          <div className={css.buttons}>
            <div
              className={css.inputContainer}
              style={{ flexGrow: inputOpen ? 1 : 0 }}
            >
              <Input
                placeholder="Search cards..."
                onChange={(event) => setSearchInput(event.currentTarget.value)}
                ref={inputRef}
              />
            </div>
            <div
              className={css.dropDown}
              style={{ flexGrow: dropOpen ? 1 : 0 }}
            >
              <input type = "checkbox" value = "null" onChange = {(event) => {event.target.checked ? addFilter(event.target.value): deleteFilter(event.target.value)}} /> 
              <label>None </label>
              {uniqueLans.map((lan) => (
                <label>
                <input type = "checkbox" value = {lan} onChange = {(event) => {event.target.checked ? addFilter(event.target.value): deleteFilter(event.target.value)}} /> 
                None
                </label>
              ))}
            </div>
            <Button
              noBorder
              onMouseDown={() => {
                // if (!inputOpen) focusInput(); //focus input on open
                setInputOpen(!inputOpen);
                setDropOpen(false);
              }}
              zoomOnHover
            >
              <Icon name="search" />
            </Button>

            <Button
              noBorder
              zoomOnHover
              onMouseDown={() => {
                setDropOpen(!dropOpen);
                setInputOpen(false);
              }}
              disabled={!cards.length}
              style={{ marginLeft: "-5px" }}
            >
              <Icon name= "Filter_Alt"/>
            </Button>

            <Button
              onMouseDown={() => saveFlashcards(folderName, cards)}
              noBorder
              zoomOnHover
              style={{ marginLeft: "-5px" }}
              disabled={!cards.length}
            >
              <Icon name="download" />
            </Button>
          </div>
        </span>
      </Text>
    </div>
  );
};
