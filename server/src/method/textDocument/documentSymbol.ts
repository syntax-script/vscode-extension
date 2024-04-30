import { DocumentSymbol, DocumentSymbolParams, Range, RequestMessage, SymbolKind } from 'lsp-types';
import { TokenType, subRange, syxparser, tokenizeSyx } from '@syntaxs/compiler';
import { documents } from '../../documents.js';

export function documentSymbol(message: RequestMessage): DocumentSymbol[] {
    const params = message.params as DocumentSymbolParams;

    const content = documents.get(params.textDocument.uri);
    if (!content) return [];

    if (params.textDocument.uri.endsWith('.syx')) {
        const tokens = tokenizeSyx(content);
        const symbols: DocumentSymbol[] = [];


        tokens.forEach((t, i, a) => {

            if (t.type === TokenType.KeywordKeyword) {
                const next = a[i + 1];
                const b = next && next.type === TokenType.Identifier;
                symbols.push({ kind: SymbolKind.Constant, name: b ? next.value : 'Keyword', detail: b ? 'keyword' : undefined, range: b ? subRange(syxparser.combineTwo(t, next)) : subRange(t.range), selectionRange: subRange(t.range) });
            }

            if (t.type === TokenType.RuleKeyword) {

                let ruleName = '';
                let j = i;
                if (tokens[j + 1] && tokens[j + 1].type === TokenType.SingleQuote) {
                    j += 2;
                    while (tokens.length > j && tokens[j] && tokens[j].type !== TokenType.SingleQuote) ruleName += tokens[j++].value;

                }

                if (tokens[j + 1] && tokens[j + 1].type === TokenType.DoubleQuote) {
                    j += 2;
                    while (tokens.length > j && tokens[j] && tokens[j].type !== TokenType.DoubleQuote) ruleName += tokens[j++].value;
                }

                symbols.push({ kind: SymbolKind.Field, name: ruleName || 'Rule', range: subRange(t.range), selectionRange: subRange(t.range) });
            }

            if (t.type === TokenType.GlobalKeyword) {
                const next = a[i + 1];
                const b = next && next.type === TokenType.Identifier;
                symbols.push({ kind: SymbolKind.Namespace, name: b ? next.value : 'Global', detail: b ? 'global' : undefined, range: b ? subRange(syxparser.combineTwo(t, next)) : subRange(t.range), selectionRange: subRange(t.range) });
                //TODO children
            }

            if (t.type === TokenType.FunctionKeyword) {
                const next = a[i + 1];
                const b = next && next.type === TokenType.Identifier;
                symbols.push({ kind: SymbolKind.Function, name: b ? next.value : 'Function', detail: b ? 'function' : undefined, range: b ? subRange(syxparser.combineTwo(t, next)) : subRange(t.range), selectionRange: subRange(t.range) });
            }

            if (t.type === TokenType.OperatorKeyword) {
                let j = i;
                let name = '';
                let lastRange: Range = { end: { character: 1, line: 1 }, start: { line: 1, character: 1 } };

                j++;
                while (tokens.length > j && tokens[j] && tokens[j].type !== TokenType.OpenBrace) name += tokens[j++].value;
                lastRange = tokens[j].range;


                symbols.push({ kind: SymbolKind.Operator, name: name || 'Operator', detail: name ? 'operator' : undefined, range: name ? subRange(syxparser.combineTwo(t, lastRange)) : subRange(t.range), selectionRange: subRange(t.range) });
            }

            if (t.type === TokenType.CompileKeyword) symbols.push({ kind: SymbolKind.Function, name: 'compile', range: subRange(t.range), selectionRange: subRange(t.range) });
            if (t.type === TokenType.ImportsKeyword) symbols.push({ kind: SymbolKind.Function, name: 'compile', range: subRange(t.range), selectionRange: subRange(t.range) });
            if (t.type === TokenType.ClassKeyword) {
                const next = a[i + 1];
                const b = next && next.type === TokenType.Identifier;
                symbols.push({ kind: SymbolKind.Class, name: b ? next.value : 'Class', detail: b ? 'class' : undefined, range: b ? subRange(syxparser.combineTwo(t, next)) : subRange(t.range), selectionRange: subRange(t.range) });
                //TODO children
            }
        });

        return symbols;
    } else return [];


}