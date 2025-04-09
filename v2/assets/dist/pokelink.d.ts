import { Badge, Pokemon } from './v2_pb.js';
import { EventEmitter, Nullable, htmlColors, statusColors, typeColors, string2ColHex, ClientSettings, isDefined, hex2rgba } from './global.js';
import * as V2DataTypes from './v2_pb.js';
import Handlebars from 'handlebars';
import collect from 'collect.js';
export declare const homeSpriteTemplate: string;
export declare const clientSettings: ClientSettings;
export declare function updateSpriteTemplate(template: string): void;
export declare function spriteTestInitialize(): void;
export declare namespace V2 {
    function initialize(numberOfPlayers?: number): void;
    function handlePartyUpdates(handler: (party: Nullable<Pokemon>[]) => void): void;
    function handleBadgeUpdates(handler: (badges: Badge[]) => void): void;
    function handleDeath(handler: (pokemon: Pokemon) => void): void;
    function handleRevive(handler: (pokemon: Pokemon) => void): void;
    function onConnect(handler: () => void): void;
    function isValidPokemon(pokemon: Nullable<Pokemon>): boolean;
    function getSprite(pokemon: Pokemon): string | undefined;
    function getPartySprite(pokemon: Pokemon): string | undefined;
    function useFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    function getTypeColor(englishType: string): string;
    function getStatusColor(englishStatus: string): string;
}
export { htmlColors, statusColors, typeColors, EventEmitter, V2DataTypes, string2ColHex, collect, isDefined, hex2rgba, Handlebars, Nullable };
