import classNames from "classnames";
import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { Card } from "../../../storageTypes";
import css from "./index.module.css";
import React, { useLayoutEffect, useRef, useState } from "react";

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
  cardInfo,
  saveCard,
  deleteCard,
}: {
  cardInfo: Card;
  saveCard: () => void;
  deleteCard: () => void;
}) => {
  return (
    <div className={css.container}>
      <div className={css.textBoxContainer}>
        <TextArea
          value={cardInfo.front.text}
          language={cardInfo.front.lang}
          readOnly
          title="Front"
          key={cardInfo.id + "1"}
        />
        <div style={{ background: "white" }}></div>
        <TextArea
          value={cardInfo.back.text}
          language={cardInfo.back.lang}
          readOnly
          title="Back"
          key={cardInfo.id + "2"}
        />
      </div>
      <div className={css.buttonRow}>
        {cardInfo.location === "root" && (
          <Button onClick={saveCard}>
            <Text type="subheading">Save</Text>
          </Button>
        )}
        <Button onClick={deleteCard}>
          <Text type="subheading">Delete</Text>
        </Button>
        <Text type="paragraph" className={css.source}>
          Source: {cardInfo.source}
        </Text>
      </div>
    </div>
  );
};
