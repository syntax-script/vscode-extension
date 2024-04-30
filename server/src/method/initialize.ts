import { InitializeResult, RequestMessage, TextDocumentSyncKind } from 'lsp-types';


export function initialize(message: RequestMessage): InitializeResult {

    return {
        capabilities: {
            completionProvider: {},
            textDocumentSync: TextDocumentSyncKind.Full,
            diagnosticProvider: { workspaceDiagnostics: true, interFileDependencies: true, identifier: 'syntax-script' },
            codeActionProvider: true,
            hoverProvider: true,
            documentSymbolProvider: { label: 'syntax-script' }
        },
        serverInfo: {
            name: 'syntax-script-lsp',
            version: '0.0.1-alpha'
        }
    };

}