import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { Card, WordList } from "../types";
import { Text } from "../components/Text";
import { FolderNav } from "./FolderNav";
import { ChromeStorage } from "../utils/storage";

function App() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    chrome.storage?.local.onChanged.addListener((changes) => {
      if ("pending" in changes) {
        setCards(changes.pending.newValue as Card[]);
      }
    });
    ChromeStorage.get("pending").then((res) => setCards(res as Card[]));
  }, []);
  return (
    <>
      <div
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src="https://placehold.co/600x300"
          className={css.logo}
          alt="logo"
        />
        <FolderNav />
      </div>
      <div style={{ overflow: "scroll" }}>
        <WordTable cards={cards} />
      </div>
    </>
  );
}

export default App;
