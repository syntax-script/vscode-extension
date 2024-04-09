import { DocumentBody, DocumentUri } from "./types";


export const documents = new Map<DocumentUri,DocumentBody>();


export interface VersionedTextDocuemntIdentifier extends TextDocumentIdentifier{
    version:number;
}

export interface TextDocumentIdentifier {
    uri: DocumentUri;
}