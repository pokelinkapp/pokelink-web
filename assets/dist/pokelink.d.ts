import { Pokemon as PokemonPB } from './v3_pb.js';
import * as V3DataTypes from './v3_pb.js';
import { Message } from '@bufbuild/protobuf';
import { EventEmitter, Nullable, htmlColors, statusColors, typeColors, string2ColHex, ClientSettings, isDefined, hex2rgba, resolveIllegalCharacters, Pokemon, PokemonGrave } from './global.js';
import Handlebars from 'handlebars';
import collect from 'collect.js';
import { GenMessage } from '@bufbuild/protobuf/codegenv2';
export declare const homeSpriteTemplate: string;
export declare const itemSpriteTemplate = "https://assets.pokelink.xyz/v2/sprites/items/{{toLower (underscoreSpaces (remove translations.english.misc?.heldItem \".\"))}}.png";
export declare const clientSettings: ClientSettings;
export declare function spriteTestInitialize(): void;
export type ComponentConfig = {
    [key: string]: Nullable<ComponentConfig | string | number | boolean | Array<ComponentConfig | string>>;
};
export type ComponentCallback<T extends Message> = (component: T) => void;
declare const partyId = "pokelink.component.party";
declare const goalsId = "pokelink.component.goals";
declare const graveyardId = "pokelink.component.graveyard";
declare const reviveId = "pokelink.component.revive";
declare const deathId = "pokelink.component.death";
declare const settingsId = "pokelink.component.settings";
declare const pcId = "pokelink.component.pc";
declare const routesId = "pokelink.component.routes";
export declare namespace V3 {
    interface V3Settings {
        numberOfPlayers?: number;
        listenForSpriteUpdates?: boolean;
    }
    export function initialize(settings?: Nullable<V3Settings>, componentConfigs?: Nullable<ComponentConfig>): void;
    export function convertFromPokemonProtobuf(pokemon: PokemonPB): Pokemon;
    export function onPartyUpdate(handler: (party: Nullable<Pokemon>[], username: string) => void): void;
    export function onGraveyardUpdate(handler: (graves: PokemonGrave[], username: string) => void): void;
    export function onDeath(handler: (pokemon: Pokemon, username: string) => void): void;
    export function onRevive(handler: (graveId: string, username: string) => void): void;
    export function onSpriteTemplateUpdate(handler: () => void): void;
    export function onSpriteSetReset(handler: () => void): void;
    export function onConnect(handler: () => void): void;
    export function isValidPokemon(pokemon: Nullable<Pokemon>): boolean;
    export function getSprite(pokemon: Pokemon): string;
    export function getPartySprite(pokemon: Pokemon): string;
    export function getFallbackImg(pokemon: Pokemon): string;
    export function getPartyFallbackImg(pokmeon: Pokemon): string;
    export function useFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    export function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon): void;
    export function getTypeColor(englishType: string): string;
    export function getStatusColor(englishStatus: string): string;
    export function updateSpriteTemplate(template: Nullable<string>): void;
    export function registerComponentListener<T extends Message>(id: string, callback: ComponentCallback<T>): void;
    export function registerComponentSchema<T extends Message>(id: string, componentSchema: GenMessage<T>): boolean;
    export function getComponentSchema<T2 extends Message, T extends GenMessage<T2>>(id: string): T | null;
    export {};
}
export { htmlColors, statusColors, typeColors, EventEmitter, V3DataTypes, string2ColHex, collect, isDefined, hex2rgba, resolveIllegalCharacters, Handlebars, Nullable, Pokemon, PokemonGrave, partyId, goalsId, graveyardId, reviveId, deathId, settingsId, pcId, routesId };
