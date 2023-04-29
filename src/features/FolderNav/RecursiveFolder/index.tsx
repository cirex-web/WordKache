import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { FileDirectory } from "../../../types";
import css from "./index.module.css";

export const RecursiveFolder = ({
  folders,
  depth = 0,
  onHeightChange,
}: {
  folders: FileDirectory;
  depth?: number;
  onHeightChange?: (delta: number) => void;
}) => {
  const subfolderRef = useRef<HTMLUListElement>(null);

  const [subfolderHeight, setSubFolderHeight] = useState(0);
  const [active, setActive] = useState(!!folders.open);

  const updateHeight = useCallback(
    (delta: number) => {
      // console.log("Updating height for", folders.name, delta);
      setSubFolderHeight((prevHeight) => prevHeight + delta);
      if (onHeightChange) onHeightChange(delta); //propagate upwards
    },
    [onHeightChange]
  );

  useLayoutEffect(() => {
    setTimeout(() => {
      const subfolder = subfolderRef.current;
      if (subfolder) {
        console.log("init height!", subfolder.scrollHeight);
        setSubFolderHeight(subfolder.scrollHeight);
      }
    }, 500); //wait for font loading/dimension final updates
  }, [subfolderRef]);

  return (
    <li className={css.folder}>
      <Text
        type="paragraph"
        noWrap
        className={css.folderName}
        style={{ paddingLeft: depth * 12 }} //12 just looks good, okay?
        noSelect
      >
        <span></span>
        <Icon
          name="expand_more"
          style={{
            opacity: folders.subFolders?.length ? 1 : 0,
            transform: `rotate(${active ? 0 : -90}deg)`,
            transition: ".2s transform",
            pointerEvents: folders.subFolders?.length ? "auto" : "none",
          }}
          onMouseDown={() => {
            setActive((active) => !active);
            const newActive = !active; //setActive doesn't update active in this loop
            if (onHeightChange)
              onHeightChange((newActive ? 1 : -1) * subfolderHeight); //call parent folder to notify
          }}
        />
        <Text noWrap>{folders.name}</Text>
      </Text>

      {folders.subFolders && (
        <ul
          ref={subfolderRef}
          style={{
            height: active
              ? subfolderHeight === 0
                ? "auto"
                : subfolderHeight
              : 0,
          }}
          className={css.children}
        >
          {folders.subFolders.map((folders, i) => (
            <RecursiveFolder
              folders={folders}
              key={i}
              depth={depth + 1}
              onHeightChange={updateHeight}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
