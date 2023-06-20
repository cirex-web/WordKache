import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { useFolderContext } from "../../contexts/FolderProvider";
import { useFolderNavContext } from "../../contexts/FolderNavProvider";
import { RecursiveFolder, RecursiveFolderPlaceholder } from "./RecursiveFolder";

const generateFolderPlaceholder = (folderCount: number) => {
  const FolderPlaceholder: React.ReactNode[] = [];
  for (let i = 0; i < folderCount; i++) {
    FolderPlaceholder.push(<RecursiveFolderPlaceholder key={i} />);
  }
  return FolderPlaceholder;
};
export const FolderNav = () => {
  const { tree: fileTree, addFolder, deleteFolders } = useFolderContext();
  const { selectedFolderIds, activeFolderId } = useFolderNavContext();

  return (
    <div className={css.container}>
      <Text type="heading" bold className={css.title}>
        <Icon name="folder" />
        Folders
        <Text type="xLargeHeading" className={css.buttonContainer}>
          <Button
            onMouseDown={() => addFolder("New Folder", activeFolderId)}
            zoomOnHover
          >
            <Icon name="Add" />
          </Button>
          <Button
            onMouseDown={() => deleteFolders(selectedFolderIds)}
            zoomOnHover
          >
            <Icon name="Remove" />
          </Button>
        </Text>
      </Text>
      <ul className={css.folders}>
        {fileTree.length === 0
          ? generateFolderPlaceholder(3)
          : fileTree.map((folders) => (
              <RecursiveFolder folder={folders} key={folders.id} />
            ))}
      </ul>
    </div>
  );
};
