import { Folder } from "../../../types/storageTypes";
import ISO6391 from "iso-639-1";


type ISingleInput = (
    | {
        type: "input";
        /** Should return either the parsed result or null (if failed parsing). */
        parse: (text: string) => unknown;
        placeholder: string;
        /** Must be a valid result that can be directly stored in storage */
        defaultValue?: string;
    }
    | {
        type: "select";
        options: { value: string; text: string }[];
    }
) & {
    name: string;
}

const verifyLanguage = (lang: string) => {
    const matches = [...lang.match(/[\w]+/g) ?? []].map(lang => { const code = ISO6391.getCode(lang.toLowerCase()); return code.length === 0 ? lang : code });

    return matches?.every((match) => ISO6391.validate(match)) ? matches : null;
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
                options: folders.map((folder) => {
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
                placeholder: "Example: en/es",
                parse: verifyLanguage,
            }],
            displayName: "Front Language(s)",
            required: false
        },

        {
            inputs: [{
                type: "input",
                name: "backLang",
                placeholder: "Example: en/es",
                parse: verifyLanguage,
            }],
            displayName: "Back Language(s)",
            required: false
        },

        {
            inputs: [{
                type: "input",
                name: "words",
                placeholder: "Separate With Spaces",
                parse: (text: string): String[] => text.trim().split(" ").filter(word => word.length > 0),
            }],
            displayName: "Has Words",
            required: false
        },
        {
            inputs: [{
                type: "select",
                name: "lengthDirection",
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
                placeholder: "# of Chars",
                parse: (text: string) => text.match(/^[\d]+$/) ? parseInt(text) : null,
            },
            ],
            displayName: "Length",
            required: false
        }
    ];
