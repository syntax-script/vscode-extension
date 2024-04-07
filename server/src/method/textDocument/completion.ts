import SyntaxScriptDictionary from "../../dictionary";
import { TextDocumentIdentifier, documents } from "../../documents";
import { RequestMessage } from "../../types";

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

interface CompletionItem {
    label: string;
    kind?: CompletionItemKind;
    insertText?:string;
    details?: CompletionItemDetails;
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

interface CompletionItemDetails {
    detail?: string;
    description?: string;
}

enum CompletionItemKind {
    Text = 1,
    Method = 2,
    Function = 3,
    Constructor = 4,
    Field = 5,
    Variable = 6,
    Class = 7,
    Interface = 8,
    Module = 9,
    Property = 10,
    Unit = 11,
    Value = 12,
    Enum = 13,
    Keyword = 14,
    Snippet = 15,
    Color = 16,
    File = 17,
    Reference = 18,
    Folder = 19,
    EnumMember = 20,
    Constant = 21,
    Struct = 22,
    Event = 23,
    Operator = 24,
    TypeParameter = 25
}

const MAX_LENGTH = 100;

function keywords(curWord: string): CompletionList {

    const items = SyntaxScriptDictionary.Keyword
        .filter((word) => word.startsWith(curWord))
        .slice(0,MAX_LENGTH)
        .map(k => { return { label: k, kind: CompletionItemKind.Keyword }; });

    return {
        isIncomplete: items.length === MAX_LENGTH,
        items
    };

}

function ruleNames(curWord: string,quoteType:string,addQuote:boolean): CompletionList {
    const items = SyntaxScriptDictionary.Rule
        .filter((rule) => rule.name.startsWith(curWord))
        .slice(0,MAX_LENGTH)
        .map(k => { return { label: k.name, kind: CompletionItemKind.Constant, insertText:`${k.name}${addQuote?quoteType+':':''}` }; });

    return {
        isIncomplete: items.length === MAX_LENGTH,
        items
    };
}


const regexes = {
    ruleDefinition: /^(export\s*)?rule\s*('|")([a-z]*)$/
}

export function completion(message: RequestMessage): CompletionList | null {
    const params = message.params as CompletionParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return null;
    const currentLine = content.split('\n')[params.position.line];
    const lineBeforeCursor = currentLine.slice(0, params.position.character);
    const lineAfterCursor = currentLine.slice(params.position.character);
    const curWord = lineBeforeCursor.replace(/.*\W(.*?)/, '$1');

    if (regexes.ruleDefinition.test(lineBeforeCursor)) {
        const match = lineBeforeCursor.match(regexes.ruleDefinition);
        if(match?.[2]===undefined) return ruleNames(curWord,'\'',false);
        return ruleNames(curWord,match[2],!lineAfterCursor.startsWith(match[2]));
    }


    return keywords(curWord);
}