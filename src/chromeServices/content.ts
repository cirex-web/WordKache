console.log("what's up?")
type scrapeMethod = {
    type: "URL",
    regex: string
} | {
    type: "URL",
    param: string
} | {
    type: "DOM",
    js: string //given DOM element, return desired string
};

interface Config {
    domain: string,
    domainChecks?: {
        subpage?: string,
        urlParams?: {}[]
    }
    input: {
        text: scrapeMethod,
        lang: scrapeMethod
    },
    output: {
        lang: scrapeMethod
    }
};

const config: Config[] = [
    {
        "domain": "translate.google.com",
        "domainChecks": {
            "urlParams": {
                "op": "translate" //TODO: match a generic obj ts I forgot
            }
        },
        "input": {
            "text": {
                "type": "URL",
                "param": "text"
            },

            "lang": {
                "type": "DOM",
                "js": `
                (body)=>{
                    body.querySelectorAll('[aria-selected="true"] [jsname="V67aGc"]')[0].textContent.split(" ")[0]
                }
                `
            }

        },
        output: {
            "lang": {
                "type": "URL",
                "param": "tl"
            }
        }
    }
];
export { }