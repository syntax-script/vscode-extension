import { ErrorCodes, RequestMessage, ResponseError } from "lsp-types";
import { completion, initialize, didChange,codeAction,diagnostic,didOpen, exit, shutdown} from "./method/index.js";
import { ReceivedShutdown } from "./documents.js";

type RequestMethod = (message: RequestMessage) => object;
type NotificationMethod = (message:RequestMessage) => void;
const methodMap: Record<string, RequestMethod|NotificationMethod> = {
    'initialize': initialize,
    'exit':exit,
    'shutdown':shutdown,
    'textDocument/completion': completion,
    'textDocument/didChange': didChange,
    'textDocument/didOpen': didOpen,
    'textDocument/diagnostic': diagnostic,
    'textDocument/codeAction': codeAction
};
const methodsThatAreRequest = [/textDocument\/[a-zA-Z]+/]

function respond(id: RequestMessage['id'], result: object|null) {
    if(result==null) return;
    const message = JSON.stringify({ id, result });
    const header = `Content-Length: ${Buffer.byteLength(message, 'utf8')}\r\n\r\n`;

    process.stdout.write(header + message);
}

let buffer = '';
process.stdin.on('data', (dataChunk) => {
    buffer += dataChunk;

    while (true) {
        const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/);
        if (!lengthMatch) break;

        const contentLength = parseInt(lengthMatch[1], 10);
        const messageStart = buffer.indexOf('\r\n\r\n') + 4;

        if (buffer.length < messageStart + contentLength) break;

        const rawMesasge = buffer.slice(messageStart, messageStart + contentLength);
        const parsedMessage = JSON.parse(rawMesasge) as RequestMessage;

        if (methodMap[parsedMessage.method] !== undefined) {
            let res;

            if(methodsThatAreRequest.some(r=>r.test(parsedMessage.method))&&ReceivedShutdown.get()) {
                res = {
                    code:ErrorCodes.InvalidRequest,
                    message:'Server is shutting down.'
                };
            } else res = methodMap[parsedMessage.method](parsedMessage)??null;
            respond(parsedMessage.id, res);
        }

        buffer = buffer.slice(messageStart + contentLength);
    }
});