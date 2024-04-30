import { RequestMessage } from 'lsp-types';
import { ReceivedShutdown, documents } from '../documents.js';

export function shutdown(message: RequestMessage) {
    documents.clear();
    ReceivedShutdown.set(true);

    return null;
}