import { PokelinkClientBase } from './client.js';
import { Nullable } from './global.js';
import { ComponentConfig } from './pokelink.js';
export declare class PokelinkClientV3 extends PokelinkClientBase {
    private allowAllUsers;
    private users;
    private componentConfigs;
    constructor(componentConfigs?: Nullable<ComponentConfig>, users?: string[]);
    updateComponents(componentConfigs: Nullable<ComponentConfig>): void;
    updateUsers(users?: string[]): void;
    protected SendHandshake(): void;
    private send;
    protected OnMessageReceived(buffer: Uint8Array): void;
}
