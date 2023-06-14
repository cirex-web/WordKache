import { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import css from "./index.module.css";
import { saveFlashcards, copyFlashcards } from "../../../utils/file";
import { Card } from "../../../types/storageTypes";
import { Button } from "../../../components/Button";
import { Header } from "../../../components/Header";
import { useFocus } from "../../../utils";

export const TableHeader = ({
  folderName,
  setSearchInput,
  cards,
  filteredCards,
}: {
  folderName: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  cards: Card[];
  filteredCards: Card[]; //NOTE: awful lot of prop drilling (maybe use a context?)
}) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [inputRef] = useFocus();

  return (
    <Header headingText={folderName}>
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
        <Button
          onMouseDown={() => {
            // if (!inputOpen) focusInput(); //focus input on open
            setInputOpen(!inputOpen);
          }}
          zoomOnHover
          disabled={!cards.length}
          className={css.icon}
        >
          <Icon name="search" />
        </Button>

        <Button
          onMouseDown={(event) =>
            event.shiftKey || event.metaKey
              ? copyFlashcards(filteredCards)
              : saveFlashcards(folderName, filteredCards)
          }
          zoomOnHover
          disabled={!filteredCards.length}
          className={css.icon}
        >
          <Icon name="download" />
        </Button>
      </div>
    </Header>
  );
};
