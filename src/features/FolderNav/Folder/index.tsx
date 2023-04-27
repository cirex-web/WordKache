import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { FileDirectory } from "../../../types";
import css from "./folder.module.css";
export const RecursiveFolder = ({
  folders,
  depth = 0,
}: {
  folders: FileDirectory;
  depth?: number;
}) => {
  return (
    <>
      <li className={css.folder}>
        {/* <div style={{ paddingLeft: depth * 20 }}> */}
          <Text type="paragraph" noWrap className={css.folderName}>
            <Icon name="expand_more" />
            {folders.name}
          </Text>
        {/* </div> */}

        {folders.subFolders && (
          <ul className={css.children}>
            {folders.subFolders.map((folders, i) => (
              <RecursiveFolder folders={folders} key={i} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    </>
  );
};
