import { DocumentSymbol, DocumentSymbolParams, RequestMessage, SymbolKind } from "lsp-types";
import { documents } from "../../documents.js";
import { TokenType, subRange, syxparser, tokenizeSyx } from "@syntaxs/compiler";

export function documentSymbol(message:RequestMessage):DocumentSymbol[]{
    const params = message.params as DocumentSymbolParams;

    const content = documents.get(params.textDocument.uri);
    if(!content) return [];

    if(params.textDocument.uri.endsWith('.syx')){
        const tokens = tokenizeSyx(content);
        const symbols:DocumentSymbol[] = [];


        tokens.forEach((t,i,a)=>{

            if(t.type===TokenType.KeywordKeyword){
                const next = a[i+1];
                const b = next&&next.type===TokenType.Identifier;
                symbols.push({kind:SymbolKind.Variable,name:b?next.value:'Keyword definition',detail:b?'keyword':undefined,range:b?subRange(syxparser.combineTwo(t,next)):subRange(t.range),selectionRange:subRange(t.range)});
            }

            //TODO make it actually work
            if(t.type===TokenType.RuleKeyword){

                let ruleName = '';
                let j = i;
                if(a[j+1]&&a[j+1].type===TokenType.SingleQuote){
                    j++;
                    while(a.length>=j&&a[j]&&a[j].type!==TokenType.SingleQuote) {
                        ruleName += a[++j].value
                    };
                }

                if(a[j+1]&&a[j+1].type===TokenType.DoubleQuote){
                    j++;
                    while(a.length>=j&&a[j]&&a[j].type!==TokenType.DoubleQuote) {
                        ruleName += a[++j].value
                    };
                }

                symbols.push({kind:SymbolKind.Field,name:ruleName||'Rule definition',detail:ruleName,range:subRange(t.range),selectionRange:subRange(t.range)})
            }

        });

        return symbols;
    } else return [];


}