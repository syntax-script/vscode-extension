import { Diagnostic, DocumentUri, Range } from "@syntaxs/compiler";
import { RequestMessage } from "../../types";
import { TextEdit } from "./completion";
import { TextDocumentIdentifier } from "../../documents";

interface CodeAction {
    title: string;
    kind?: CodeActionKind;
    isPreferred?: boolean;
    edit?: WorkspaceEdit;
    data?: unknown;
}

interface CodeActionParams {
    textDocument: TextDocumentIdentifier;
    range: Range;
    context: CodeActionContext;
}

interface CodeActionContext {
    diagnostics: Diagnostic[];
}

enum CodeActionKind {
    Empty = '',
    QuickFix = 'quickfix',
    Refactor = 'refactor'
}

interface WorkspaceEdit {
    changes?: Record<DocumentUri, TextEdit[]>;
}

export function codeAction(message: RequestMessage): CodeAction[] {
    const params = message.params as CodeActionParams;

    // TODO

    return [
        {
            title: 'TODO',
            kind: CodeActionKind.QuickFix,
            edit: {
                changes: {
                    [params.textDocument.uri]: []
                }
            }
        }
    ];
}