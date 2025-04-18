import { Badge, Pokemon } from './v2_pb.js';
import { EventEmitter, Nullable, htmlColors, statusColors, typeColors, string2ColHex, ClientSettings, isDefined, hex2rgba, resolveIllegalCharacters } from './global.js';
import * as V2DataTypes from './v2_pb.js';
import Handlebars from 'handlebars';
import collect from 'collect.js';
export declare const homeSpriteTemplate: string;
export declare const clientSettings: ClientSettings;
export declare function spriteTestInitialize(): void;
export declare namespace V2 {
    interface V2Settings {
        numberOfPlayers?: number;
        listenForSpriteUpdates?: boolean;
    }
    export function initialize(settings?: V2Settings): void;
    export function handlePartyUpdates(handler: (party: Nullable<Pokemon>[]) => void): void;
    export function handleBadgeUpdates(handler: (badges: Badge[]) => void): void;
    export function handleDeath(handler: (pokemon: Pokemon) => void): void;
    export function handleRevive(handler: (pokemon: Pokemon) => void): void;
    export function handleSpriteTemplateUpdate(handler: () => void): void;
    export function onConnect(handler: () => void): void;
    export function isValidPokemon(pokemon: Nullable<Pokemon>): boolean;
    export function getSprite(pokemon: Pokemon): string | undefined;
    export function getPartySprite(pokemon: Pokemon): string | undefined;
    export function useFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    export function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    export function getTypeColor(englishType: string): string;
    export function getStatusColor(englishStatus: string): string;
    export function updateSpriteTemplate(template: string): void;
    export {};
}
export { htmlColors, statusColors, typeColors, EventEmitter, V2DataTypes, string2ColHex, collect, isDefined, hex2rgba, resolveIllegalCharacters, Handlebars, Nullable };
