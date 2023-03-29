
console.log("Wordable Content script running!");


let url: URL = new URL("http://undefined");

type scrapeMethod = {
    type: "URL_REGEX",
    regex: string //returned string is the first capture group
} | {
    type: "URL_PARAM",
    param: string
} | {
    type: "DOM",
    js: (body: HTMLElement) => string //function that takes in DOM element and returns desired string
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

const translationSiteConfigurations: Config[] = [
    {
        "urlChecks": {
            "urlParams": {
                "op": "translate"
            },
            "host": "translate.google.com",
        },
        "input": {
            "text": {
                "type": "URL_PARAM",
                "param": "text"
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
            }
        }
    },
    {
        urlChecks:{
            host:"www.deepl.com"
        },
        input:{
            lang:{
                type:"URL_REGEX",
                regex:"#(.*?)\/"
            },
            text:{
                type:"URL_REGEX",
                regex:".*\/(.*)"
            }
        },
        output:{
            lang:{
                type:"URL_REGEX",
                regex:"#.*\/(.+?)\/"
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
const scrapeText = (method: scrapeMethod): string => {
    switch (method.type) {
        case "DOM":
            return method.js(document.body);
        case "URL_PARAM":
            return url.searchParams.get(method.param) ?? "";
        case "URL_REGEX":
            const regex = RegExp(method.regex);
            const matches = regex.exec(decodeURI(url.toString()));
            return matches?.[1] ?? ""; 
    }
}

const getMatchingTranslatorConfig = () => {

    for (const translatorConfig of translationSiteConfigurations) {
        if (_isValidTranslatorURL(url, translatorConfig)) return translatorConfig;
    }
    return null;
}
const obtainCurrentTranslation = () => {
    url = new URL(window.location.href); //should be the only place where url is updated

    if (document.hidden) return; //needs to be the active page (otherwise a waste of resources)
    const translatorConfig = getMatchingTranslatorConfig();
    if (!translatorConfig) return; //not a translation site
    const inputText = scrapeText(translatorConfig.input.text);
    const inputLang = scrapeText(translatorConfig.input.lang);
    const outputLang = scrapeText(translatorConfig.output.lang);
    console.log(`input ${inputText} (${inputLang})`);
    console.log(`output lang: ${outputLang}`)
}
setInterval(obtainCurrentTranslation, 1000); //keep searching even if no matches found to account for internal redirects or whatever
export { }