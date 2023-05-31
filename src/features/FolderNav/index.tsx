import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import { Folder } from "../../types/storageTypes";
import { RecursiveFolder } from "./RecursiveFolder";
import css from "./index.module.css";
import { FileDirectory } from "../../types/folderTypes";
import { Button } from "../../components/Button";
import { handleRowSelect } from "../../utils/rangeSelect";
import React, { useContext, useMemo } from "react";
import { getOrderedFolderIds } from "../../utils/storage/folders";
import { useFolderContext } from "../../contexts/FolderProvider";
import {
  FolderNavContextProvider,
  useFolderNavContext,
} from "../../contexts/FolderNavProvider";

export const FolderNav = () => {
  const {
    tree: fileTree,
    addFolder,
    deleteFolders,
  } = useFolderContext();
  const {selectedFolderIds,activeFolderId} = useFolderNavContext();
  

  return (
    <div className={css.container}>
      <Text type="heading" bold className={css.title}>
        <Icon name="folder" />
        Folders
        <Text type="xLargeHeading" className={css.buttonContainer}>
          <Button
            onMouseDown={() => addFolder("New Folder", activeFolderId)}
            zoomOnHover
          >
            <Icon name="Add" />
          </Button>
          <Button onMouseDown={()=>deleteFolders(selectedFolderIds)} zoomOnHover>
            <Icon name="Remove" />
          </Button>
        </Text>
      </Text>
      {fileTree.map((folders) => (
        <RecursiveFolder
          folder={folders}
          key={folders.id}
        />
      ))}
    </div>
  );
};
