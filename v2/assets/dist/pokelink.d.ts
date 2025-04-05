import { Badge, Pokemon } from './v2_pb.js';
import * as V2DataTypes from './v2_pb.js';
import { EventEmitter, Nullable, htmlColors, statusColors, typeColors, string2ColHex } from './global.js';
import type { ClientSettings } from './global';
import collect from 'collect.js';
export declare const clientSettings: ClientSettings;
export declare function updateSpriteTemplate(template: string): void;
export declare namespace V2 {
    function initialize(): void;
    function handlePartyUpdates(handler: (party: Nullable<Pokemon>[]) => void): void;
    function handleBadgeUpdates(handler: (badges: Badge[]) => void): void;
    function handleDeath(handler: (pokemon: Pokemon) => void): void;
    function handleRevive(handler: (pokemon: Pokemon) => void): void;
    function onConnect(handler: () => void): void;
    function isValidPokemon(pokemon: Nullable<Pokemon>): boolean;
    function getSprite(pokemon: Pokemon): string;
    function useFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    function getTypeColor(englishType: string): string;
    function getStatusColor(englishStatus: string): string;
}
export { htmlColors, statusColors, typeColors, V2DataTypes, EventEmitter, string2ColHex, collect };
