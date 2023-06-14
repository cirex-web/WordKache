export interface FileDirectory {
    name: string,
    id: string
    open?: boolean,
    subFolders?: FileDirectory[]
}
export type AllFolders = FileDirectory[]