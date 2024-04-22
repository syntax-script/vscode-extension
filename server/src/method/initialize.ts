import { InitializeResult, RequestMessage } from "lsp-types";


export function initialize(message: RequestMessage): InitializeResult {

    return {
        capabilities:{
            completionProvider:{},
            textDocumentSync:1,
            diagnosticProvider:{workspaceDiagnostics:true,interFileDependencies:true,identifier:'syntax-script'},
            codeActionProvider:true,
            hoverProvider:true
        },
        serverInfo:{
            name:'syntax-script-lsp',
            version: '0.0.1-alpha'
        }
    }

}