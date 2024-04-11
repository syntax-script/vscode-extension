import { VersionedTextDocuemntIdentifier, documents } from "../../documents";
import { NotificationMessage } from "../../types";


interface TextDocumentContentChangeEvent {
    text:string;
}

interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocuemntIdentifier;
    contentChanges:TextDocumentContentChangeEvent[];
}

export function didChange(message:NotificationMessage):void {
    const params = message.params as DidChangeTextDocumentParams;
    const uri = params.textDocument.uri;

    documents.set(uri,params.contentChanges[0].text);
}