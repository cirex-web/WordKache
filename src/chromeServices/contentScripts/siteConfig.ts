import { ISiteConfig } from "../types";

export const siteConfigs: ISiteConfig[] = [
    {
        "urlChecks": {
            "urlParams": {
                "op": "translate"
            },
            "host": "translate.google.com",
        },
        "input": {
            getTextBox: (body) => body.querySelector(`textarea`),
            text: {
                type: "DOM",
                js: (body) => body.querySelector(`[jsname="lKng5e"]`)?.textContent ?? ""
            },
            "lang": {
                "type": "DOM",
                "js":
                    (body) => {
                        const matches = body.querySelectorAll('[aria-selected="true"] [jsname="V67aGc"]');
                        console.assert(matches.length);
                        return (matches[0].textContent ?? "").split(" ")[0];
                    }

            }

        },
        "output": {
            "lang": {
                "type": "URL_PARAM",
                "param": "tl"
            },
            text: {
                "type": "DOM",
                js: (body) => body.querySelector(`[class="ryNqvb"]`)?.textContent ?? "",

            }
        }
    },
    // {
    //     urlChecks: {
    //         host: "www.deepl.com"
    //     },
    //     input: {
    //         lang: {
    //             type: "URL_REGEX",
    //             regex: "#(.*?)\/"
    //         },
    //         getTextBox: (body) => body.querySelector("d-textarea")
    //     },
    //     output: {
    //         lang: {
    //             type: "URL_REGEX",
    //             regex: "#.*\/(.+?)\/"
    //         },
    //         text: {
    //             type: "DOM",
    //             js: (body) => body.querySelectorAll("d-textarea")[1]?.textContent ?? ""
    //         }

    //     }

    // }
];
