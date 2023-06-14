import classNames from "classnames";
import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { Card } from "../../../types/storageTypes";
import css from "./index.module.css";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useFolderNavContext } from "../../../contexts/FolderNavProvider";

interface ITextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  language: string;
  title: string;
}

const TextArea = ({ className, language, title, ...rest }: ITextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textboxHeight, setTextboxHeight] = useState(0);
  const updateHeight = () => {
    if (textAreaRef.current) {
      setTextboxHeight(Math.min(40, textAreaRef.current.scrollHeight));
    }
  };
  useLayoutEffect(updateHeight);
  return (
    <div className={css.textAreaContainer}>
      <Text type="subheading" className={css.title}>
        {title} ({language})
      </Text>
      <textarea
        ref={textAreaRef}
        style={{ height: textboxHeight }}
        onInput={updateHeight}
        {...rest}
        className={classNames(css.textarea, className)}
      ></textarea>
      {/* <Text type="paragraph" className={css.language}>
        {language}
      </Text> */}
    </div>
  );
};
export const WordPanel = ({
  cards,
  saveCard,
  deleteCard,
  flipCards,
}: {
  cards: Card[];
  saveCard: () => void;
  deleteCard: () => void;
  flipCards: () => void;
}) => {
  const singleCard = cards[0];
  const { selectedFolderIds, activeFolderId } = useFolderNavContext();
  return (
    <div className={css.container}>
      {cards.length === 1 && (
        <div
          className={css.textBoxContainer}
          key={singleCard.id} //For textarea height recalculation every time the card data changes
        >
          <TextArea
            value={singleCard.front.text}
            language={singleCard.front.lang}
            readOnly
            title="Front"
          />
          <div style={{ background: "white" }}></div>
          <TextArea
            value={singleCard.back.text}
            language={singleCard.back.lang}
            readOnly
            title="Back"
          />
        </div>
      )}
      <div className={css.buttonRow}>
        <Button
          onClick={saveCard}
          disabled={
            selectedFolderIds.filter((id) => id !== activeFolderId).length === 0
          }
        >
          <Text type="subheading">Move</Text>
        </Button>
        <Button onClick={deleteCard}>
          <Text type="subheading">Delete</Text>
        </Button>
        <Button onClick={flipCards}>
          <Text type="subheading">Flip</Text>
        </Button>
        <Text type="paragraph" className={css.source}>
          {cards.length === 1
            ? `Source: ${singleCard.source}`
            : `Selected (${cards.length}) Cards`}
        </Text>
      </div>
    </div>
  );
};
