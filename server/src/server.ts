import { completion, initialize, didChange } from "./method";
import { RequestMessage } from "./types";

type RequestMethod = (message: RequestMessage) => object;
type NotificationMethod = (message:RequestMessage) => void;
const methodMap: Record<string, RequestMethod|NotificationMethod> = {
    'initialize': initialize,
    'textDocument/completion': completion,
    'textDocuemnt/didChange': didChange
};

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
            respond(parsedMessage.id, methodMap[parsedMessage.method](parsedMessage)??null);
        }

        buffer = buffer.slice(messageStart + contentLength);
    }
});