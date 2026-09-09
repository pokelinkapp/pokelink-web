import { PokelinkClientBase } from './client.js';
export declare class PokelinkClientV3 extends PokelinkClientBase {
    private readonly allowAllUsers;
    constructor(allowAllUsers: boolean);
    protected SendHandshake(): void;
    protected OnMessageReceived(buffer: Uint8Array): void;
}
