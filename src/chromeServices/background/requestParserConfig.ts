import { IRequestParserConfig } from "../types";

export const requestParserConfig: IRequestParserConfig[] = [
    {
        "match": (url: URL) => {
            return url.hostname + url.pathname === "translate.google.com/_/TranslateWebserverUi/data/batchexecute" && url.searchParams.get("rpcids") === "MkEWBc"
        },
        "parseBody": (body: any) => {
            return JSON.parse(JSON.parse(body["f.req"])[0][0][1])[0][0]; //honestly you can also get lang from here
        }
    }
];