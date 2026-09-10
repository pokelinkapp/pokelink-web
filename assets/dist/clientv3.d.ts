import { PokelinkClientBase } from './client.js';
import { Nullable } from './global.js';
import { ComponentConfig } from './pokelink.js';
export declare class PokelinkClientV3 extends PokelinkClientBase {
    private readonly allowAllUsers;
    private readonly users;
    private readonly componentConfigs;
    constructor(componentConfigs?: Nullable<ComponentConfig>, users?: string[]);
    protected SendHandshake(): void;
    protected OnMessageReceived(buffer: Uint8Array): void;
}
