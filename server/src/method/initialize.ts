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
            textDocumentSync:1,
            diagnosticProvider:{workspaceDiagnostics:true,interFileDependencies:true,identifier:'syntax-script'},
            codeActionProvider:true
        },
        serverInfo:{
            name:'syntax-script-lsp',
            version: '0.0.1-alpha'
        }
    }

}