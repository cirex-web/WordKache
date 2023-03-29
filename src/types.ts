export interface Word{
    word:string,
    lang:"en"|"es"
}
export interface WordEntry{
    front:Word,
    back:Word
}
export type WordList = WordEntry[]

