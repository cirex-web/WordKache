import { useContext, createContext, useState } from "react";
import { useFolders } from "../utils/storage/folders";
import { Folder } from "../types/storageTypes";
import { FileDirectory } from "../types/folderTypes";

export const FolderContext = createContext<
  | {
      folders: Folder[];
      moveFolder: (sourceId: string, targetId: string) => void;
      toggleFolderOpen: (folderId: string) => Promise<void>;
      tree: FileDirectory[];
      addFolder:(folderName: string, parentFolderId?: string | undefined) => void,
      deleteFolders: (selectedFolderIds: string[]) => void,
      renameFolder: (folderName: string, folderId: string) => void,
    }
  | undefined
>(undefined);

export const useFolderContext = () => {
  const context = useContext(FolderContext);
  if (context === undefined)
    throw new Error(
      "You've used FolderContext outside of its designated scope!"
    );
  return context;
};
export const FolderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    folders,
    deleteFolders,
    addFolder,
    moveFolder,
    renameFolder,
    toggleFolderOpen,
    tree,
  } = useFolders();


  return (
    <FolderContext.Provider
      value={{
        folders: folders ?? [],
        moveFolder,
        toggleFolderOpen,
        tree,
        deleteFolders,
        addFolder,
        renameFolder
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
