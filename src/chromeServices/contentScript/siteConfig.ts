import { ISiteConfig } from "../types";

/** Note: All return statements from here should be sanitized (to match network requests) by default. Only languages will be converted in the backend into their two-letter counterparts. */
export const siteConfigs: ISiteConfig[] = [
    {
        name: "Google Translate",
        "urlChecks": {
            "urlParams": {
                "op": "translate"
            },
            "host": "translate.google.com",
        },
        input: {
            getTextBox: (body) => body.querySelector(`textarea`),
            text: {
                type: "DOM",
                js: (body) => body.querySelector(`[jsname="lKng5e"]`)?.textContent?.trim() ?? ""
            },
            lang: {
                type: "DOM",
                js:
                    (body) => {
                        const matches = body.querySelectorAll('[aria-selected="true"] [jsname="V67aGc"]');
                        console.assert(matches.length);
                        return (matches[0].textContent ?? "").split(" - ")[0];
                    }
            }

        },
        output: {
            lang: {
                type: "URL_PARAM",
                param: "tl"
            },
            text: {
                type: "DOM",
                js: (body) => body.querySelector(`[class="ryNqvb"]`)?.textContent?.trim() ?? "",

            }
        }
    },
    {
        name: "DeepL",
        urlChecks: {
            host: "www.deepl.com"
        },
        input: {
            lang: {
                type: "DOM",
                js: (body) => {
                    return body.querySelector("d-textarea[data-testid='translator-source-input']")?.getAttribute("lang")?.split("-")[0] ?? "";
                }
            },

            getTextBox: (body) => body.querySelector(`[aria-labelledby="translation-source-heading"][role="textbox"]`)
        },
        output: {
            lang: {
                type: "DOM",
                js: (body) => body.querySelector("d-textarea[data-testid='translator-target-input']")?.getAttribute("lang")?.split("-")[0] ?? ""
            },
            text: {
                type: "DOM",
                js: (body) => body.querySelector(`d-textarea[data-testid='translator-target-input']`)?.textContent?.trim() ?? ""
            }

        },
        validate: () => {
            return !document.getElementById("dl_translator")?.classList.contains("lmt--active_translation_request");
        }

    },
    {
        name: "Google Translate",
        urlChecks: {
            host: "www.google.com",
        },
        input: {
            getTextBox: (body) => body.querySelector(`#tw-source-text-ta`),
            text: {
                type: "DOM",
                js: (body) => (body.querySelector("#tw-source-text-ta") as HTMLTextAreaElement)?.value?.trim() ?? ""
            },
            lang: {
                type: "DOM",
                js:
                    (body) => body.querySelector(`#tw-source-text-ta`)?.attributes?.getNamedItem("lang")?.value ?? ""
            }
        },
        output: {
            lang: {
                type: "DOM",
                js: (body) => body.querySelector("#tw-target-text")?.children[0]?.attributes.getNamedItem("lang")?.value ?? "",
            },
            text: {
                type: "DOM",
                js: (body) => body.querySelector("#tw-target-text")?.textContent?.trim() ?? "",
            }
        }
    }
];
