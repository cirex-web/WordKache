import { nanoid } from "nanoid";
import { AllFolders, FileDirectory } from "../../types/folderTypes";
import { Folder } from "../../types/storageTypes";
import { ChromeStorage, useStorage } from "./storage";

const defaultArray: Folder[] = [];

const generateTreeStructure = (rootNodes: Folder[], graph: Map<string, Folder[]>) => {

    const finalTree: AllFolders = rootNodes;
    const dfs = (fileDir: FileDirectory) => {
        if (graph.has(fileDir.id)) {
            fileDir.subFolders = graph
                .get(fileDir.id)!
                .map((folder) => dfs({ ...folder }));
        }
        else {
            finalTree.push({ ...fileDir }); //it's a top-level folder
        }
        return fileDir;
    };

    return finalTree.map((fileDir: FileDirectory) => dfs(fileDir));
};

const generateAdjacencyMapFromArray = (folders: Folder[]) => {
    const graph = new Map<string, Folder[]>();
    const rootNodes: Folder[] = [];
    for (const folder of folders) {
        if (folder.parentId) {
            if (!graph.has(folder.parentId)) graph.set(folder.parentId, []);
            graph.get(folder.parentId)?.push(folder);
        } else {
            rootNodes.push(folder);
        }
    }
    return [rootNodes, graph] as const;
}

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

const buildEulerTourMap = (tree: FileDirectory[]) => {
    const idToEulerRange: { [id: string]: { start: number, end: number } } = {};
    let counter = 0;
    const dfs = (a: FileDirectory) => {
        idToEulerRange[a.id] = { start: counter++, end: -1 };
        a.subFolders?.forEach((b) => {
            dfs(b);
        });
        idToEulerRange[a.id].end = counter;
    }
    tree.forEach(root => dfs(root));
    // console.log(idToEulerRange);
    return idToEulerRange;
}

/** If you want folder info, don't use this function - use the context hook useFolderContext() instead */
export const useFolders = () => {
    const folders = useStorage<Folder[]>("folders", defaultArray);
    const folderIdToFolder = folders?.reduce<{ [folderId: string]: Folder }>((obj, folder) => ({ ...obj, [folder.id]: folder }), {});

    console.log(folders);
    const [rootNodes, folderGraph] = generateAdjacencyMapFromArray([...folders ?? []]); //don't modify original cuz that would be bad
    const tree = generateTreeStructure(rootNodes, folderGraph);

    const eulerIntervals = buildEulerTourMap(tree);

    const updateStorage = async (newFolders: Folder[]) => {
        await ChromeStorage.setPair("folders", newFolders);
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

    // const getFolderPath = (folderId: string) => {
    //     folderGraph.g
    // }

    const renameFolder = (folderName: string, folderId: string) => {
        if (!folders) return;
        updateStorage(
            folders.map((folder) => {
                if (folder.id === folderId) folder.name = folderName;
                return folder;
            })
        );
    };
    const toggleFolderOpen = async (folderId: string) => {
        if (!folders) return;
        await updateStorage(folders?.map(folder => {
            return { ...folder, open: folder.id === folderId ? !folder.open : folder.open }
        }));
    }

    // const getPath = ()

    const addFolder = (folderName: string, parentFolderId?: string) => {
        console.log("add", folders);
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
     * @param sourceId (the folder that you want to move)
     * @param targetId (the reference folder)
     * @returns Nothing
     */
    /** Returns if parentId is a parent of childId. Should also return true if the ids are equivalent */
    const _isParent = (parentId: string, childId: string) => {
        const parentInterval = eulerIntervals[parentId];
        const childInterval = eulerIntervals[childId];
        if (!parentInterval || !childInterval) throw new Error("Your Euler tree is broken. Plz fix");
        return parentInterval.start <= childInterval.start && childInterval.end <= parentInterval.end;
    }
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
        if (targetFolder.parentId && _isParent(sourceFolder.id, targetFolder.parentId)) return;

        const sourceIndex = folderCopy.indexOf(sourceFolder);
        const targetIndex = folderCopy.indexOf(targetFolder);

        sourceFolder.parentId = targetFolder.parentId;
        folderCopy.splice(targetIndex + 1, 0, ...folderCopy.splice(sourceIndex, 1)) // Move source folder to right after target folder
        updateStorage(folderCopy);
    };
    return { deleteFolders, moveFolder, renameFolder, folders, addFolder, toggleFolderOpen, tree }

}

