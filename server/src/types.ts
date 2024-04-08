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

export type DocumentUri = string;
export type DocuemntBody = string;


export interface Position {
    line: number;
    character: number;
}

export interface Range {
    start: Position;
    end: Position;
}