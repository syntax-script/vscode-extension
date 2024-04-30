import { NotificationMessage } from "lsp-types";
import { ReceivedShutdown } from "../documents.js";

export function exit(message: NotificationMessage) {
    process.exit(ReceivedShutdown.get() ? 0 : 1);
}