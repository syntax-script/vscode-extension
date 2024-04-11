import { DocumentUri } from "@syntaxs/compiler";
import { documents } from "../../documents";
import { RequestMessage } from "../../types";

interface DidOpenParams {
    textDocument:TextDocumentItem;
}

interface TextDocumentItem {
    uri:DocumentUri;
    text:string;
}

export function didOpen(message:RequestMessage):void {
    const params = message.params as DidOpenParams;

    documents.set(params.textDocument.uri,params.textDocument.text);
}