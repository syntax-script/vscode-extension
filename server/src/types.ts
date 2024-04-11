export interface Message {
    jsonrpc:string;
}

export interface RequestMessage extends NotificationMessage {
    id:number | string;
}

export interface NotificationMessage extends Message {
    method:string;
    params?:unknown[]|object;
}

export type DocumentBody = string;