import React from "react";
import logo from "./logo.svg";
import css from "./styles/App.module.scss";
import WordTable from "./components/WordTable";
import { WordList } from "./types";
import { Text } from "./components/Text";

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
    <div className="App">
      <header>
        <img
          src="https://placehold.co/600x100"
          className={css.logo}
          alt="logo"
        />
      </header>
      <div className={css.container}>
        <Text type="paragraph">lol ok</Text>
        <WordTable words={exampleWords} />
      </div>
    </div>
  );
}

export default App;
