type Lang = 'en' | 'es' | string;

export interface Word {
    text: string,
    lang: Lang
}

/** Official Storage Type */
export interface Card {
    front: Word,
    back: Word,
    location: string;
    id: string;
    timeCreated: number;
    source: string;
}

/** Official Storage Type */
export interface Folder {
    parentId?: string, //undefined means that it's top-level
    name: string,
    id: string
}
