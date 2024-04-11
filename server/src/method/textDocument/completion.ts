import { dictionary } from "@syntaxs/compiler";
import { documents } from "../../documents";
import { CompletionItem, CompletionItemKind, CompletionList, CompletionParams, Position, RequestMessage } from "lsp-types";

const MAX_LENGTH = 100;

function keywords(curWord: string): CompletionList {

    const items = dictionary.Keywords
        .filter((word) => word.startsWith(curWord))
        .slice(0, MAX_LENGTH)
        .map(k => { return { label: k, kind: CompletionItemKind.Keyword as CompletionItemKind }; });

    return {
        isIncomplete: items.length === MAX_LENGTH,
        items
    };

}


function primitives(curWord: string, putEnd?: string): CompletionList {

    const items = dictionary.PrimitiveTypes
        .filter((word) => word.startsWith(curWord))
        .slice(0, MAX_LENGTH)
        .map(k => { return { label: k, kind: CompletionItemKind.Keyword, insertText: putEnd ? `${k}${putEnd}` : k } as CompletionItem; });

    return {
        isIncomplete: items.length === MAX_LENGTH,
        items
    };

}

function modifierFunctions(curWord: string): CompletionList {

    const items = dictionary.Functionaries
        .filter((func) => func.name.startsWith(curWord))
        .slice(0, MAX_LENGTH)
        .map(func => { return { label: func.name, kind: CompletionItemKind.Function } as CompletionItem; });

    return {
        isIncomplete: items.length === MAX_LENGTH,
        items
    };

}

function ruleNames(curWord: string, quoteType: string, quoter: 'none' | 'end' | 'both', pos: Position): CompletionList {
    function text(k: { name: string; }) {
        return `${quoter === 'both' ? quoteType : ''}${k.name}${quoter !== 'none' ? quoteType + ':' : ''}`;
    }

    const items = dictionary.Rules
        .filter((rule) => curWord === '' ? rule : rule.name.startsWith(curWord))
        .slice(0, MAX_LENGTH)
        .map(k => {
            return {
                label: k.name, kind: CompletionItemKind.Constant,
                insertText: text(k),
                command: { title: 'suggest', command: 'editor.action.triggerSuggest' },
                textEdit: quoter === 'none' ? { range: { start: { line: pos.line, character: pos.character }, end: { line: pos.line, character: pos.character + k.name.length + 3 } }, newText: `${text(k)}${quoteType}:` } : undefined,
                filterText: k.name, sortText: k.name
            } as CompletionItem;
        });

    return {
        isIncomplete: items.length === MAX_LENGTH,
        items
    };
}


const regexes = {
    ruleDefinition: /^(export\s+)?rule\s+('|")([a-zA-Z\-]*)$/,
    ruleValue: /^(export\s+)?rule\s+(('[\u0000-\uffff]*'|"[\u0000-\uffff]*")):\s*$/,
    fullKeyword: /(export\s+)?keyword\s+[a-z]+/g,
    ruleStart: /^(export\s+)?rule\s+$/,
    nameNeeder: /^(export\s+)?(function|keyword)\s+([\u0000-\uffff]\s+)?$/
};

export function completion(message: RequestMessage): CompletionList | null {
    const params = message.params as CompletionParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return null;
    const currentLine = content.split('\n')[params.position.line];
    const lineBeforeCursor = currentLine.slice(0, params.position.character);
    const lineAfterCursor = currentLine.slice(params.position.character);
    const curWord = lineBeforeCursor.replace(/.*\W(.*?)/, '$1');


    if (/<[\u0000-\uffff]*$/.test(lineBeforeCursor)) return primitives(curWord, '>');
    if (regexes.nameNeeder.test(lineBeforeCursor)) return { isIncomplete: false, items: [] };
    //# Rules
    if (regexes.ruleStart.test(lineBeforeCursor)) {
        return ruleNames(curWord, '"', 'both', params.position);
    }
    if (regexes.ruleDefinition.test(lineBeforeCursor)) {
        const match = lineBeforeCursor.match(regexes.ruleDefinition);
        if (!match) return ruleNames(curWord, '\'', 'none', params.position);
        return ruleNames(curWord, match[2], lineAfterCursor.startsWith(match[2]) ? 'none' : 'end', params.position);
    }
    if (regexes.ruleValue.test(lineBeforeCursor)) {
        const match = lineBeforeCursor.match(regexes.ruleValue);
        if (!match) return null;
        const ruleName = match[3].slice(1, match[3].length - 1);
        const rule = dictionary.Rules.find(r => r.name === ruleName);
        if (!rule) return null;
        if (rule.type === 'boolean') return { isIncomplete: false, items: [{ label: 'true', kind: CompletionItemKind.Keyword }, { label: 'false', kind: CompletionItemKind.Keyword }] };
        if (rule.type === 'keyword') {
            const keywords = (content.match(regexes.fullKeyword) ?? []).map(r => r.split(/\s+/)[r.startsWith('export') ? 2 : 1]);
            return { isIncomplete: false, items: keywords.map(keyword => { return { label: keyword, kind: CompletionItemKind.Value }; }) };
        }


    }

    return keywords(curWord);
}