import { DocumentUri, RequestMessage } from "lsp-types";
import { documents } from "../../documents.js";

interface DidOpenParams {
    textDocument: TextDocumentItem;
}

interface TextDocumentItem {
    uri: DocumentUri;
    text: string;
}

export function didOpen(message: RequestMessage): void {
    const params = message.params as DidOpenParams;

    documents.set(params.textDocument.uri, params.textDocument.text);
}