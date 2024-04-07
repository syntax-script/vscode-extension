import { RequestMessage } from "../types";

export interface InitializeResult {
    capabilities: ServerCapabilities;
    serverInfo?: {
        name: string;
        version?: string;
    };
}
export type ServerCapabilities = Record<string, unknown>;

export default function initialize(message: RequestMessage): InitializeResult {

    return {
        capabilities:{
            completionProvider:{}
        },
        serverInfo:{
            name:'syntax-script-lsp',
            version: '0.0.1-alpha'
        }
    }

}