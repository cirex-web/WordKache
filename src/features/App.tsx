import React, { createContext, useContext, useEffect, useState } from "react";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { Card, Folder } from "../storageTypes";
import { FolderNav } from "./FolderNav";
import { ChromeStorage, useStorage } from "../utils/storage";
import logo from "../assets/logo.svg";
import { nanoid } from "nanoid";

export const FolderContext = createContext<{
  activeFolder: Folder | undefined;
  setActiveFolder: React.Dispatch<React.SetStateAction<Folder>> | undefined;
  selectedFolder: Folder[] | undefined;
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder[]>> | undefined;
}>({
  activeFolder: undefined,
  setActiveFolder: undefined,
  selectedFolder: undefined,
  setSelectedFolder: undefined,
});


export const UseActiveFolderContext = () => {
  const { activeFolder, setActiveFolder } = useContext(FolderContext);
  if (!activeFolder || !setActiveFolder)
    throw new Error(
      "You've used FolderContext outside of its designated scope!"
    );
  return { activeFolder, setActiveFolder };
};

export const UseSelectedFolderContext = () => {
  const { selectedFolder, setSelectedFolder } = useContext(FolderContext);
  if (!selectedFolder || !setSelectedFolder)
    throw new Error(
      "You've used FolderContext outside of its designated scope!"
    );
   return { selectedFolder, setSelectedFolder };
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
  const [selectedFolder, setSelectedFolder] = useState<Folder[]>([JustCollectedFolder]);
  const saveId = React.useRef(nanoid());

  useEffect(() => {
    if (folders && folders.length === 0) {
      //loaded without any folders
      ChromeStorage.setPair("folders", [
        {
          name: "Saved",
          id: saveId.current,
        },
      ]);
    }
  }, [folders]); //This is just cuz there's no create folder feature yet... will implement soon -- Did it(Jonathan)
  

  const addFolder = (folderName: string) => {
    ChromeStorage.setPair("folders", [
      ...folders ?? [],
      {
        name: folderName,
        id: nanoid(),
      },
    ])
  }

  const deleteFolder = () => {
    console.log(selectedFolder, folders);
    ChromeStorage.setPair("folders", 
      folders?.filter((folder, i) => 
        (!selectedFolder.map((f) => f.id).includes(folder.id) || folder.id === activeFolder.id) || folder.id === saveId.current //O(2n) = O(n), don't delete the root folders
      )
    )
  }

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
    const cardsClone = [...cards];
    for (const card of cards) {
      if (cardIds.includes(card.id)) card.deleted = true; //fake deletion
    }
    ChromeStorage.setPair("cards", cardsClone);
  };

  const cardsUnderCurrentFolder = cards?.filter(
    (card) => card.location === activeFolder.id && !card.hidden && !card.deleted //top-level filtering
  );

  return (
    <FolderContext.Provider value={{ activeFolder, setActiveFolder, selectedFolder, setSelectedFolder }}>
      <div
        style={{
          borderRight: "3px solid var(--light-1)",
        }}
      >
        <img src={logo} className={css.logo} alt="logo" />
        {folders && <FolderNav folders={folders} addFolder={addFolder} deleteFolder = {deleteFolder}/>}
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
