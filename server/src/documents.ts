import { DocuemntBody, DocumentUri } from "./types";


export const documents = new Map<DocumentUri,DocuemntBody>();


export interface VersionedTextDocuemntIdentifier extends TextDocumentIdentifier{
    version:number;
}

export interface TextDocumentIdentifier {
    uri: DocumentUri;
}