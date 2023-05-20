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
    /** Property for beta testing only. If unset (aka undefined), it is visible */
    hidden?: boolean;
    /** Fake deletion so the testing data is preserved regardless */
    deleted?: boolean;
}

/** Official Storage Type */
export interface Folder {
    parentId?: string, //undefined means that it's top-level
    name: string,
    id: string
}

/** Official Storage Type */
export interface Filter {
    destination: string,
    frontLang?: string[],
    backLang?: string[],
    words?: string[],
    size?: number,
    id: string,
}

export interface FilterDirectory{
    filters: Filter[],
    id: string,
}
