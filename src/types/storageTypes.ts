//WARNING: Changing any of these types will require a database update in the backend for existing users


interface Word {
    text: string,
    lang: string
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
    id: string,
    /** Whether or not it should be open on initial load */
    open?: boolean,
}

/** Official Storage Type */
export interface Filter {
    destination: string,
    frontLang?: string[],
    backLang?: string[],
    words?: string[],
    length?: {
        direction: "greater" | "less",
        number: number;
    },
    id: string,
}

export interface IStorage {
    cards: Card[],
    folders: Folder[],
    filters: Filter[],
    debug?: any,
    userId: string,
    /** null means that you're just on the welcome screen */
    currentlyActiveFolder: string | null
}