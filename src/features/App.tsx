import React, { useEffect, useState } from "react";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { Card, WordList } from "../types";
import { Text } from "../components/Text";
import { FolderNav } from "./FolderNav";
import { ChromeStorage } from "../utils/storage";
import logo from "../assets/logo.svg";
import { TableHeader } from "./TableHeader";
function App() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    chrome.storage?.local.onChanged.addListener((changes) => {
      if ("pending" in changes) {
        setCards(changes.pending.newValue as Card[]);
      }
    });
    ChromeStorage.get("pending").then((res) => setCards((res ?? []) as Card[]));
  }, []);
  return (
    <>
      <div
        style={{
          borderRight: "3px solid var(--light-1)",
        }}
      >
        <img src={logo} className={css.logo} alt="logo" />
        <FolderNav />

      </div>
      <div style={{ overflow: "scroll" }}>
        <TableHeader />
        <WordTable cards={cards} />
      </div>
    </>
  );
}

export default App;
