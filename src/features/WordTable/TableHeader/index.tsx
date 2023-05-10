import { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
import { saveFlashcards, copyFlashcards } from "../../../utils/file";
import { Card } from "../../../storageTypes";
import { Button } from "../../../components/Button";
import { useFocus } from "../../../utils/useFocus";
export const TableHeader = ({
  folderName,
  setSearchInput,
  cards,
}: {
  folderName: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  cards: Card[];
}) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [inputRef] = useFocus();

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
            <Button
              noBorder
              onMouseDown={() => {
                // if (!inputOpen) focusInput(); //focus input on open
                setInputOpen(!inputOpen);
              }}
              zoomOnHover
              disabled={!cards.length}
            >
              <Icon name="search" />
            </Button>

            <Button
              onMouseDown={(event) => event.shiftKey || event.metaKey 
                ? copyFlashcards(folderName, cards) 
                : saveFlashcards(folderName, cards)}
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
