export interface Word {
    word: string,
    lang: "en" | "es",
    location?: string[] //file paths or something
}

export interface WordEntry {
    front: Word,
    back: Word
}
export type WordList = WordEntry[]

export interface FileDirectory {
    name: string,
    subFolders?: FileDirectory[]
}
export type AllFiles = FileDirectory[]