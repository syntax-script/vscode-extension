import { DocumentUri } from "lsp-types";

interface GetSetProp<T> {
    get: () => T;
    set: (v: T) => void;
}

let receivedShutdown = false;

export const documents = new Map<DocumentUri, string>();
export const ReceivedShutdown: GetSetProp<boolean> = {
    get: () => receivedShutdown,
    set(v) {
        receivedShutdown = v || receivedShutdown;
    },
};