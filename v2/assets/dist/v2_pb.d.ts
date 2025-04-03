import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file v2.proto.
 */
export declare const file_v2: GenFile;
/**
 * @generated from message Pokelink.Core.Proto.V2.Base
 */
export type Base = Message<"Pokelink.Core.Proto.V2.Base"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: optional string username = 2;
     */
    username?: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Base.
 * Use `create(BaseSchema)` to create a new message.
 */
export declare const BaseSchema: GenMessage<Base>;
/**
 * @generated from message Pokelink.Core.Proto.V2.SourceTypeRequest
 */
export type SourceTypeRequest = Message<"Pokelink.Core.Proto.V2.SourceTypeRequest"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V2.SourceType sourceTypes = 2;
     */
    sourceTypes: SourceType[];
};
/**
 * Describes the message Pokelink.Core.Proto.V2.SourceTypeRequest.
 * Use `create(SourceTypeRequestSchema)` to create a new message.
 */
export declare const SourceTypeRequestSchema: GenMessage<SourceTypeRequest>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Party
 */
export type Party = Message<"Pokelink.Core.Proto.V2.Party"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: string username = 2;
     */
    username: string;
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V2.PartyObject party = 3;
     */
    party: PartyObject[];
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Party.
 * Use `create(PartySchema)` to create a new message.
 */
export declare const PartySchema: GenMessage<Party>;
/**
 * @generated from message Pokelink.Core.Proto.V2.PartyObject
 */
