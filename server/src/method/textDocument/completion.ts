import SyntaxScriptDictionary from "../../dictionary";
import { RequestMessage } from "../../types";


export interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

export interface CompletionItem {
    label: string;
}

export default function completion(message: RequestMessage): CompletionList {
    return {
        isIncomplete: false,
        items: SyntaxScriptDictionary.Keyword.map(k => { return { label: k }; })
    };
}