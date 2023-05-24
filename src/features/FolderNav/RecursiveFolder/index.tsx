import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import css from "./index.module.css";
import { FileDirectory } from "../../../types/folderTypes";
import { Input } from "../../../components/Input";
import { UseFolderContext } from "../../App";

export const RecursiveFolder = ({
  folders,
  setSelectedFolders: selectFolders,
  changeFolderName: changeName,
  moveFolder,
  depth = 0,
  onHeightChange,
}: {
  folders: FileDirectory;
  setSelectedFolders: (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    folder: string
  ) => void;
  changeFolderName: (fileName: string, folderId: string) => void;
  moveFolder: (src: string, dest: string) => void;
  depth?: number;
  onHeightChange?: (delta: number) => void;
}) => {
  const subfolderRef = useRef<HTMLUListElement>(null);
  const { selectedFolderIds, activeFolderId, setActiveFolderId } =
    UseFolderContext();
  const [subfolderHeight, setSubFolderHeight] = useState(0);
  const [subfolderOpen, setSubfolderOpen] = useState(!!folders.open);

  const [bottomBorder, setBottomBorder] = React.useState(false);

  const active = activeFolderId === folders.id;
  const selected = selectedFolderIds?.includes(folders.id);
  const nameChangeRef = React.useRef(false);

  folders.open = subfolderOpen; //TODO: should update the entire folders obj (cuz it's a state a think)
  useEffect(() => { }, [subfolderOpen]);

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
    <div
      className="droppable"
      onDrop={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setBottomBorder(false);
        moveFolder(ev.dataTransfer.getData("source"), folders.id);
      }}
      onDragOver={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setBottomBorder(true);
      }}
      style={{ borderBottom: bottomBorder ? "2px solid #ffffff" : "none" }}
      onDragLeave={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setBottomBorder(false);
      }}
    >
      <li className={css.folder}>
        <Text
          type="subheading"
          className={
            active
              ? css.activeFolderName
              : selected
                ? css.selectedFolderName
                : css.folderName
          }
          noSelect
          style={{ paddingLeft: depth * 12 }} //idk who deleted it
          onMouseDown={(ev) => {
            if ((ev.ctrlKey || ev.metaKey) && activeFolderId === folders.id)
              setActiveFolderId("");
            else
              setActiveFolderId(folders.id);

            selectFolders(ev, folders.id);
            nameChangeRef.current =
              ev.detail >= 2 &&
                folders.id !== "root" &&
                folders.id !== "defaultFolder"
                ? true
                : nameChangeRef.current;
          }}
          onMouseLeave={() => {
            nameChangeRef.current = false;
          }}
          draggable="true"
          disabled={nameChangeRef.current}
          onDragStart={(ev) => ev.dataTransfer.setData("source", folders.id)}
        >
          <Icon
            name="expand_more"
            style={{
              opacity: folders.subFolders?.length ? 1 : 0,
              transform: `rotate(${subfolderOpen ? 0 : -90}deg)`,
              transition: ".2s transform",
              pointerEvents: folders.subFolders?.length ? "auto" : "none",
            }}
            onMouseDown={(ev) => {
              const newActive = !subfolderOpen; //setActive doesn't update active in this loop
              setSubfolderOpen(newActive);
              if (onHeightChange)
                onHeightChange((newActive ? 1 : -1) * subfolderHeight); //call parent folder to notify height change
              ev.stopPropagation();
            }}
          />
          {nameChangeRef.current ? (
            <Input
              placeholder={folders.name}
              className={css.input}
              onChange={(ev) => changeName(ev.currentTarget.value, folders.id)}
            />
          ) : (
            <Text noWrap>{folders.name}</Text>
          )}
        </Text>

        {folders.subFolders && (
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
            {folders.subFolders.map((folder, i) => (
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
