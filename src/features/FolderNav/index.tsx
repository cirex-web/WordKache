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

const dirToFolder = (dir: FileDirectory, parentId: string | undefined): Folder => {
  const folder: Folder = {
    parentId: parentId,
    name: dir.name,
    id: dir.id,
  };
  return folder;
};

const unpackFolders = (dirs: FileDirectory[], ignoreVisibility: boolean = false, parentId: string | undefined = undefined): Folder[] => {
  //Cool if you could use flatmap alternative
  const foldersCopy = [];
  for (const dir of dirs) {
    foldersCopy.push(dirToFolder(dir, parentId));
    if (dir.subFolders && (dir.open || ignoreVisibility)) {
      foldersCopy.push(...unpackFolders(dir.subFolders, ignoreVisibility, dir.id));
    }
  }
  return foldersCopy;
};


export const FolderNav = ({ folders, addFolder, deleteFolder, renameFolder, changeOrder}: 
  { 
    folders: Folder[], 
    addFolder: (fileName:string) => void, 
    deleteFolder: () => void, 
    renameFolder: (fileName:string, fileId: string) => void, 
    changeOrder: (fileOrder: Folder[]) => void}) => {

  const fileTree: FileDirectory[] = [
    JustCollectedFolder, //the un-deletable folder >:D
    ...generateTreeStructure(folders),
  ];
  const { selectedFolder, setSelectedFolder } = UseSelectedFolderContext();
  const pivotPointRef = React.useRef(0);

  const handleFolderSelect = (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>, folders: FileDirectory[], folder: FileDirectory) => {
    const unpackedFolders = unpackFolders(fileTree);
    const folderIds = unpackedFolders.map((folder) => folder.id);
    const activeFolderIds = selectedFolder.map((folder) => folder.id);
    const selectedIds = handleRowSelect(ev, folder.id, folderIds, activeFolderIds, pivotPointRef);
    return unpackedFolders.filter((cfolder) => selectedIds.includes(cfolder.id))
  }

  const moveFolder = (source: string, target: string) => {

    const unpackedFolders = unpackFolders(fileTree.filter((dir) => (dir.id !== "root")), true);
    if(target === source) return unpackedFolders;
    const sourceFolder = unpackedFolders.find((folder) => folder.id === source);
    if (sourceFolder === undefined) return unpackedFolders;
    if (target === 'root') return unpackedFolders; //root is not a folder

    let folderCopy:Folder[] = [];

    for(const folder of unpackedFolders){
      if(folder.id === source )//dependencies.some((dependency) => dependency.id === folder.id) || )
        continue;
      if(folder.id === target){
        sourceFolder.parentId = folder.parentId;
        folderCopy.push(folder, sourceFolder);
      }
      else
        folderCopy.push(folder);
    }
    return folderCopy;
  }

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
        <RecursiveFolder folders={folders} 
          setSelectedFolders={(ev: React.MouseEvent<HTMLSpanElement, MouseEvent>, sFolder: Folder) => setSelectedFolder(handleFolderSelect(ev, fileTree, sFolder))} //folders does not include nestedFolders 
          changeFolderName={renameFolder} 
          moveFolder={(src: string, dest: string) => changeOrder(moveFolder(src, dest))
          }
          key={folders.id} />
      ))}
    </div>
  );
};
