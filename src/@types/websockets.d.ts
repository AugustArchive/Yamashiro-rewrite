declare module 'ws' {
    import { IncomingMessage, ClientRequest, OutgoingHttpHeaders, Agent, Server as HttpServer } from 'http';
    import { Server as HttpsServer } from 'https';
    import { EventEmitter } from 'events';
    import { ZlibOptions, Zlib } from 'zlib';
    import { Socket } from 'net';
  
    type WebSocketData      = string | Buffer | Buffer[] | ArrayBuffer;
    type CertMeta           = string | string[] | Buffer | Buffer[];
    type VerifyCallbackSync = (
        info: {
            origin: string;
            secure: boolean;
            req: IncomingMessage;
        }
    ) => boolean;

    type VerifyCallbackAsync = (
        info: {
            origin: string;
            secure: boolean;
            req: IncomingMessage
        },
        callback: (result: boolean, code?: number, message?: string, headers?: OutgoingHttpHeaders) => void
    ) => void;

    interface ClientOptions {
        checkServerIdentify?: (name: string, certificate: CertMeta) => boolean;
        perMessageDeflate?: boolean | PerMessageDeflateOptions;
        rejectUnauthorized?: boolean;
        handshakeTimeout?: number;
        protocolVersion?: number;
        localAddress?: string;
        maxPayload?: number;
        passphrase?: string;
        protocol?: string;
        ciphers?: string;
        headers?: { [x: string]: string };
        family?: number;
        origin?: string;
        agent?: Agent;
        host?: string;
        cert?: CertMeta;
        key?: CertMeta;
        pfx?: string | Buffer;
        ca?: CertMeta;
    }

    interface PerMessageDeflateOptions {
        serverNoContextTakeover?: boolean;
        clientNoContextTakeover?: boolean;
        serverMaxWindowBits?: number;
        clientMaxWindowBits?: number;
        zlibDeflateOptions?: {
            finishFlush?: number;
            dictionary?: Buffer | Buffer[] | DataView;
            windowBits?: number;
            chunkSize?: number;
            memLevel?: number;
            strategy?: number;
            flush?: number;
            level?: number;
            info?: boolean;
        };
        zlibInflateOptions?: ZlibOptions;
        concurrencyLimit?: number;
        threshold?: number;
    }

    interface OpenEvent {
        target: WebSocket;
    }

    interface ErrorEvent {
        message: string;
        target: WebSocket;
        error: any;
        type: string;
    }

    interface CloseEvent {
        wasClean: boolean;
        reason: string;
        target: WebSocket;
        code: number;
    }

    interface MessageEvent {
        target: WebSocket;
        type: string;
        data: WebSocketData;
    }

    interface ServerOptions {
        perMessageDeflate?: PerMessageDeflateOptions | boolean;
        handleProtocols?: any;
        clientTracking?: boolean;
        verifyClient?: VerifyCallbackSync | VerifyCallbackAsync;
        maxPayload?: number;
        noServer?: boolean;
        backlog?: number;
        server?: HttpServer | HttpsServer;
        path?: string;
        host?: string;
        port?: number;
    }

    interface AddressInfo {
        address: string;
        family: string;
        port: number;
    }

    export class Server extends EventEmitter {
        constructor(options?: ServerOptions, callback?: () => void);

        public options: ServerOptions;
        public clients: Set<WebSocket>;
        public path: string;
        public address(): AddressInfo | string;
        public close(callback?: (error?: Error) => void): void;
        public handleUpgrade(request: IncomingMessage, socket: Socket, upgradeHead: Buffer, callback: (client: WebSocket) => void): void;
        public shouldHandle(request: IncomingMessage): boolean;
        public on(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;
        public on(event: 'connection', listener: (this: WebSocket, socket: WebSocket, request: IncomingMessage) => void): this;
        public on(event: 'listening', listener: (this: WebSocket) => void): this;
        public on(event: 'headers', listener: (this: WebSocket, headers: string[], request: IncomingMessage) => void): this;
        public on(event: 'error', listener: (this: WebSocket, error: Error) => void): this;
        public addListener(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;
        public addListener(event: 'connection', listener: (this: WebSocket, socket: WebSocket, request: IncomingMessage) => void): this;
        public addListener(event: 'listening', listener: (this: WebSocket) => void): this;
        public addListener(event: 'headers', listener: (this: WebSocket, headers: string[], request: IncomingMessage) => void): this;
        public addListener(event: 'error', listener: (this: WebSocket, error: Error) => void): this;
    }

    export default class WebSocket extends EventEmitter {
        constructor(address: string, protocols?: string | string[], options?: ClientOptions);
        constructor(address: string, options?: ClientOptions);

        public static CONNECTING: number;
        public static CLOSING: number;
        public static CLOSED: number;
        public static OPEN: number;
        public binaryType: string;
        public bufferedAmount: number;
        public extensions: string;
        public protocol: string;
        public readyState: number;
        public url: string;
        public CONNECTING: number;
        public CLOSING: number;
        public CLOSED: number;
        public OPEN: number;
        public onopen: (event: OpenEvent) => void;
        public onerror: (event: ErrorEvent) => void;
        public onclose: (event: CloseEvent) => void;
        public onmessage: (event: MessageEvent) => void;
        public close(code?: number, data?: string): void;
        public ping(data?: any, mask?: boolean, callback?: (error: Error) => void): void;
        public pong(data?: any, mask?: boolean, callback?: (error: Error) => void): void;
        public terminate(): void;
        public send(data: any, cb?: (error?: Error) => void): void;
        public send(data: any, options: {
            mask?: boolean;
            binary?: boolean;
            compress?: boolean;
            fin?: boolean;
        }, cb?: (error?: Error) => void): void;
        addEventListener(method: 'message', cb?: (event: { data: any; type: string; target: WebSocket }) => void): void;
        addEventListener(method: 'close', cb?: (event: {
            wasClean: boolean; code: number;
            reason: string; target: WebSocket
        }) => void): void;
        addEventListener(method: 'error', cb?: (event: {error: any, message: any, type: string, target: WebSocket }) => void): void;
        addEventListener(method: 'open', cb?: (event: { target: WebSocket }) => void): void;
        addEventListener(method: string, listener?: () => void): void;
        removeEventListener(method: 'message', cb?: (event: { data: any; type: string; target: WebSocket }) => void): void;
        removeEventListener(method: 'close', cb?: (event: {
            wasClean: boolean; code: number;
            reason: string; target: WebSocket
        }) => void): void;
        removeEventListener(method: 'error', cb?: (event: {error: any, message: any, type: string, target: WebSocket }) => void): void;
        removeEventListener(method: 'open', cb?: (event: { target: WebSocket }) => void): void;
        removeEventListener(method: string, listener?: () => void): void;
        on(event: 'close', listener: (this: WebSocket, code: number, reason: string) => void): this;
        on(event: 'error', listener: (this: WebSocket, err: Error) => void): this;
        on(event: 'upgrade', listener: (this: WebSocket, request: IncomingMessage) => void): this;
        on(event: 'message', listener: (this: WebSocket, data: WebSocketData) => void): this;
        on(event: 'open' , listener: (this: WebSocket) => void): this;
        on(event: 'ping' | 'pong', listener: (this: WebSocket, data: Buffer) => void): this;
        on(event: 'unexpected-response', listener: (this: WebSocket, request: ClientRequest, response: IncomingMessage) => void): this;
        on(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;
        addListener(event: 'close', listener: (code: number, message: string) => void): this;
        addListener(event: 'error', listener: (err: Error) => void): this;
        addListener(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
        addListener(event: 'message', listener: (data: WebSocketData) => void): this;
        addListener(event: 'open' , listener: () => void): this;
        addListener(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
        addListener(event: 'unexpected-response', listener: (request: ClientRequest, response: IncomingMessage) => void): this;
        addListener(event: string | symbol, listener: (...args: any[]) => void): this;
        removeListener(event: 'close', listener: (code: number, message: string) => void): this;
        removeListener(event: 'error', listener: (err: Error) => void): this;
        removeListener(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
        removeListener(event: 'message', listener: (data: WebSocketData) => void): this;
        removeListener(event: 'open' , listener: () => void): this;
        removeListener(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
        removeListener(event: 'unexpected-response', listener: (request: ClientRequest, response: IncomingMessage) => void): this;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    }
}