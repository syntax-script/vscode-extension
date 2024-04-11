import { DocumentUri } from "@syntaxs/compiler";
import { DocumentBody } from "./types";


export const documents = new Map<DocumentUri,DocumentBody>();


export interface VersionedTextDocuemntIdentifier extends TextDocumentIdentifier{
    version:number;
}

export interface TextDocumentIdentifier {
    uri: DocumentUri;
}