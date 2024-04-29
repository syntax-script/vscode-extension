import { DocumentSymbol, DocumentSymbolParams, RequestMessage, SymbolKind } from "lsp-types";
import { documents } from "../../documents.js";
import { TokenType, subRange, tokenizeSyx } from "@syntaxs/compiler";

export function documentSymbol(message:RequestMessage):DocumentSymbol[]{
    const params = message.params as DocumentSymbolParams;

    const content = documents.get(params.textDocument.uri);
    if(!content) return [];

    if(params.textDocument.uri.endsWith('.syx')){
        const tokens = tokenizeSyx(content);
        const symbols:DocumentSymbol[] = [];


        tokens.forEach(t=>{

            if(t.type===TokenType.KeywordKeyword)symbols.push({kind:SymbolKind.Variable,name:t.value,detail:'keyword',range:subRange(t.range),selectionRange:subRange(t.range)});
            if(t.type===TokenType.OperatorKeyword)symbols.push({kind:SymbolKind.Variable,name:t.value,detail:'operator',range:subRange(t.range),selectionRange:subRange(t.range)});
            if(t.type===TokenType.RuleKeyword)symbols.push({kind:SymbolKind.Variable,name:t.value,detail:'rule',range:subRange(t.range),selectionRange:subRange(t.range)});

        });

        return symbols;
    } else return [];


}