export type PartyObject = Message<"Pokelink.Core.Proto.V2.PartyObject"> & {
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.Pokemon pokemon = 1;
     */
    pokemon?: Pokemon;
    /**
     * @generated from field: uint32 changeId = 2;
     */
    changeId: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.PartyObject.
 * Use `create(PartyObjectSchema)` to create a new message.
 */
export declare const PartyObjectSchema: GenMessage<PartyObject>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Settings
 */
export type Settings = Message<"Pokelink.Core.Proto.V2.Settings"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: string username = 2;
     */
    username: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Settings.
 * Use `create(SettingsSchema)` to create a new message.
 */
export declare const SettingsSchema: GenMessage<Settings>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Badges
 */
export type Badges = Message<"Pokelink.Core.Proto.V2.Badges"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: string username = 2;
     */
    username: string;
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V2.Badge badges = 3;
     */
    badges: Badge[];
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Badges.
 * Use `create(BadgesSchema)` to create a new message.
 */
export declare const BadgesSchema: GenMessage<Badges>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Badge
 */
export type Badge = Message<"Pokelink.Core.Proto.V2.Badge"> & {
    /**
     * @generated from field: string localeName = 1;
     */
    localeName: string;
    /**
     * @generated from field: string englishName = 2;
     */
    englishName: string;
    /**
     * @generated from field: bool value = 3;
     */
    value: boolean;
    /**
     * @generated from field: optional string levelText = 4;
     */
    levelText?: string;
    /**
     * @generated from field: optional uint32 levelCap = 5;
     */
    levelCap?: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Badge.
 * Use `create(BadgeSchema)` to create a new message.
 */
export declare const BadgeSchema: GenMessage<Badge>;
/**
 * @generated from message Pokelink.Core.Proto.V2.PokemonDeath
 */
export type PokemonDeath = Message<"Pokelink.Core.Proto.V2.PokemonDeath"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: string username = 2;
     */
    username: string;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.Pokemon pokemon = 3;
     */
    pokemon?: Pokemon;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.PokemonDeath.
 * Use `create(PokemonDeathSchema)` to create a new message.
 */
export declare const PokemonDeathSchema: GenMessage<PokemonDeath>;
/**
 * @generated from message Pokelink.Core.Proto.V2.PokemonRevive
 */
export type PokemonRevive = Message<"Pokelink.Core.Proto.V2.PokemonRevive"> & {
    /**
     * @generated from field: string channel = 1;
     */
    channel: string;
    /**
     * @generated from field: string username = 2;
     */
    username: string;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.Pokemon pokemon = 3;
     */
    pokemon?: Pokemon;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.PokemonRevive.
 * Use `create(PokemonReviveSchema)` to create a new message.
 */
export declare const PokemonReviveSchema: GenMessage<PokemonRevive>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Pokemon
 */
export type Pokemon = Message<"Pokelink.Core.Proto.V2.Pokemon"> & {
    /**
     * @generated from field: uint32 pid = 1;
     */
    pid: number;
    /**
     * @generated from field: uint32 species = 2;
     */
    species: number;
    /**
     * @generated from field: uint32 level = 3;
     */
    level: number;
    /**
     * @generated from field: uint32 exp = 4;
     */
    exp: number;
    /**
     * @generated from field: uint32 expToNextLevel = 5;
     */
    expToNextLevel: number;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.HP hp = 6;
     */
    hp?: HP;
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V2.Move moves = 7;
     */
    moves: Move[];
    /**
     * @generated from field: Pokelink.Core.Proto.V2.EVIV ivs = 8;
     */
    ivs?: EVIV;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.EVIV evs = 9;
     */
    evs?: EVIV;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.BaseStats baseStats = 10;
     */
    baseStats?: BaseStats;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.PokemonTranslations translations = 11;
     */
    translations?: PokemonTranslations;
    /**
     * @generated from field: string fallbackSprite = 12;
     */
    fallbackSprite: string;
    /**
     * @generated from field: optional uint32 heldItem = 13;
     */
    heldItem?: number;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.Gender gender = 14;
     */
    gender?: Gender;
    /**
     * @generated from field: optional uint32 form = 15;
     */
    form?: number;
    /**
     * @generated from field: optional bool isEgg = 16;
     */
    isEgg?: boolean;
    /**
     * @generated from field: optional uint32 hiddenPower = 17;
     */
    hiddenPower?: number;
    /**
     * @generated from field: optional uint32 nature = 18;
     */
    nature?: number;
    /**
     * @generated from field: optional bool isShiny = 19;
     */
    isShiny?: boolean;
    /**
     * @generated from field: optional uint32 pokeball = 20;
     */
    pokeball?: number;
    /**
     * @generated from field: optional uint32 friendship = 21;
     */
    friendship?: number;
    /**
     * @generated from field: optional uint32 ability = 22;
     */
    ability?: number;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.Pokerus pokerus = 23;
     */
    pokerus?: Pokerus;
    /**
     * @generated from field: optional uint32 locationMet = 24;
     */
    locationMet?: number;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.GraveMeta graveyardMeta = 25;
     */
    graveyardMeta?: GraveMeta;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Pokemon.
 * Use `create(PokemonSchema)` to create a new message.
 */
export declare const PokemonSchema: GenMessage<Pokemon>;
/**
 * @generated from message Pokelink.Core.Proto.V2.PokemonTranslations
 */
export type PokemonTranslations = Message<"Pokelink.Core.Proto.V2.PokemonTranslations"> & {
    /**
     * @generated from field: Pokelink.Core.Proto.V2.TranslationsObject english = 1;
     */
    english?: TranslationsObject;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.TranslationsObject locale = 2;
     */
    locale?: TranslationsObject;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.PokemonTranslations.
 * Use `create(PokemonTranslationsSchema)` to create a new message.
 */
export declare const PokemonTranslationsSchema: GenMessage<PokemonTranslations>;
/**
 * @generated from message Pokelink.Core.Proto.V2.TranslationsObject
 */
export type TranslationsObject = Message<"Pokelink.Core.Proto.V2.TranslationsObject"> & {
    /**
     * @generated from field: string speciesName = 1;
     */
    speciesName: string;
    /**
     * @generated from field: string type1Name = 2;
     */
    type1Name: string;
    /**
     * @generated from field: string status = 3;
     */
    status: string;
    /**
     * @generated from field: repeated string moveNames = 4;
     */
    moveNames: string[];
    /**
     * @generated from field: optional string formName = 5;
     */
    formName?: string;
    /**
     * @generated from field: optional string heldItemName = 6;
     */
    heldItemName?: string;
    /**
     * @generated from field: optional string gender = 7;
     */
    gender?: string;
    /**
     * @generated from field: optional string type2Name = 8;
     */
    type2Name?: string;
    /**
     * @generated from field: optional string hiddenPowerName = 9;
     */
    hiddenPowerName?: string;
    /**
     * @generated from field: optional string pokeballName = 10;
     */
    pokeballName?: string;
    /**
     * @generated from field: optional string abilityName = 11;
     */
    abilityName?: string;
    /**
     * @generated from field: optional string pokerusStatus = 12;
     */
    pokerusStatus?: string;
    /**
     * @generated from field: optional string metLocationName = 13;
     */
    metLocationName?: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.TranslationsObject.
 * Use `create(TranslationsObjectSchema)` to create a new message.
 */
export declare const TranslationsObjectSchema: GenMessage<TranslationsObject>;
/**
 * @generated from message Pokelink.Core.Proto.V2.HP
 */
export type HP = Message<"Pokelink.Core.Proto.V2.HP"> & {
    /**
     * @generated from field: uint32 max = 1;
     */
    max: number;
    /**
     * @generated from field: uint32 current = 2;
     */
    current: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.HP.
 * Use `create(HPSchema)` to create a new message.
 */
export declare const HPSchema: GenMessage<HP>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Move
 */
export type Move = Message<"Pokelink.Core.Proto.V2.Move"> & {
    /**
     * @generated from field: uint32 id = 1;
     */
    id: number;
    /**
     * @generated from field: uint32 pp = 2;
     */
    pp: number;
    /**
     * @generated from field: uint32 maxPP = 3;
     */
    maxPP: number;
    /**
     * @generated from field: string type = 4;
     */
    type: string;
    /**
     * @generated from field: optional string secondType = 5;
     */
    secondType?: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Move.
 * Use `create(MoveSchema)` to create a new message.
 */
export declare const MoveSchema: GenMessage<Move>;
/**
 * @generated from message Pokelink.Core.Proto.V2.Status
 */
export type Status = Message<"Pokelink.Core.Proto.V2.Status"> & {
    /**
     * @generated from field: bool psn = 1;
     */
    psn: boolean;
    /**
     * @generated from field: bool slp = 2;
     */
    slp: boolean;
    /**
     * @generated from field: bool par = 3;
     */
    par: boolean;
    /**
     * @generated from field: bool fzn = 4;
     */
    fzn: boolean;
    /**
     * @generated from field: bool brn = 5;
     */
    brn: boolean;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Status.
 * Use `create(StatusSchema)` to create a new message.
 */
export declare const StatusSchema: GenMessage<Status>;
/**
 * @generated from message Pokelink.Core.Proto.V2.EVIV
 */
export type EVIV = Message<"Pokelink.Core.Proto.V2.EVIV"> & {
    /**
     * @generated from field: uint32 atk = 1;
     */
    atk: number;
    /**
     * @generated from field: uint32 def = 2;
     */
    def: number;
    /**
     * @generated from field: uint32 spatk = 3;
     */
    spatk: number;
    /**
     * @generated from field: uint32 spdef = 4;
     */
    spdef: number;
    /**
     * @generated from field: uint32 spd = 5;
     */
    spd: number;
    /**
     * @generated from field: uint32 hp = 6;
     */
    hp: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.EVIV.
 * Use `create(EVIVSchema)` to create a new message.
 */
export declare const EVIVSchema: GenMessage<EVIV>;
/**
 * @generated from message Pokelink.Core.Proto.V2.BaseStats
 */
export type BaseStats = Message<"Pokelink.Core.Proto.V2.BaseStats"> & {
    /**
     * @generated from field: uint32 atk = 1;
     */
    atk: number;
    /**
     * @generated from field: uint32 def = 2;
     */
    def: number;
    /**
     * @generated from field: uint32 spatk = 3;
     */
    spatk: number;
    /**
     * @generated from field: uint32 spdef = 4;
     */
    spdef: number;
    /**
     * @generated from field: uint32 spd = 5;
     */
    spd: number;
    /**
     * @generated from field: uint32 hp = 6;
     */
    hp: number;
    /**
     * @generated from field: uint32 bst = 7;
     */
    bst: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.BaseStats.
 * Use `create(BaseStatsSchema)` to create a new message.
 */
export declare const BaseStatsSchema: GenMessage<BaseStats>;
/**
 * @generated from message Pokelink.Core.Proto.V2.GraveMeta
 */
export type GraveMeta = Message<"Pokelink.Core.Proto.V2.GraveMeta"> & {
    /**
     * @generated from field: int64 timeOfDeath = 1;
     */
    timeOfDeath: bigint;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.GraveMeta.
 * Use `create(GraveMetaSchema)` to create a new message.
 */
export declare const GraveMetaSchema: GenMessage<GraveMeta>;
/**
 * @generated from enum Pokelink.Core.Proto.V2.Gender
 */
export declare enum Gender {
    /**
     * @generated from enum value: male = 0;
     */
    male = 0,
    /**
     * @generated from enum value: female = 1;
     */
    female = 1,
    /**
     * @generated from enum value: genderless = 2;
     */
    genderless = 2
}
/**
 * Describes the enum Pokelink.Core.Proto.V2.Gender.
 */
export declare const GenderSchema: GenEnum<Gender>;
/**
 * @generated from enum Pokelink.Core.Proto.V2.Pokerus
 */
export declare enum Pokerus {
    /**
     * @generated from enum value: clean = 0;
     */
    clean = 0,
    /**
     * @generated from enum value: infected = 1;
     */
    infected = 1,
    /**
     * @generated from enum value: cured = 2;
     */
    cured = 2
}
/**
 * Describes the enum Pokelink.Core.Proto.V2.Pokerus.
 */
export declare const PokerusSchema: GenEnum<Pokerus>;
/**
 * @generated from enum Pokelink.Core.Proto.V2.SourceType
 */
export declare enum SourceType {
    /**
     * @generated from enum value: all = 0;
     */
    all = 0,
    /**
     * @generated from enum value: party = 1;
     */
    party = 1,
    /**
     * @generated from enum value: graveyard = 2;
     */
    graveyard = 2,
    /**
     * @generated from enum value: badges = 3;
     */
    badges = 3
}
/**
 * Describes the enum Pokelink.Core.Proto.V2.SourceType.
 */
export declare const SourceTypeSchema: GenEnum<SourceType>;
