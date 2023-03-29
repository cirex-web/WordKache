
console.log("Wordable Content script running!")
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
    urlChecks: {
        host: string,
        subpage?: string,
        urlParams?: { [key: string]: (string | number) }
    }
    input: {
        text: scrapeMethod,
        lang: scrapeMethod
    },
    output: {
        lang: scrapeMethod
    }
};

const configs: Config[] = [
    {
        "urlChecks": {
            "urlParams": {
                op: "translate"
            },
            "host": "translate.google.com",
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
        "output": {
            "lang": {
                "type": "URL",
                "param": "tl"
            }
        }
    }
];

const _isValidTranslatorURL = (url: URL, translatorConfig: Config) => {
    const checks = translatorConfig.urlChecks;
    if (checks.host !== url.hostname) return false;
    for (const [key, value] of Object.entries(checks.urlParams ?? {})) {
        if (url.searchParams.get(key) !== value) {
            return false;
        };
    }
    if (checks.subpage && checks.subpage !== url.pathname) return false;
    return true;

}
const isValidTranslatorURL = () => {
    const url = new URL(window.location.href);

    for (const translatorConfig of configs) {
        if (_isValidTranslatorURL(url, translatorConfig)) return true;
    }
    return false;
}
setInterval(()=>console.log(isValidTranslatorURL()),1000); //for internal redirects or whatever
export {}