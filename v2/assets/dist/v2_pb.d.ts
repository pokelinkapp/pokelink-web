import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
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
    /**
     * @generated from field: Pokelink.Core.Proto.V2.SettingsData data = 3;
     */
    data?: SettingsData;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Settings.
 * Use `create(SettingsSchema)` to create a new message.
 */
export declare const SettingsSchema: GenMessage<Settings>;
/**
 * @generated from message Pokelink.Core.Proto.V2.SettingsData
 */
export type SettingsData = Message<"Pokelink.Core.Proto.V2.SettingsData"> & {
    /**
     * @generated from field: optional string spriteTemplate = 1;
     */
    spriteTemplate?: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.SettingsData.
 * Use `create(SettingsDataSchema)` to create a new message.
 */
export declare const SettingsDataSchema: GenMessage<SettingsData>;
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
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string localeName = 2;
     */
    localeName: string;
    /**
     * @generated from field: string englishName = 3;
     */
    englishName: string;
    /**
     * @generated from field: bool obtained = 4;
     */
    obtained: boolean;
    /**
     * @generated from field: string sprite = 5;
     */
    sprite: string;
    /**
     * @generated from field: optional string englishCategory = 6;
     */
    englishCategory?: string;
    /**
     * @generated from field: optional string localeCategory = 7;
     */
    localeCategory?: string;
    /**
     * @generated from field: optional string levelText = 8;
     */
    levelText?: string;
    /**
     * @generated from field: optional uint32 levelCap = 9;
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
     * @generated from field: string graveId = 3;
     */
    graveId: string;
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
     * @generated from field: double expPercentage = 6;
     */
    expPercentage: number;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.HP hp = 7;
     */
    hp?: HP;
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V2.Move moves = 8;
     */
    moves: Move[];
    /**
     * @generated from field: Pokelink.Core.Proto.V2.EVIV ivs = 9;
     */
    ivs?: EVIV;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.EVIV evs = 10;
     */
    evs?: EVIV;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.BaseStats baseStats = 11;
     */
    baseStats?: BaseStats;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.StatusEffect status = 12;
     */
    status: StatusEffect;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.PokemonTranslations translations = 13;
     */
    translations?: PokemonTranslations;
    /**
     * @generated from field: bool hasFemaleSprite = 14;
     */
    hasFemaleSprite: boolean;
    /**
     * @generated from field: optional string color = 15;
     */
    color?: string;
    /**
     * @generated from field: optional string fallbackSprite = 16;
     */
    fallbackSprite?: string;
    /**
     * @generated from field: optional string fallbackPartySprite = 17;
     */
    fallbackPartySprite?: string;
    /**
     * @generated from field: optional string nickname = 18;
     */
    nickname?: string;
    /**
     * @generated from field: optional uint32 heldItem = 19;
     */
    heldItem?: number;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.Gender gender = 20;
     */
    gender?: Gender;
    /**
     * @generated from field: optional uint32 form = 21;
     */
    form?: number;
    /**
     * @generated from field: optional bool isEgg = 22;
     */
    isEgg?: boolean;
    /**
     * @generated from field: optional uint32 hiddenPower = 23;
     */
    hiddenPower?: number;
    /**
     * @generated from field: optional uint32 nature = 24;
     */
    nature?: number;
    /**
     * @generated from field: optional bool isShiny = 25;
     */
    isShiny?: boolean;
    /**
     * @generated from field: optional uint32 pokeball = 26;
     */
    pokeball?: number;
    /**
     * @generated from field: optional uint32 friendship = 27;
     */
    friendship?: number;
    /**
     * @generated from field: optional uint32 ability = 28;
     */
    ability?: number;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.Pokerus pokerus = 29;
     */
    pokerus?: Pokerus;
    /**
     * @generated from field: optional uint32 locationMet = 30;
     */
    locationMet?: number;
    /**
     * @generated from field: optional uint32 levelMet = 31;
     */
    levelMet?: number;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V2.GraveMeta graveyardMeta = 32;
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
     * @generated from field: string status = 2;
     */
    status: string;
    /**
     * @generated from field: repeated string types = 3;
     */
    types: string[];
    /**
     * @generated from field: optional string formName = 4;
     */
    formName?: string;
    /**
     * @generated from field: optional string heldItemName = 5;
     */
    heldItemName?: string;
    /**
     * @generated from field: optional string gender = 6;
     */
    gender?: string;
    /**
     * @generated from field: optional string hiddenPowerName = 7;
     */
    hiddenPowerName?: string;
    /**
     * @generated from field: optional string pokeballName = 8;
     */
    pokeballName?: string;
    /**
     * @generated from field: optional string abilityName = 9;
     */
    abilityName?: string;
    /**
     * @generated from field: optional string pokerusStatus = 10;
     */
    pokerusStatus?: string;
    /**
     * @generated from field: optional string locationMetName = 11;
     */
    locationMetName?: string;
    /**
     * @generated from field: optional string natureName = 12;
     */
    natureName?: string;
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
     * @generated from field: Pokelink.Core.Proto.V2.MoveTranslation english = 4;
     */
    english?: MoveTranslation;
    /**
     * @generated from field: Pokelink.Core.Proto.V2.MoveTranslation locale = 5;
     */
    locale?: MoveTranslation;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.Move.
 * Use `create(MoveSchema)` to create a new message.
 */
export declare const MoveSchema: GenMessage<Move>;
/**
 * @generated from message Pokelink.Core.Proto.V2.MoveTranslation
 */
export type MoveTranslation = Message<"Pokelink.Core.Proto.V2.MoveTranslation"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string type = 2;
     */
    type: string;
    /**
     * @generated from field: optional string secondType = 3;
     */
    secondType?: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V2.MoveTranslation.
 * Use `create(MoveTranslationSchema)` to create a new message.
 */
export declare const MoveTranslationSchema: GenMessage<MoveTranslation>;
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
     * @generated from field: google.protobuf.Timestamp timeOfDeath = 1;
     */
    timeOfDeath?: Timestamp;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
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
 * @generated from enum Pokelink.Core.Proto.V2.StatusEffect
 */
export declare enum StatusEffect {
    /**
     * @generated from enum value: healthy = 0;
     */
    healthy = 0,
    /**
     * @generated from enum value: poisoned = 1;
     */
    poisoned = 1,
    /**
     * @generated from enum value: asleep = 2;
     */
    asleep = 2,
    /**
     * @generated from enum value: paralyzed = 3;
     */
    paralyzed = 3,
    /**
     * @generated from enum value: frozen = 4;
     */
    frozen = 4,
    /**
     * @generated from enum value: burned = 5;
     */
    burned = 5
}
/**
 * Describes the enum Pokelink.Core.Proto.V2.StatusEffect.
 */
export declare const StatusEffectSchema: GenEnum<StatusEffect>;
