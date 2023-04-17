import { IRequestParserConfig } from "../types";
import { requestParserConfig } from "./requestParserConfig";

class RequestParser {
    #config: IRequestParserConfig
    constructor(config: IRequestParserConfig) {
        this.#config = config;
    }
    parseRequest(requestDetails: chrome.webRequest.WebRequestBodyDetails) {
        const requestBody = requestDetails.requestBody!;
        if (!requestBody.error) {
            return {
                id: requestDetails.requestId,
                input: this.#config.parseBody(requestBody.formData)
            };

        }
        return {};

    }
    match(url: URL) {
        return this.#config.match(url);
    }
}

export const RequestParsers = requestParserConfig.map((config) => new RequestParser(config));
