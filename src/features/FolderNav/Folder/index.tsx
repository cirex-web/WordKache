import { Text } from "../../../components/Text";
import { FileDirectory } from "../../../types";
import css from "./folder.module.css";
export const RecursiveFolder = ({ folders }: { folders: FileDirectory }) => {
  return (
    <>
      <li className={css.folder}>
        <div className={css.folderName}>
          <Text type="paragraph" noWrap>
            {folders.name}
          </Text>
        </div>
        {folders.subFolders && (
          <ul className={css.children}>
            {folders.subFolders.map((folders, i) => (
              <RecursiveFolder folders={folders} key={i} />
            ))}
          </ul>
        )}
      </li>
    </>
  );
};
