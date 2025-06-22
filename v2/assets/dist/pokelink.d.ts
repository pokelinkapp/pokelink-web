import { Badge, Pokemon } from './v2_pb.js';
import { EventEmitter, Nullable, htmlColors, statusColors, typeColors, string2ColHex, ClientSettings, isDefined, hex2rgba, resolveIllegalCharacters } from './global.js';
import * as V2DataTypes from './v2_pb.js';
import Handlebars from 'handlebars';
import collect from 'collect.js';
export declare const homeSpriteTemplate: string;
export declare const itemSpriteTemplate = "https://assets.pokelink.xyz/v2/sprites/items/{{toLower (underscoreSpaces (remove translations.english.heldItemName \".\"))}}.png";
export declare const clientSettings: ClientSettings;
export declare function spriteTestInitialize(): void;
export declare namespace V2 {
    interface V2Settings {
        numberOfPlayers?: number;
        listenForSpriteUpdates?: boolean;
    }
    export function initialize(settings?: V2Settings): void;
    export function onPartyUpdate(handler: (party: Nullable<Pokemon>[], username: string) => void): void;
    export function onBadgeUpdate(handler: (badges: Badge[], username: string) => void): void;
    export function onGraveyardUpdate(handler: (graves: Pokemon[], username: string) => void): void;
    export function onDeath(handler: (pokemon: Pokemon, username: string) => void): void;
    export function onRevive(handler: (graveId: string, username: string) => void): void;
    export function onSpriteTemplateUpdate(handler: () => void): void;
    export function onSpriteSetReset(handler: () => void): void;
    export function onConnect(handler: () => void): void;
    export function isValidPokemon(pokemon: Nullable<Pokemon>): boolean;
    export function getSprite(pokemon: Pokemon): string | undefined;
    export function getPartySprite(pokemon: Pokemon): string | undefined;
    export function useFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    export function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    export function getTypeColor(englishType: string): string;
    export function getStatusColor(englishStatus: string): string;
    export function updateSpriteTemplate(template: Nullable<string>): void;
    export {};
}
export { htmlColors, statusColors, typeColors, EventEmitter, V2DataTypes, string2ColHex, collect, isDefined, hex2rgba, resolveIllegalCharacters, Handlebars, Nullable };
