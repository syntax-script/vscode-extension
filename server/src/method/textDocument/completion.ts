import SyntaxScriptDictionary from "../../dictionary";
import { TextDocumentIdentifier, documents } from "../../documents";
import { RequestMessage } from "../../types";

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

interface CompletionItem {
    label: string;
}

export interface CompletionParams extends TextDocumentPositionParams { }

interface Position {
    line: number;
    character: number;
}

interface TextDocumentPositionParams {
    textDocument: TextDocumentIdentifier;
    position: Position;
}

export function completion(message: RequestMessage): CompletionList | null {
    const params = message.params as CompletionParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return null;
    const currentLine = content.split('\n')[params.position.line];
    const lineBeforeCursor = currentLine.slice(0, params.position.character);
    const curWord = lineBeforeCursor.replace(/.*\W(.*?)/, '$1');

    const items = SyntaxScriptDictionary.Keyword
    .filter((word)=>word.startsWith(curWord))
    .map(k => { return { label: k }; });

    return {
        isIncomplete: true,
        items
    };
}