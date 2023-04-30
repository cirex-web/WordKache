import { IRequestParserConfig } from "../types";
import { requestParserConfig } from "./requestParserConfig";

class RequestParser {
    #config: IRequestParserConfig
    constructor(config: IRequestParserConfig) {
        this.#config = config;
    }
    parseRequest(requestDetails: chrome.webRequest.WebRequestBodyDetails) {
        const requestBody = requestDetails.requestBody!;
        console.assert(requestBody.formData!["f.req"].length===1);
        return {
            id: requestDetails.requestId,
            input: requestBody.error ? "" : this.#config.parseBody(JSON.parse(requestBody.formData!["f.req"][0]))
        };

    }
    match(url: string) {
        return this.#config.match(new URL(url));
    }
}

export const requestParsers = requestParserConfig.map((config) => new RequestParser(config));
