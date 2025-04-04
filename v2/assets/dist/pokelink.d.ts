import { Badge, Pokemon } from './v2_pb.js';
import { checkImageUrl, Nullable } from './global.js';
import type { ClientSettings } from './global';
export declare const clientSettings: ClientSettings;
export declare function updateSpriteTemplate(template: string): void;
export declare namespace V2 {
    function initialize(): void;
    function handlePartyUpdates(handler: (party: Nullable<Pokemon>[]) => void): void;
    function handleBadgeUpdates(handler: (badges: Badge[]) => void): void;
    function handleDeath(handler: (pokemon: Pokemon) => void): void;
    function handleRevive(handler: (pokemon: Pokemon) => void): void;
    function onConnect(handler: () => void): void;
    function getSprite(pokemon: Pokemon): string;
}
export { checkImageUrl };
