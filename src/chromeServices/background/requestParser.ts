import { IRequestParserConfig } from "../types";
import { requestParserConfig } from "./requestParserConfig";

class RequestParser {
    #config: IRequestParserConfig
    constructor(config: IRequestParserConfig) {
        this.#config = config;
    }
    parseRequest(requestDetails: chrome.webRequest.WebRequestBodyDetails) {
        const requestBody = requestDetails.requestBody!;

        return {
            id: requestDetails.requestId,
            input: requestBody.error?"":this.#config.parseBody(requestBody.formData)
        };

    }
    match(url: string) {
        
        return this.#config.match(new URL(url));
    }
}

export const requestParsers = requestParserConfig.map((config) => new RequestParser(config));
