import { nanoid } from "nanoid";
import { AllFolders, FileDirectory } from "../../types/folderTypes";
import { Folder } from "../../types/storageTypes";
import { ChromeStorage, useStorage } from "./storage";

const defaultArray: any[] = [];

export const generateTreeStructure = (folders: Folder[]) => {
    const children = new Map<string, Folder[]>();
    const res: AllFolders = [];
    for (const folder of folders) {
        if (folder.parentId) {
            if (!children.has(folder.parentId)) children.set(folder.parentId, []);
            children.get(folder.parentId)?.push(folder);
        } else {
            res.push({ ...folder });
        }
    }
    const dfs = (fileDir: FileDirectory) => {
        if (children.has(fileDir.id)) {
            fileDir.subFolders = children
                .get(fileDir.id)!
                .map((folder) => dfs({ id: folder.id, name: folder.name }));
        }
        return fileDir;
    };
    return res.map((fileDir: FileDirectory) => dfs(fileDir));
};

export const getOrderedFolderIds = (

    dirs: FileDirectory[],
    ignoreVisibility: boolean = false
): string[] => {
    const foldersCopy: string[] = [];
    for (const dir of dirs) {
        foldersCopy.push(dir.id);
        if (dir.subFolders && (dir.open || ignoreVisibility)) {
            foldersCopy.push(
                ...getOrderedFolderIds(dir.subFolders, ignoreVisibility)
            );
        }
    }
    return foldersCopy;
};

/** If you want folder info, don't use this function - use the context hook useFolderContext() instead */
export const useFolders = () => {
    const folders = useStorage<Folder[]>("folders", defaultArray);
    const updateStorage = (newFolders: Folder[]) => {
        ChromeStorage.setPair("folders", newFolders);
    }
    const deleteFolders = (selectedFolderIds: string[]) => {
        if (!folders) return;
        // const newFolders = [];
        // for (let i = 0; i < folders!.length; i++) {
        //     const folder = folders![i];
        //     if (
        //         selectedFolders.map((f) => f.id).includes(folder.id) &&
        //         && folder.id !== "root"
        //     ) {
        //         if (
        //             cards?.some((card) => card.location === folder.id) &&
        //             !window.confirm(
        //                 `Are you sure you want to delete ${fo}? This will delete all cards in this folder.`
        //             )
        //         )
        //             newFolders.push(folder);
        //         else
        //             folders!.map(
        //                 (subFolder) =>
        //                 (subFolder.parentId =
        //                     subFolder.parentId === folder.id
        //                         ? folder.parentId
        //                         : subFolder.parentId)
        //             );
        //     } else newFolders.push(folder);
        // }
        updateStorage(folders.filter(folder => folder.id === "root" || !selectedFolderIds.includes(folder.id)));
    };
    const renameFolder = (folderName: string, folderId: string) => {
        if (!folders) return;
        updateStorage(
            folders.map((folder) => {
                if (folder.id === folderId) folder.name = folderName;
                return folder;
            })
        );
    };
    const addFolder = (folderName: string, parentFolderId?: string) => {
        updateStorage([
            ...(folders ?? []),
            {
                name: folderName,
                id: nanoid(),
                parentId: parentFolderId
            },
        ]);
    };
    // const toggleFolder = (folderId: string, open: boolean) => {
    //     const folderCopy = [...folders ?? []];
    //     folderCopy.find(folder => folder.id === folderId)
    //     updateStorage()
    // }
    /**
     * Make the folder parent ID = target parent ID
     * Source ID placed after target ID
     * @param sourceId
     * @param targetId
     * @returns Nothing
     */
    const moveFolder = (sourceId: string, targetId: string) => {
        if (!folders) return;
        let folderCopy = [...folders];

        const sourceFolder = folderCopy.find(
            (folder) => folder.id === sourceId
        );
        const targetFolder = folderCopy.find(
            (folder) => folder.id === targetId
        );

        console.assert(sourceFolder && targetFolder);
        if (!sourceFolder || !targetFolder) return;

        const sourceIndex = folderCopy.indexOf(sourceFolder);
        const targetIndex = folderCopy.indexOf(targetFolder);

        sourceFolder.parentId = targetFolder.parentId;
        folderCopy.splice(targetIndex + 1, 0, ...folderCopy.splice(sourceIndex, 1)) // Move source folder to after target folder
        updateStorage(folderCopy);
    };
    return { deleteFolders, moveFolder, renameFolder, folders, addFolder }

}