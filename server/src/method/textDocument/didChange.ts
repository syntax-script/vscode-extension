import { NotificationMessage, VersionedTextDocumentIdentifier } from "lsp-types";
import { documents } from "../../documents.js";


interface TextDocumentContentChangeEvent {
    text:string;
}

interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocumentIdentifier;
    contentChanges:TextDocumentContentChangeEvent[];
}

export function didChange(message:NotificationMessage):void {
    const params = message.params as DidChangeTextDocumentParams;
    const uri = params.textDocument.uri;

    documents.set(uri,params.contentChanges[0].text);
}