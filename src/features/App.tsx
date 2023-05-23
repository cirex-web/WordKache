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

export const FolderContext = createContext<{
  /** The folder you currently are in */
  folders: Folder[];
  activeFolderId: string;
  setActiveFolderId: React.Dispatch<React.SetStateAction<string>>;
  /** Your range-selected folders */
  selectedFolderIds: string[];
  setSelectedFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
  moveFolder: (sourceId: string, targetId: string) => void;
} | undefined>(undefined);

export const UseFolderContext = () => {
  const context = useContext(FolderContext);
  if (
    context === undefined 
  )
    throw new Error(
      "You've used FolderContext outside of its designated scope!"
    );
  return context;
};

function App() {
  const { folders, deleteFolders, addFolder, moveFolder, renameFolder } =
    useFolders();
  const { cards, moveCards, deleteCards } = useCards();
  const [activeFolderId, setActiveFolderId] = useState("root");
  const [selectedFolderIds, setSelectedFolderIds] = useState(["root"]);
  const [filterWindowOpen, setFilterWindowOpen] = useState(false);

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
      {filterWindowOpen ? (
        <ForwardingPage folders={folders === undefined ? [] : folders} />
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
