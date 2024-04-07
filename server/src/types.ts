export interface Message {
    jsonrpc:string;
}

export interface RequestMessage extends Message {
    id:number | string;
    method: string;
    params?: object | unknown[];
}