import { IRequestParserConfig } from "../types";

export const requestParserConfig: IRequestParserConfig[] = [
    {
        "match": (url) => {
            return url.hostname + url.pathname === "translate.google.com/_/TranslateWebserverUi/data/batchexecute" && url.searchParams.get("rpcids") === "MkEWBc"
        },
        "parseBody": (body) => {
            return JSON.parse(body[0][0][1])[0][0]; //honestly you can also get lang from here
        }
    }
    // {
    //     "match":(url)=>url.href.match("^https?:\/\/www2\.deepl\.com\/jsonrpc\?method=LMT_handle_jobs$")!==null,
    //     "parseBody":(body)=>{
    //         for(const job of body.params.jobs){

    //         }
    //     }
    // }
];