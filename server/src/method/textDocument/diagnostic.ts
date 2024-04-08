import SyntaxScriptDictionary from "../../dictionary";
import { TextDocumentIdentifier, documents } from "../../documents";
import { Range, RequestMessage } from "../../types";

interface FullDiagnosticReport {
    items: Diagnostic[];
    kind: 'full';
}

interface Diagnostic {
    severity: DiagnosticSeverity;
    source: string;
    message: string;
    data?: unknown;
    range: Range;
}

enum DiagnosticSeverity {
    Error = 1,
    Warning = 2,
    Information = 3,
    Hint = 4
}

interface DiagnosticParams {
    textDocument: TextDocumentIdentifier;
}

const regexes = {
    globalRuleDefinition: /\bule\s+('[\u0000-\uffff]*'|"[\u0000-\uffff]*"):([\u0000-\uffff]*)\b/g,
    ruleDefinition: /(export\s+)?rule\s+('[\u0000-\uffff]*'|"[\u0000-\uffff]*"):([\u0000-\uffff]*)/
};

export function diagnostic(message: RequestMessage): FullDiagnosticReport | null {

    const params = message.params as DiagnosticParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return null;
    const items: Diagnostic[] = [];

    (content.match(regexes.globalRuleDefinition) ?? []).forEach(val => {
        const match = val.match(regexes.ruleDefinition) ?? [];
        const name = match[1].slice(1, match[1].length - 1);
        items.push({message:'rule',source:'syntax-script',range:{start:{line:0,character:2},end:{character:0,line:2}},severity:DiagnosticSeverity.Error})
        if (!SyntaxScriptDictionary.Rule.some(r => r.name === name)) items.push({
            message: `Unknown rule name: ${name}`, severity: DiagnosticSeverity.Warning, source: 'syntax-script',
            range: {end:{line:0,character:2},start:{line:0,character:0}},
        });
    });


    return { kind: 'full', items };
}

interface RuleMatch {
    rule: string;
    range: Range;
}