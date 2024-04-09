import { DiagnosticSeverity, DocumentDiagnosticReportKind, FullDocumentDiagnosticReport, createSyntaxScriptDiagnosticReport } from "@syntaxs/compiler";
import { TextDocumentIdentifier, documents } from "../../documents";
import { RequestMessage } from "../../types";
interface DiagnosticParams {
    textDocument: TextDocumentIdentifier;
}

export function diagnostic(message: RequestMessage): FullDocumentDiagnosticReport | null {

    const params = message.params as DiagnosticParams;
    const content = documents.get(params.textDocument.uri);
    if (!content) return {kind:DocumentDiagnosticReportKind.Full,items:[{range:{start:{character:1,line:0},end:{character:2,line:0}},message:'Test',severity:DiagnosticSeverity.Error}]};

    const report = createSyntaxScriptDiagnosticReport(params.textDocument.uri);

    return report;
}