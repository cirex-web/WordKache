import { useContext, createContext, useState } from "react";
import { useFolders } from "../utils/storage/folders";

const FolderContext = createContext<
  | {
      /** The folder you currently are in */
      activeFolderId: string;
      setActiveFolderId: React.Dispatch<React.SetStateAction<string>>;
      /** Your range-selected folders */
      selectedFolderIds: string[];
      setSelectedFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
      moveFolder: (sourceId: string, targetId: string) => void;
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

export const FolderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { folders, deleteFolders, addFolder, moveFolder, renameFolder } =
    useFolders();
  const [selectedFolderIds, setSelectedFolderIds] = useState(["root"]);
  const [activeFolderId, setActiveFolderId] = useState("root");

  return (
    <FolderContext.Provider
      value={{
        activeFolderId,
        setActiveFolderId,
        selectedFolderIds,
        setSelectedFolderIds,
        moveFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
