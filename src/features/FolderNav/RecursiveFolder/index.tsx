import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
import { FileDirectory } from "../types";
import { UseActiveFolderContext, UseSelectedFolderContext } from "../../App";
import { Input } from "../../../components/Input";


export const RecursiveFolder = ({
  folders: folder,
  setSelectedFolders: selectFolders,
  changeFolderName: changeName,
  moveFolder: moveFolder,
  depth = 0,
  onHeightChange,
}: {
  folders: FileDirectory;
  setSelectedFolders: Function;
  changeFolderName: Function;
  moveFolder: Function;
  depth?: number;
  onHeightChange?: (delta: number) => void;
}) => {
  const subfolderRef = useRef<HTMLUListElement>(null);
  const { activeFolder, setActiveFolder } = UseActiveFolderContext();
  const { selectedFolder } = UseSelectedFolderContext();
  const [subfolderHeight, setSubFolderHeight] = useState(0);
  const [subfolderOpen, setSubfolderOpen] = useState(!!folder.open);
  const [bottomBorder, setBottomBorder] = React.useState(false);
  const active = activeFolder.id === folder.id;
  const selected = selectedFolder?.some((f) => f.id === folder.id);
  const nameChangeRef = React.useRef(false);
  let dragCounter = 0;
  folder.open = subfolderOpen;

  const updateHeight = useCallback(
    (delta: number) => {
      // console.log("Updating height for", folder.name, delta);
      setSubFolderHeight((prevHeight) => prevHeight + delta);
      if (onHeightChange) onHeightChange(delta); //propagate upwards
    },
    [onHeightChange]
  );


  useLayoutEffect(() => {
    setTimeout(() => {
      const subfolder = subfolderRef.current;
      if (subfolder) {
        // console.log("init height!", subfolder.scrollHeight);
        setSubFolderHeight(subfolder.scrollHeight);
      }
    }, 500); //wait for font loading/dimension final updates
  }, [subfolderRef]);

  return (
    <div className="droppable"
      onDrop={(ev) => { ev.stopPropagation(); ev.preventDefault(); setBottomBorder(false); moveFolder(ev.dataTransfer.getData("source"), folder.id) }}
      onDragOver={(ev) => { ev.stopPropagation(); ev.preventDefault(); setBottomBorder(true) }}
      style={{ borderBottom: bottomBorder ? "2px solid #ffffff" : "none" }}
      onDragLeave={(ev) => { ev.stopPropagation(); ev.preventDefault(); if(!dragCounter) setBottomBorder(false)}}
    >

      <li className={css.folder}>
        <Text
          type="subheading"
          className={active ? css.activeFolderName : selected ? css.selectedFolderName : css.folderName}
          style={{ paddingLeft: depth * 12 }} //12px looks pretty good
          noSelect
          onMouseDown={(ev) => {
            setActiveFolder(folder);
            selectFolders(ev, folder);
            nameChangeRef.current = (ev.detail >= 2 && folder.id !== "root" && folder.id !== "defaultFolder") ? true : nameChangeRef.current;
          }}
          onMouseLeave={() => { nameChangeRef.current = false }}
          draggable="true"
          disabled={nameChangeRef.current}
          onDragStart={(ev) => (ev.dataTransfer.setData("source", folder.id))}
        >
          <Icon
            name="expand_more"
            style={{
              opacity: folder.subFolders?.length ? 1 : 0,
              transform: `rotate(${subfolderOpen ? 0 : -90}deg)`,
              transition: ".2s transform",
              pointerEvents: folder.subFolders?.length ? "auto" : "none",
            }}
            onMouseDown={(ev) => {
              const newActive = !subfolderOpen; //setActive doesn't update active in this loop
              setSubfolderOpen(newActive);
              if (onHeightChange)
                onHeightChange((newActive ? 1 : -1) * subfolderHeight); //call parent folder to notify height change
              ev.stopPropagation();
            }}
          />
          {nameChangeRef.current ? <Input placeholder={folder.name} className={css.input} onChange={(ev) => changeName(ev.currentTarget.value, folder.id)} /> : <Text noWrap>{folder.name}</Text>}
        </Text>

        {folder.subFolders && (
          <ul
            ref={subfolderRef}
            style={{
              height: subfolderOpen
                ? subfolderHeight === 0 //first height run-through hasn't started yet...
                  ? "auto"
                  : subfolderHeight
                : 0,
            }}
            className={css.children}
          >
            {folder.subFolders.map((folder, i) => (
              <RecursiveFolder
                folders={folder}
                setSelectedFolders={selectFolders}
                changeFolderName={changeName}
                moveFolder={moveFolder}
                key={folder.id}
                depth={depth + 1}
                onHeightChange={updateHeight}
              />
            ))}
          </ul>
        )}
      </li>
    </div>
  );
};
