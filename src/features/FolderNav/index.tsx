import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { useFolderContext } from "../../contexts/FolderProvider";
import { useFolderNavContext } from "../../contexts/FolderNavProvider";
import { RecursiveFolder } from "./RecursiveFolder";

export const FolderNav = () => {
  const { tree: fileTree, addFolder, deleteFolders } = useFolderContext();
  const { selectedFolderIds, activeFolderId } = useFolderNavContext();
  console.log(fileTree);
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
      {fileTree.map((folders) => (
        <RecursiveFolder folder={folders} key={folders.id} />
      ))}
    </div>
  );
};
