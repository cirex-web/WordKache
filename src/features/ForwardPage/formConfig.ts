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

type ISingleInput = (
    | {
        type: "input";
        parse: (text: string) => unknown;
        placeholder: string;
    }
    | {
        type: "select";
        options: { value: string; text: string }[];
    }
) & {
    defaultValue: string;
    name: string;
}
export const getFormConfig = (folders: Folder[]): {
    inputs: ISingleInput[],
    displayName: string,
    required?: boolean,
}[] =>
[
    {
        inputs: [{
            type: "select",
            name: "destination",
            defaultValue: "root",
            options: folders
                //.filter((folder) => folder.id !== "root")
                .map((folder) => {
                    return { value: folder.id, text: folder.name };
                })
        }],
        displayName: "Destination",
        required: true
    },
    {
        inputs: [{
            type: "input",
            name: "frontLang",
            placeholder: "ISO6391 2 digit standard",
            parse: verifyLanguage,
            defaultValue: ""
        }],
        displayName: "Front Language",
        required: false
    },

    {
        inputs: [{
            type: "input",
            name: "backLang",
            placeholder: "ISO6391 2 digit standard",
            parse: verifyLanguage,
            defaultValue: "",
        }],
        displayName: "Back Language",
        required: false
    },

    {
        inputs: [{
            type: "input",
            name: "words",
            placeholder: "Separate With Spaces",
            parse: (text: string): String[] => text.split(" "),
            defaultValue: "",
        }],
        displayName: "Has Words",
        required: false
    },
    {
        inputs: [{
            type: "select",
            name: "lengthDirection",
            defaultValue: "greater",
            options: [
                {
                    value: "greater",
                    text: "Greater Than",
                },
                {
                    value: "less",
                    text: "Less Than",
                },
            ],
        },

        {
            type: "input",
            name: "length",
            placeholder: "Character Count",
            parse: (text: string) => parseInt(text) || undefined,
            defaultValue: "",
        },
        ],
        displayName: "Length",
        required: false
    }
];
