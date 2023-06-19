import { createContext, useContext, useEffect, useRef, useState } from "react";
import { handleRowSelect } from "../utils/rangeSelect";
import { getOrderedFolderIds } from "../utils/storage/folders";
import { useFolderContext } from "./FolderProvider";
import { ChromeStorage, useStorage } from "../utils/storage/storage";

const FolderNavContext = createContext<
  | {
      /** Your range-selected folders */
      selectedFolderIds: string[];
      setSelectedFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
      handleFolderSelect: (
        ev: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        folder: string
      ) => void;
      /** The current (aka "active") folder id */
      activeFolderId?: string | null;
      setActiveFolderId: (val: string | null) => void;
    }
  | undefined
>(undefined);

export const useFolderNavContext = () => {
  const context = useContext(FolderNavContext);
  if (context === undefined)
    throw new Error("You've used FolderNavContext outside of its given scope!");
  return context;
};
export const FolderNavContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeFolderId, setActiveFolderId] = useStorage<null | string>(
    "currentlyActiveFolder",
    null
  );
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  useEffect(() => {
    ChromeStorage.get("currentlyActiveFolder").then((activeFolderId) => {
      if (typeof activeFolderId === "string") {
        setSelectedFolderIds([activeFolderId]);
      }
    });
  }, []);

  const { tree: fileTree } = useFolderContext();
  const pivotPointRef = useRef(0); //TODO:

  const handleFolderSelect = (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    folder: string
  ) => {
    const folderIds = getOrderedFolderIds(fileTree);
    const selectedIds = handleRowSelect(
      ev,
      folder,
      folderIds,
      selectedFolderIds,
      pivotPointRef
    ); //TODO: ok this feels jank
    setSelectedFolderIds(
      folderIds.filter((folderId) => selectedIds.includes(folderId))
    );
  };
  return (
    <FolderNavContext.Provider
      value={{
        selectedFolderIds,
        setSelectedFolderIds,
        handleFolderSelect,
        setActiveFolderId,
        activeFolderId,
      }}
    >
      {children}
    </FolderNavContext.Provider>
  );
};
