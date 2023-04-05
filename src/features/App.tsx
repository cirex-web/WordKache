import React from "react";
import logo from "./logo.svg";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { WordList } from "../types";
import { Text } from "../components/Text";
import { FolderNav } from "./FolderNav";

const exampleWords: WordList = [
  {
    front: { word: "bleh", lang: "en" },
    back: { word: "ok", lang: "es" },
  },
  {
    front: { word: "bleh", lang: "en" },
    back: { word: "ok", lang: "es" },
  },
  {
    front: { word: "bleh", lang: "en" },
    back: { word: "ok", lang: "es" },
  },
];

function App() {
  return (
    <>
      <div style={{ width: "200px", display: "flex", flexDirection: "column" }}>
        <img
          src="https://placehold.co/600x300"
          className={css.logo}
          alt="logo"
        />
        <FolderNav />
      </div>
      <div>
        <div className={css.container}>
          <Text type="paragraph">
            Welcome back! We've generated N flashcards from your recent
            translation activity. Review them here:
          </Text>
        </div>
        <WordTable words={exampleWords} />
      </div>
    </>
  );
}

export default App;
