import { ReceivedShutdown, documents } from '../documents.js';
import { RequestMessage } from 'lsp-types';

export function shutdown(message: RequestMessage) {
    documents.clear();
    ReceivedShutdown.set(true);

    return null;
}