import { Folder } from "../../../types/storageTypes";
import ISO6391 from "iso-639-1";

const verifyLanguage = (lang: string) => {

    const matches = [...lang.match(/[\w]+/g) ?? []]; //the result returned from match has some extra things attached
    return matches?.every((match) => ISO6391.validate(match)) ? matches : undefined;
}

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
                placeholder: "Example: en/es",
                parse: verifyLanguage,
                defaultValue: ""
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
                defaultValue: "",
            }],
            displayName: "Back Language(s)",
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
                placeholder: "# of Characters",
                parse: (text: string) => text.match(/^[\d]+$/) ? parseInt(text) : undefined,
                defaultValue: "",
            },
            ],
            displayName: "Length",
            required: false
        }
    ];
