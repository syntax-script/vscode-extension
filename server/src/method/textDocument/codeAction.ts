import { CodeAction, CodeActionParams, Range, RequestMessage } from "lsp-types";

export function codeAction(message: RequestMessage): CodeAction[] {
    const params = message.params as CodeActionParams;

    const diagnostic = params.context.diagnostics.find(r => isIn(r.range, params.range));

    return diagnostic ? diagnostic.data as CodeAction[] : [];
}

function isIn(range1: Range, range2: Range): boolean {
    return (
        range2.start.line >= range1.start.line &&
        range2.start.character >= range1.start.character &&
        range2.end.line <= range1.end.line &&
        range2.end.character <= range1.end.character
    );
}
