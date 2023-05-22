import { Folder } from "../../types/storageTypes";
import ISO6391 from "iso-639-1";

const verifyLanguage = (lang: string): string[] | undefined => {
    const rgx = new RegExp("[\w]{2}").exec(lang);
    return rgx === null
        ? undefined
        : rgx.some((match) => ISO6391.validate(match))
            ? rgx.filter((match) => ISO6391.validate(match))
            : undefined;
};

export const getFormConfig = (folders: Folder[]) => [
    [
        {
            type: "select",
            name: "destination",
            defaultValue: "root",
            options: folders
                .filter((folder) => folder.id !== "root")
                .map((folder) => {
                    return { value: folder.id, text: folder.name };
                }),
        },
        {
            type: "input",
            name: "frontLang",
            parse: verifyLanguage,
            defaultValue: "",
        },
        {
            type: "input",
            name: "backLang",
            parse: verifyLanguage,
            defaultValue: "",
        },
        {
            type: "input",
            name: "words",
            parse: (text: string): String[] => text.split(" "),
            defaultValue: "",
        },
        {
            type: "select",
            name: "lengthDirection",
            defaultValue: "greater",
            options: [
                {
                    value: "greater",
                    text: "greater than",
                },
                {
                    value: "less",
                    text: "less than",
                },
            ],
        },
        {
            type: "input",
            name: "length",
            parse: (text: string) => parseInt(text) || undefined,
            defaultValue: "",
        },
    ],
] satisfies ((
    | {
        type: "input";
        parse: (text: string) => unknown;
    }
    | {
        type: "select";
        options: { value: string; text: string }[];
    }
) & {
    defaultValue: string;
    name: string;
    required?: boolean;
})[][];
