import { createSyntaxScriptDiagnosticReport } from '@syntaxs/compiler';
import { documents } from '../../documents.js';
import { DiagnosticSeverity, DocumentDiagnosticParams, DocumentDiagnosticReportKind, FullDocumentDiagnosticReport, RequestMessage } from 'lsp-types';


export function diagnostic(message: RequestMessage): FullDocumentDiagnosticReport | null {

    const params = message.params as DocumentDiagnosticParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return { kind: DocumentDiagnosticReportKind.Full, items: [] };

    const report = createSyntaxScriptDiagnosticReport(params.textDocument.uri, content);

    return { kind: DocumentDiagnosticReportKind.Full, items: report ? report.items : [{ message: 'No report', range: { end: { character: 0, line: 1 }, start: { character: 0, line: 0 } }, severity: DiagnosticSeverity.Warning }] };
}