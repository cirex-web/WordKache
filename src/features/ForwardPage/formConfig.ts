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

export const getFormConfig = (folders: Folder[]) => 
    [
        {
            type: "select",
            name: "destination",
            displayName: "Destination",
            defaultValue: "root",
            childrenOptions?: undefined,
            options: folders
                //.filter((folder) => folder.id !== "root")
                .map((folder) => {
                    return { value: folder.id, text: folder.name };
                }),
            required: true,
        },
        {
            type: "input",
            name: "frontLang",
            displayName: "Front Language",
            parse: verifyLanguage,
            defaultValue: "",
            required: false
        },
        {
            type: "input",
            name: "backLang",
            displayName: "Back Language",
            parse: verifyLanguage,
            defaultValue: "",
            required: false
        },
        {
            type: "input",
            name: "words",
            displayName: "Has Words",
            parse: (text: string): String[] => text.split(" "),
            defaultValue: "",
            required: false
        },
        {
            type: "select",
            name: "lengthDirection",
            displayName: "Comparison",
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
            required: false
        },
        {
            type: "input",
            name: "length",
            displayName: "Length",
            parse: (text: string) => parseInt(text) || undefined,
            defaultValue: "",
            required: false
        },
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
    childrenOptions?: [];
    name: string;
    displayName: string;
    required?: boolean;
})[];
