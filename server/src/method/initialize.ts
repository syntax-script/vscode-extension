import { RequestMessage } from "../types";

export interface InitializeResult {
    capabilities: ServerCapabilities;
    serverInfo?: {
        name: string;
        version?: string;
    };
}
export type ServerCapabilities = Record<string, unknown>;

export function initialize(message: RequestMessage): InitializeResult {

    return {
        capabilities:{
            completionProvider:{},
            textDocumentSync:{}
        },
        serverInfo:{
            name:'syntax-script-lsp',
            version: '0.0.1-alpha'
        }
    }

}