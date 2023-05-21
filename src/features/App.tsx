import React, { createContext, useContext, useEffect, useState } from "react";
import css from "./App.module.scss";
import WordTable from "./WordTable";
import { Card, Folder, Filter, FilterDirectory } from "../storageTypes";
import { UserManual } from "./UserManual";
import { FolderNav } from "./FolderNav";
import { ForwardingPage } from "./ForwardPage";
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

export const ForwardContext = createContext<{
  forwarding: boolean;
  setForwarding: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFilter: Filter[] | undefined;
  setSelectedFilter: React.Dispatch<React.SetStateAction<Filter[]>> | undefined;
}>({
  forwarding: false,
  setForwarding: () => {}, //avoid undefined error
  selectedFilter: undefined,
  setSelectedFilter: undefined,
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

export const UseForwardingContext = () => {
  const { selectedFilter, setSelectedFilter } = useContext(ForwardContext);
  if (!selectedFilter || !setSelectedFilter)
    throw new Error(
      "You've used FilterContext outside of its designated scope!"
    );
  return { selectedFilter, setSelectedFilter };
};

export const JustCollectedFolder: Folder = {
  name: "Just Collected",
  id: "root",
};
const emptyArray: any[] = [];

function App() {
  const cards = useStorage<Card[]>("cards", emptyArray);
  const folders = useStorage<Folder[]>("folders", emptyArray);
  const filters = useStorage<FilterDirectory[]>("filters", emptyArray);
  const [activeFolder, setActiveFolder] = useState<Folder>(JustCollectedFolder);
  const [selectedFolder, setSelectedFolder] = useState<Folder[]>([
    JustCollectedFolder,
  ]);
  const [selectedFilter, setSelectedFilter] = useState<Filter[]>([]);
  const [forwarding, setForwarding] = useState<boolean>(false);
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
  }, [folders]);

  const addFolder = (folderName: string) => {
    ChromeStorage.setPair("folders", [
      ...(folders ?? []),
      {
        name: folderName,
        id: nanoid(),
        parentId: activeFolder.id === "root" ? undefined : activeFolder.id, //If added on Just collected, make surface level folder
      },
    ]);
  };

  const deleteFolder = () => {
    const newFolders = [];
    for (let i = 0; i < folders!.length; i++) {
      const folder = folders![i];
      if (
        selectedFolder.map((f) => f.id).includes(folder.id) &&
        folder.id !== activeFolder.id &&
        folder.id !== saveId
      ) {
        if (
          cards?.some((card) => card.location === folder.id) &&
          !window.confirm(
            "Are you sure you want to delete" +
              folder.name +
              "? This will delete all cards in this folder."
          )
        )
          newFolders.push(folder);
        else
          folders!.map(
            (subFolder) =>
              (subFolder.parentId =
                subFolder.parentId === folder.id
                  ? folder.parentId
                  : subFolder.parentId)
          );
      } else newFolders.push(folder);
    }
    ChromeStorage.setPair("folders", newFolders);
  };

  const renameFolder = (folderName: string, folderId: string) => {
    ChromeStorage.setPair(
      "folders",
      folders?.map((folder) => {
        if (folder.id === folderId) folder.name = folderName;
        return folder;
      })
    );
  };

  const reOrderFolders = (folderIds: Folder[]) => {
    ChromeStorage.setPair("folders", folderIds);
  };

  const addFilter = (newFilter: Filter, folder: string) => {
    if (!filters?.some((filter) => filter.id === folder))
      filters!.push({ filters: [], id: folder });

    filters?.map((filter) => {
      if (filter.id === folder) {
        filter.filters.push({
          ...newFilter,
        });
      }
      return filter;
    });
    ChromeStorage.setPair("filters", filters);
  };

  const deleteFilter = (filterIds: string[], folderId: string) => {
    filters?.map((filter) => {
      if (filter.id === folderId) {
        filter.filters = filter.filters.filter(
          (filter) => !filterIds.includes(filter.id)
        );
      }
      return filter;
    });
    ChromeStorage.setPair("filters", filters);
  };

  const last = (arr: any[]) => arr[arr.length - 1];

  const moveCards = (cardIds: string[]) => {
    if (!cards || !folders) return; //somehow useStorage failed to initialize this... odd
    let newCards: Card[] = [];
    for (const card of cards) {
      if (cardIds.includes(card.id)) {
        if (selectedFolder.length > 1) {
          selectedFolder.map((folder) => {
            if (folder.id !== activeFolder.id) {
              //don't move to the same folder
              const cardCopy = { ...card };
              cardCopy.id = nanoid();

              newCards.push(cardCopy); //copy card
              last(newCards).location = folder.id;
            }
          });
        } else {
          newCards.push(card);
          last(newCards).location = folders.find(
            (folder) => folder.id === saveId
          )?.id; //also temp, will always be a defaultFolder
        }
      } else newCards.push(card);
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

  const filterCards = (folderCards: Card[], filters: Filter[]) => {
    if (cards === undefined || !folderCards.length || !filters.length) return;
    const fitSize = (filter: Filter, card: Card) =>
      Math.sign(filter.size!) + 1
        ? card.back.text.length < Math.abs(filter.size!) ||
          card.front.text.length < Math.abs(filter.size!)
        : card.back.text.length > Math.abs(filter.size!) ||
          card.front.text.length > Math.abs(filter.size!);

    const hasWords = (filter: Filter, card: Card) =>
      filter.words!.every(
        (word) =>
          card.back.text.includes(word) || card.front.text.includes(word)
      ); //bad implementation because doesn't check for white space, please remake with regex
    let moveCards = new Map<string, string>();
    for (const filter of filters) {
      for (const card of folderCards) {
        if (
          filter.frontLang === undefined ||
          filter.frontLang!.includes(card.front.lang)
        ) {
          //extended and statements
          if (
            filter.backLang === undefined ||
            filter.backLang!.includes(card.back.lang)
          ) {
            if (filter.words === undefined || hasWords(filter, card)) {
              if (filter.size === undefined || fitSize(filter, card)) {
                moveCards.set(card.id, filter.destination);
              }
            }
          }
        }
      }
    }
    for (const card of cards) {
      if (moveCards.has(card.id)) card.location = moveCards.get(card.id)!; //pass by reference so no need to make new cards
    }
    ChromeStorage.setPair("cards", cards);
  };

  const filtersUnderCurrentFolder =
    filters === undefined || !filters.length
      ? []
      : filters!.find((filter) => filter.id === activeFolder.id)?.filters;
  if (
    filtersUnderCurrentFolder !== undefined &&
    cardsUnderCurrentFolder !== undefined
  )
    filterCards(cardsUnderCurrentFolder, filtersUnderCurrentFolder);

  return (
    <FolderContext.Provider
      value={{
        activeFolder,
        setActiveFolder,
        selectedFolder,
        setSelectedFolder,
      }}
    >
      <ForwardContext.Provider
        value={{ forwarding, setForwarding, selectedFilter, setSelectedFilter }}
      >
        <div className={css.menu}>
          <img src={logo} className={css.logo} alt="logo" />

          <FolderNav
            folders={folders || []}
            addFolder={addFolder}
            deleteFolder={deleteFolder}
            renameFolder={renameFolder}
            changeOrder={reOrderFolders}
          />

          <UserManual
            numCardsHidden={
              cards
                ? cards.reduce<number>((sum, card) => sum + +!!card.hidden, 0)
                : 0
            }
          />
        </div>
        {forwarding ? (
          <ForwardingPage
            curFolder={activeFolder.id}
            folders={folders === undefined ? [] : folders}
            filters={filtersUnderCurrentFolder}
            addFilter={addFilter}
            deleteFilter={deleteFilter}
          />
        ) : (
          cardsUnderCurrentFolder && (
            <WordTable
              cards={cardsUnderCurrentFolder}
              moveCards={moveCards}
              key={activeFolder.id}
              deleteCards={deleteCards}
            />
          )
        )}
      </ForwardContext.Provider>
    </FolderContext.Provider>
  );
}

export default App;
