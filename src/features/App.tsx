import React, { createContext, useContext, useState } from "react";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { FolderNav } from "./FolderNav";
import { ForwardingPage } from "./ForwardPage";
import logo from "../assets/logo.svg";
import { useCards } from "../utils/storage/cards";
import { useFolders } from "../utils/storage/folders";
import { UserManual } from "./UserManual";
import { Folder } from "../types/storageTypes";

export const FolderContext = createContext<
  | {
      folders: Folder[];
      /** The folder you currently are in */
      activeFolderId: string;
      setActiveFolderId: React.Dispatch<React.SetStateAction<string>>;
      /** Your range-selected folders */
      selectedFolderIds: string[];
      setSelectedFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
      moveFolder: (sourceId: string, targetId: string) => void;
      toggleFolderOpen: (folderId: string) => Promise<void>;
    }
  | undefined
>(undefined);

export const UseFolderContext = () => {
  const context = useContext(FolderContext);
  if (context === undefined)
    throw new Error(
      "You've used FolderContext outside of its designated scope!"
    );
  return context;
};

function App() {
  const {
    folders,
    deleteFolders,
    addFolder,
    moveFolder,
    renameFolder,
    toggleFolderOpen,
  } = useFolders();
  const { cards, moveCards, deleteCards } = useCards();
  const [activeFolderId, setActiveFolderId] = useState("");
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const cardsUnderCurrentFolder = cards?.filter(
    (card) => card.location === activeFolderId && !card.hidden && !card.deleted //top-level filtering
  );

  return (
    <FolderContext.Provider
      value={{
        folders: folders ?? [],
        activeFolderId,
        setActiveFolderId,
        selectedFolderIds,
        setSelectedFolderIds,
        moveFolder,
        toggleFolderOpen,
      }}
    >
      <div className={css.menu}>
        <img src={logo} className={css.logo} alt="logo" />

        <FolderNav
          folders={folders ?? []}
          addFolder={addFolder}
          deleteFolder={() => deleteFolders(selectedFolderIds)}
          renameFolder={renameFolder}
        />

        <UserManual
          numCardsHidden={
            cards
              ? cards.reduce<number>((sum, card) => sum + +!!card.hidden, 0)
              : 0
          }
        />
      </div>
      {!activeFolderId.length ? (
        <ForwardingPage key="filters" />
      ) : (
        cardsUnderCurrentFolder && (
          <WordTable
            cards={cardsUnderCurrentFolder}
            moveCards={moveCards}
            key={activeFolderId}
            deleteCards={deleteCards}
          />
        )
      )}
    </FolderContext.Provider>
  );
}

export default App;
