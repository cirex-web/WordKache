import React, { /*cloneElement,*/ createContext, useContext, useEffect, useState } from "react";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { Card, Folder } from "../storageTypes";
import { FolderNav } from "./FolderNav";
import { ChromeStorage, useStorage } from "../utils/storage";
import logo from "../assets/logo.svg";
import { nanoid } from "nanoid";
//import { unstable_renderSubtreeIntoContainer } from "react-dom";

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
  const saveId = "defaultFolder";

  useEffect(() => {
    if (folders && folders.length === 0) {
      //loaded without any folders
      ChromeStorage.setPair("folders", [
        {
          name: "Saved",
          id: saveId,
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
        parentId: activeFolder.id === "root" ? undefined : activeFolder.id, //If added on Just collected, make surface level folder
      },
    ])
  }

  const deleteFolder = () => {
    console.log(selectedFolder, folders);
    const newFolders = [];
    for(let i = 0; i < folders!.length; i++) {
      const folder = folders![i];
      if((selectedFolder.map((f) => f.id).includes(folder.id) && folder.id !== activeFolder.id) && folder.id !== saveId)
        folders!.map((subFolder) => subFolder.parentId = (subFolder.parentId === folder.id) ? folder.parentId : subFolder.parentId);
      else
        newFolders.push(folder);
    }
    ChromeStorage.setPair("folders", newFolders)
  }

  const renameFolder = (folderName: string, folderId: string) => {
    ChromeStorage.setPair("folders", 
      folders?.map((folder) => {
        if(folder.id === folderId)
          folder.name = folderName;
        return folder;
        
      })
    )
  }

  const last = (arr: any[]) => arr[arr.length - 1];

  const moveCards = (cardIds: string[]) => {
    if (!cards || !folders) return; //somehow useStorage failed to initialize this... odd
    let newCards:Card[] = [];
    for (const card of cards) {

      if (cardIds.includes(card.id)){
        if(selectedFolder.length > 1) {
          selectedFolder.map((folder) => {
            if(folder.id !== activeFolder.id){  //don't move to the same folder
              const cardCopy = {...card};
              cardCopy.id = nanoid();

              newCards.push(cardCopy);//copy card
              last(newCards).location = folder.id;
            }
          })
        }
        else{ 
          newCards.push(card);
          last(newCards).location = folders[0].id; //also temp, will always be a defaultFolder
        }
      }
      else 
        newCards.push(card);

    }
    ChromeStorage.setPair("cards", newCards);
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
        {folders && <FolderNav folders={folders} addFolder={addFolder} deleteFolder = {deleteFolder} renameFolder={renameFolder}/>}
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
