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
        <div
          className={css.folderName}
          style={{ paddingLeft: 20 * depth + 10 }}
        >
          <Text type="paragraph" noWrap>
            {folders.name}
          </Text>
        </div>
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
