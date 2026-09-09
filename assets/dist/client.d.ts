import { EventEmitter, Nullable } from './global.js';
export declare abstract class PokelinkClientBase {
    protected connection: Nullable<WebSocket>;
    private static firstConnect;
    readonly events: EventEmitter;
    openConnection(): void;
    protected ShowUser(user: Nullable<string>): boolean;
    protected abstract SendHandshake(): void;
    protected abstract OnMessageReceived(buffer: Uint8Array): void;
}
