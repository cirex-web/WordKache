import { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Input } from "../../../components/Input";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
import { saveFlashcards } from "../../../utils/file";
import { Card } from "../../../storageTypes";
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
              />
            </div>
            <Icon name="search" onMouseDown={() => setInputOpen(!inputOpen)} />
            <Icon
              name="ios_share"
              onMouseDown={() => saveFlashcards(folderName, cards)}
            />
          </div>
        </span>
      </Text>
    </div>
  );
};
