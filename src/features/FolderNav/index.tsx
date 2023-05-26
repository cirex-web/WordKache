import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import { Folder } from "../../types/storageTypes";
import { RecursiveFolder } from "./RecursiveFolder";
import css from "./folderNav.module.css";
import { FileDirectory } from "../../types/folderTypes";
import { Button } from "../../components/Button";
import { handleRowSelect } from "../../utils/rangeSelect";
import { UseFolderContext } from "../App";
import React from "react";
import {
  generateTreeStructure,
  getOrderedFolderIds,
} from "../../utils/storage/folders";

export const FolderNav = ({
  folders,
  addFolder,
  deleteFolder,
  renameFolder,
}: {
  folders: Folder[];
  addFolder: (fileName: string, parentFolderId?: string) => void;
  deleteFolder: () => void;
  renameFolder: (fileName: string, folderId: string) => void;
}) => {
  const fileTree: FileDirectory[] = [...generateTreeStructure(folders)]; //why make a copy here?
  const { selectedFolderIds, activeFolderId, setSelectedFolderIds, moveFolder } =
    UseFolderContext();

  const pivotPointRef = React.useRef(0);

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
    );
    setSelectedFolderIds(
      folderIds.filter((folderId) => selectedIds.includes(folderId))
    );
  };

  return (
    <div className={css.container}>
      <Text type="heading" bold className={css.title}>
        <Icon name="folder" />
        Folders
        <Button
          onMouseDown={() =>
            addFolder(
              "New Folder",
              activeFolderId
            )
          }
          zoomOnHover
          style={{
            display: "flex",
            alignItems: "center",
            background: "transparent",
            height: "10px",
          }} //For some reason I can't make it the same using class and css file
        >
          <Icon name="Add" />
        </Button>
        <Button
          onMouseDown={deleteFolder}
          zoomOnHover
          style={{
            display: "flex",
            alignItems: "center",
            background: "transparent",
            height: "10px",
          }}
        >
          <Icon name="Remove" />
        </Button>
      </Text>
      {fileTree.map((folders) => (
        <RecursiveFolder
          folders={folders}
          setSelectedFolders={handleFolderSelect} //folders does not include nestedFolders
          changeFolderName={renameFolder}
          moveFolder={(src: string, dest: string) => moveFolder(src, dest)}
          key={folders.id}
        />
      ))}
    </div>
  );
};
