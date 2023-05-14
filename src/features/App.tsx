import React, { createContext, useContext, useEffect, useState } from "react";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { UserManual } from "./UserManual";
import { Card, Folder } from "../storageTypes";
import { FolderNav } from "./FolderNav";
import { ChromeStorage, useStorage } from "../utils/storage";
import logo from "../assets/logo.svg";
import { nanoid } from "nanoid";

export const FolderContext = createContext<{
  activeFolder: Folder | undefined;
  setActiveFolder: React.Dispatch<React.SetStateAction<Folder>> | undefined;
}>({
  activeFolder: undefined,
  setActiveFolder: undefined,
});
export const UseFolderContext = () => {
  const { activeFolder, setActiveFolder } = useContext(FolderContext);
  if (!activeFolder || !setActiveFolder)
    throw new Error(
      "You've used FolderContext outside of its designated scope!"
    );
  return { activeFolder, setActiveFolder };
};
export const JustCollectedFolder: Folder = {
  name: "Just Collected",
  id: "root",
};
const emptyArray: any[] = [];

function App() {
  const cards = useStorage<Card[]>("cards", emptyArray);
  const folders = useStorage<Folder[]>("folders", emptyArray);
  const [activeFolder, setActiveFolder] = useState<Folder>(JustCollectedFolder);
  useEffect(() => {
    if (folders && folders.length === 0) {
      //loaded without any folders
      ChromeStorage.setPair("folders", [
        {
          name: "Saved",
          id: nanoid(),
        },
      ]);
    }
  }, [folders]); //This is just cuz there's no create folder feature yet... will implement soon

  const moveCards = (cardIds: string[], folderId?: string) => {
    if (!cards || !folders) return; //somehow useStorage failed to initialize this... odd
    const cardsClone = [...cards];
    for (const card of cardsClone) {
      if (cardIds.includes(card.id)) {
        card.location = folderId ?? folders[0].id; //also temp
      }
    }
    ChromeStorage.setPair("cards", cardsClone);
  };
  const deleteCards = (cardIds: string[]) => {
    if (!cards) return;
    ChromeStorage.setPair(
      "cards",
      cards.filter((card) => !cardIds.includes(card.id))
    );
  };
  const cardsUnderCurrentFolder = cards?.filter(
    (card) => card.location === activeFolder.id
  );

  return (
    <FolderContext.Provider value={{ activeFolder, setActiveFolder }}>
      <div className={css.menu}>
        <img src={logo} className={css.logo} alt="logo" />
        {folders && <FolderNav folders={folders} />}
        <UserManual />
      </div>
      {cardsUnderCurrentFolder && (
        <WordTable
          cards={cardsUnderCurrentFolder}
          moveCards={moveCards}
          key={activeFolder.id}
          deleteCards={deleteCards}
        />
      )}
    </FolderContext.Provider>
  );
}

export default App;
