import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import { Folder } from "../../storageTypes";
import { RecursiveFolder } from "./RecursiveFolder";
import css from "./folderNav.module.css";
import { AllFiles, FileDirectory } from "./types";
import { JustCollectedFolder } from "../App";
import { Button } from "../../components/Button";
import { handleRowSelect } from "../../utils/rangeSelect";
import { UseSelectedFolderContext } from "../App";
import React from "react";

const generateTreeStructure = (folders: Folder[]) => {
  const g = new Map<string, Folder[]>();
  const res: AllFiles = [];
  for (const folder of folders) {
    if (folder.parentId) {
      if (!g.has(folder.parentId)) g.set(folder.parentId, []);
      g.get(folder.parentId)?.push(folder);
    } else {
      res.push({ ...folder });
    }
  }
  const dfs = (fileDir: FileDirectory) => {
    if (g.has(fileDir.id)) {
      fileDir.subFolders = g
        .get(fileDir.id)!
        .map((folder) => dfs({ id: folder.id, name: folder.name }));
    }
    return fileDir;
  };
  return res.map((fileDir) => dfs(fileDir));
};

const unpackFolders = (folders: FileDirectory[]): Folder[] => {
  //Cool if you could use flatmap alternative
  const foldersCopy = [];
  for (const folder of folders) {
    foldersCopy.push(folder);
    if (folder.subFolders && folder.open) {
      foldersCopy.push(...unpackFolders(folder.subFolders));
    }
  }
  return foldersCopy;
};

export const FolderNav = ({
  folders,
  addFolder,
  deleteFolder,
  renameFolder,
}: {
  folders: Folder[];
  addFolder: (fileName: string) => void;
  deleteFolder: () => void;
  renameFolder: (fileName: string, fileId: string) => void;
}) => {
  const fileTree: FileDirectory[] = [
    JustCollectedFolder, //the un-deletable folder >:D
    ...generateTreeStructure(folders),
  ];
  const { selectedFolder, setSelectedFolder } = UseSelectedFolderContext();
  const pivotPointRef = React.useRef(0);

  const handleFolderSelect = (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    folders: FileDirectory[],
    folder: FileDirectory
  ) => {
    const unpackedFolders = unpackFolders(folders);
    const folderIds = unpackedFolders.map((folder) => folder.id);
    const activeFolderIds = selectedFolder.map((folder) => folder.id);
    const selectedIds = handleRowSelect(
      ev,
      folder.id,
      folderIds,
      activeFolderIds,
      pivotPointRef
    );
    console.log(
      unpackedFolders,
      unpackedFolders.filter((cfolder) => selectedIds.includes(cfolder.id))
    );
    return unpackedFolders.filter((cfolder) =>
      selectedIds.includes(cfolder.id)
    );
  };

  return (
    <div className={css.container}>
      <Text type="heading" bold className={css.title}>
        <Icon name="folder" />
        Folders
        <Button
          onMouseDown={() => addFolder("New Folder")}
          noBorder
          zoomOnHover
          style={{
            display: "flex",
            alignItems: "center",
            background: "black",
            height: "10px",
          }} //For some reason I can't make it the same using class and css file
        >
          <Icon name="Add" />
        </Button>
        <Button
          onMouseDown={() => deleteFolder()}
          noBorder
          zoomOnHover
          style={{
            display: "flex",
            alignItems: "center",
            background: "black",
            height: "10px",
          }}
        >
          <Icon name="Remove" />
        </Button>
      </Text>
      {fileTree.map((folders) => (
        <RecursiveFolder
          folders={folders}
          setSelectedFolders={(
            ev: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            sFolder: Folder
          ) => setSelectedFolder(handleFolderSelect(ev, fileTree, sFolder))} //folders does not include nestedFolders
          changeFolderName={renameFolder}
          key={folders.id}
        />
      ))}
    </div>
  );
};
