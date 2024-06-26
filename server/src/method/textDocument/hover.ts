import { Hover, HoverParams, RequestMessage } from 'lsp-types';
import { dictionary } from '@syntaxs/compiler';
import { documents } from '../../documents.js';

const regexes = {
    beforeRule: /rule\s+("|')[a-z\-]+$/,
    afterRule: /^[a-z\-]+("|')/
};

export function hover(message: RequestMessage): Hover | null {
    const params = message.params as HoverParams;
    const content = documents.get(params.textDocument.uri);
    if (content === undefined) return null;
    const currentLine = content.split('\n')[params.position.line];
    const lineBeforeCursor = currentLine.slice(0, params.position.character);
    const lineAfterCursor = currentLine.slice(params.position.character);

    const beforeMatch = regexes.beforeRule.exec(lineBeforeCursor);
    const afterMatch = regexes.afterRule.exec(lineAfterCursor);

    if (beforeMatch && afterMatch) {
        // Combine both matched substrings to get the rule name
        const ruleName = (beforeMatch[0].trim() + afterMatch[0].trim()).replace(/^rule\s+/, '').slice(1, -1);
        const rule = dictionary.Rules.find(r => r.name === ruleName);
        if (rule === undefined) return null;
        return { contents: `# ${ruleName}\n${rule.conflicts.length>0?`**Conflicts with: ${rule.conflicts.join(',')}**\n\n`:''}\n${rule.description}` };

    }

    return null;
}