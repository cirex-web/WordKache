import { useEffect, useRef, useState } from "react";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { FileDirectory } from "../../../types";
import css from "./index.module.css";
export const RecursiveFolder = ({
  folders,
  depth = 0,
}: {
  folders: FileDirectory;
  depth?: number;
}) => {
  const subfolderRef = useRef<HTMLUListElement>(null);
  const [subfolderHeight, setSubFolderHeight] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (subfolderRef.current) {
      setSubFolderHeight(subfolderRef.current?.scrollHeight);
    }
  }, []);
  return (
    <li className={css.folder}>
      <Text
        type="paragraph"
        noWrap
        className={css.folderName}
        style={{ paddingLeft: depth * 20 }}
        onClick={() => setActive(!active)}
      >
        <Icon
          name="expand_more"
          style={{
            opacity: folders.subFolders?.length ? 1 : 0,
            transform: `rotate(${active ? 0 : -90}deg)`,
          }}
        />
        <Text noWrap>{folders.name}</Text>
      </Text>

      {folders.subFolders && (
        <ul
          className={css.children}
          ref={subfolderRef}
          style={{ height: active ? "auto" : 0 }}
        >
          {folders.subFolders.map((folders, i) => (
            <RecursiveFolder folders={folders} key={i} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};
