import { DiagnosticSeverity, DocumentDiagnosticReportKind, FullDocumentDiagnosticReport, createSyntaxScriptDiagnosticReport } from "@syntaxs/compiler";
import { TextDocumentIdentifier, documents } from "../../documents";
import { RequestMessage } from "../../types";


interface DiagnosticParams {
    textDocument: TextDocumentIdentifier;
}

export function diagnostic(message: RequestMessage): FullDocumentDiagnosticReport | null {

    const params = message.params as DiagnosticParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return null;

    const report = createSyntaxScriptDiagnosticReport(params.textDocument.uri,content);

    return {kind:DocumentDiagnosticReportKind.Full,items:report?report.items:[{message:'No report',range:{end:{character:0,line:1},start:{character:0,line:0}},severity:DiagnosticSeverity.Warning}]};
}