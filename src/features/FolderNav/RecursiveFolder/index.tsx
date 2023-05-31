import React, { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import css from "./index.module.scss";
import { FileDirectory } from "../../../types/folderTypes";
import { Input } from "../../../components/Input";
import classNames from "classnames/bind";
import { Collapse } from "../../../components/Collapse";
import { useFolderContext } from "../../../contexts/FolderProvider";
import { useFolderNavContext } from "../../../contexts/FolderNavProvider";

export const RecursiveFolder = ({
  folder,
  depth = 0,
}: {
  folder: FileDirectory;
  depth?: number;
}) => {
  const { toggleFolderOpen, renameFolder, moveFolder } = useFolderContext();
  const {
    handleFolderSelect,
    activeFolderId,
    selectedFolderIds,
    setActiveFolderId,
  } = useFolderNavContext();

  const [bottomBorder, setBottomBorder] = useState(false);
  const subfolderOpen = !!folder.open;
  const active = activeFolderId === folder.id;
  const selected = selectedFolderIds?.includes(folder.id);
  const nameChangeRef = React.useRef(false);

  return (
    <div
      onDrop={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setBottomBorder(false);
        moveFolder(ev.dataTransfer.getData("source"), folder.id);
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
      <li>
        <Text
          type="subheading"
          className={classNames.bind(css)("folderName", {
            activeFolderName: active,
            selectedFolderName: selected,
          })}
          noSelect
          style={{ paddingLeft: depth * 12 + 10 }}
          onMouseDown={(ev) => {
            if ((ev.ctrlKey || ev.metaKey) && activeFolderId === folder.id)
              setActiveFolderId("");
            else setActiveFolderId(folder.id);

            handleFolderSelect(ev, folder.id);
            nameChangeRef.current =
              ev.detail >= 2 && folder.id !== "root"
                ? true //TODO:
                : nameChangeRef.current;
          }}
          onMouseLeave={() => {
            nameChangeRef.current = false;
          }}
          draggable="true"
          disabled={nameChangeRef.current}
          onDragStart={(ev) => ev.dataTransfer.setData("source", folder.id)}
        >
          <Icon
            name="expand_more"
            style={{
              opacity: folder.subFolders?.length ? 1 : 0,
              pointerEvents: folder.subFolders?.length ? "auto" : "none",
              transform: `rotate(${subfolderOpen ? 0 : -90}deg)`,
              transition: ".2s transform",
            }}
            onMouseDown={() => {
              toggleFolderOpen(folder.id);
            }}
          />
          {nameChangeRef.current ? (
            <Input
              placeholder={folder.name}
              className={css.input}
              onChange={(ev) => renameFolder(ev.currentTarget.value, folder.id)}
            />
          ) : (
            <Text noWrap>{folder.name}</Text>
          )}
        </Text>

        {folder.subFolders && (
          <Collapse open={subfolderOpen}>
            <ul>
              {folder.subFolders.map((folder) => (
                <RecursiveFolder
                  folder={folder}
                  key={folder.id}
                  depth={depth + 1}
                />
              ))}
            </ul>
          </Collapse>
        )}
      </li>
    </div>
  );
};
