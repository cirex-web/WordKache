type Lang = 'en' | 'es' | string;

export interface Word {
    text: string,
    lang: Lang
}

export interface WordEntry {
    front: Word,
    back: Word
}
export interface Card {
    front: Word,
    back: Word
}
export type WordList = WordEntry[]

export interface FileDirectory {
    name: string,
    subFolders?: FileDirectory[]
}
export type AllFiles = FileDirectory[]