import { Gender, PokemonHiddenPower, PokemonMove, PokemonTranslations, Pokerus, StatusEffect } from './v3_pb.js';
import { Timestamp } from '@bufbuild/protobuf/wkt';
export type Nullable<T> = T | undefined | null;
export declare function isDefined(value: Nullable<any>): boolean;
export declare function resolveIllegalCharacters(input: Nullable<string>): string;
export interface EVIV {
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    hp: number;
}
export interface Pokemon {
    uid: string;
    translations: PokemonTranslations;
    pid: number;
    species: number;
    form: number;
    gender: Gender;
    hasFemaleSprite: boolean;
    isEgg: boolean;
    isShiny: boolean;
    misc?: {
        color: string;
        pokerus: Pokerus;
        heldItem: number;
        nature: number;
        nickname?: string;
    };
    status?: StatusEffect;
    hp?: {
        current: number;
        max: number;
        currentPercent: number;
    };
    exp?: {
        level: number;
        current: number;
        nextLevel: number;
        nextLevelPercent: number;
    };
    evs?: EVIV;
    ivs?: EVIV;
    stats?: EVIV;
    hiddenPower?: PokemonHiddenPower;
    met?: {
        location: number;
        level: number;
        pokeball: number;
    };
    moves?: PokemonMove[];
    shadow?: {
        isShadow: boolean;
        heartGaugePercent: number;
    };
}
export interface PokemonGrave {
    timeOfDeath: Timestamp;
    id: string;
    pokemon?: Pokemon;
}
export declare const examplePokemon: Pokemon;
export declare class EventEmitter {
    private events;
    hasEvents(event: string): boolean;
    on(event: string, listener: (...parameters: any[]) => void): this;
    removeListener(event: string, listener: (...parameters: any[]) => void): void;
    emit(event: string, ...parameters: any[]): void;
    once(event: string, listener: (...parameters: any[]) => void): void;
}
export declare function isNumeric(str: string): boolean;
export declare class ParamsManager {
    private params;
    constructor();
    hasKey(key: string): boolean;
    getString(key: string, _default?: string): string | undefined;
    getBool(key: string, _default?: boolean): boolean;
    getNumber(key: string, _default?: number): number;
}
export interface ClientSettings {
    debug: boolean;
    params: ParamsManager;
    host: string;
    port: number;
    users: string[];
    useFallbackSprites: boolean;
    spriteTemplate: HandlebarsTemplateDelegate;
    itemSpriteTemplate: HandlebarsTemplateDelegate;
}
export declare let indexOf: (haystack: Array<any>, needle: any) => number;
export declare function string2ColHex(input: string): string;
export declare function hex2rgba(hex: string, opacity: number): string;
export declare const typeColors: {
    [key: string]: string;
};
export declare const statusColors: {
    [key: string]: string;
};
export declare const htmlColors: {
    [key: string]: string;
};
