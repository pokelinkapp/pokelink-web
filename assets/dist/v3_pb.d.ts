import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Any, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file v3.proto.
 */
export declare const file_v3: GenFile;
/**
 * @generated from message Pokelink.Core.Proto.V3.SettingValue
 */
export type SettingValue = Message<"Pokelink.Core.Proto.V3.SettingValue"> & {
    /**
     * @generated from oneof Pokelink.Core.Proto.V3.SettingValue.setting
     */
    setting: {
        /**
         * @generated from field: string string = 1;
         */
        value: string;
        case: "string";
    } | {
        /**
         * @generated from field: uint32 uint = 2;
         */
        value: number;
        case: "uint";
    } | {
        /**
         * @generated from field: int32 int = 3;
         */
        value: number;
        case: "int";
    } | {
        /**
         * @generated from field: float float = 4;
         */
        value: number;
        case: "float";
    } | {
        /**
         * @generated from field: bool bool = 5;
         */
        value: boolean;
        case: "bool";
    } | {
        /**
         * @generated from field: google.protobuf.Any message = 6;
         */
        value: Any;
        case: "message";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message Pokelink.Core.Proto.V3.SettingValue.
 * Use `create(SettingValueSchema)` to create a new message.
 */
export declare const SettingValueSchema: GenMessage<SettingValue>;
/**
 * @generated from message Pokelink.Core.Proto.V3.Packet
 */
export type Packet = Message<"Pokelink.Core.Proto.V3.Packet"> & {
    /**
     * @generated from field: string username = 1;
     */
    username: string;
    /**
     * @generated from field: map<string, google.protobuf.Any> components = 2;
     */
    components: {
        [key: string]: Any;
    };
};
/**
 * Describes the message Pokelink.Core.Proto.V3.Packet.
 * Use `create(PacketSchema)` to create a new message.
 */
export declare const PacketSchema: GenMessage<Packet>;
/**
 * @generated from message Pokelink.Core.Proto.V3.GoalsMessage
 */
export type GoalsMessage = Message<"Pokelink.Core.Proto.V3.GoalsMessage"> & {
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.Goal goals = 1;
     */
    goals: Goal[];
};
/**
 * Describes the message Pokelink.Core.Proto.V3.GoalsMessage.
 * Use `create(GoalsMessageSchema)` to create a new message.
 */
export declare const GoalsMessageSchema: GenMessage<GoalsMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.GraveyardMessage
 */
export type GraveyardMessage = Message<"Pokelink.Core.Proto.V3.GraveyardMessage"> & {
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.PokemonGrave graves = 1;
     */
    graves: PokemonGrave[];
};
/**
 * Describes the message Pokelink.Core.Proto.V3.GraveyardMessage.
 * Use `create(GraveyardMessageSchema)` to create a new message.
 */
export declare const GraveyardMessageSchema: GenMessage<GraveyardMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonReviveMessage
 */
export type PokemonReviveMessage = Message<"Pokelink.Core.Proto.V3.PokemonReviveMessage"> & {
    /**
     * @generated from field: string graveId = 1;
     */
    graveId: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonReviveMessage.
 * Use `create(PokemonReviveMessageSchema)` to create a new message.
 */
export declare const PokemonReviveMessageSchema: GenMessage<PokemonReviveMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonDeathMessage
 */
export type PokemonDeathMessage = Message<"Pokelink.Core.Proto.V3.PokemonDeathMessage"> & {
    /**
     * @generated from field: Pokelink.Core.Proto.V3.PokemonGrave grave = 1;
     */
    grave?: PokemonGrave | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonDeathMessage.
 * Use `create(PokemonDeathMessageSchema)` to create a new message.
 */
export declare const PokemonDeathMessageSchema: GenMessage<PokemonDeathMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PartyMessage
 */
export type PartyMessage = Message<"Pokelink.Core.Proto.V3.PartyMessage"> & {
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.Pokemon party = 1;
     */
    party: Pokemon[];
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PartyMessage.
 * Use `create(PartyMessageSchema)` to create a new message.
 */
export declare const PartyMessageSchema: GenMessage<PartyMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.SettingsMessage
 */
export type SettingsMessage = Message<"Pokelink.Core.Proto.V3.SettingsMessage"> & {
    /**
     * @generated from field: map<string, Pokelink.Core.Proto.V3.SettingValue> settings = 1;
     */
    settings: {
        [key: string]: SettingValue;
    };
};
/**
 * Describes the message Pokelink.Core.Proto.V3.SettingsMessage.
 * Use `create(SettingsMessageSchema)` to create a new message.
 */
export declare const SettingsMessageSchema: GenMessage<SettingsMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PCMessage
 */
export type PCMessage = Message<"Pokelink.Core.Proto.V3.PCMessage"> & {
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.PCBox boxes = 1;
     */
    boxes: PCBox[];
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PCMessage.
 * Use `create(PCMessageSchema)` to create a new message.
 */
export declare const PCMessageSchema: GenMessage<PCMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.RoutesMessage
 */
export type RoutesMessage = Message<"Pokelink.Core.Proto.V3.RoutesMessage"> & {
    /**
     * @generated from field: map<string, Pokelink.Core.Proto.V3.RouteEvent> Encounters = 1;
     */
    Encounters: {
        [key: string]: RouteEvent;
    };
};
/**
 * Describes the message Pokelink.Core.Proto.V3.RoutesMessage.
 * Use `create(RoutesMessageSchema)` to create a new message.
 */
export declare const RoutesMessageSchema: GenMessage<RoutesMessage>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PCBox
 */
export type PCBox = Message<"Pokelink.Core.Proto.V3.PCBox"> & {
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.Pokemon pokemon = 1;
     */
    pokemon: Pokemon[];
    /**
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PCBox.
 * Use `create(PCBoxSchema)` to create a new message.
 */
export declare const PCBoxSchema: GenMessage<PCBox>;
/**
 * @generated from message Pokelink.Core.Proto.V3.GoalTranslationsObject
 */
export type GoalTranslationsObject = Message<"Pokelink.Core.Proto.V3.GoalTranslationsObject"> & {
    /**
     * @generated from field: optional string name = 1;
     */
    name?: string | undefined;
    /**
     * @generated from field: optional string category = 2;
     */
    category?: string | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.GoalTranslationsObject.
 * Use `create(GoalTranslationsObjectSchema)` to create a new message.
 */
export declare const GoalTranslationsObjectSchema: GenMessage<GoalTranslationsObject>;
/**
 * @generated from message Pokelink.Core.Proto.V3.GoalTranslations
 */
export type GoalTranslations = Message<"Pokelink.Core.Proto.V3.GoalTranslations"> & {
    /**
     * @generated from field: Pokelink.Core.Proto.V3.GoalTranslationsObject english = 1;
     */
    english?: GoalTranslationsObject | undefined;
    /**
     * @generated from field: Pokelink.Core.Proto.V3.GoalTranslationsObject locale = 2;
     */
    locale?: GoalTranslationsObject | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.GoalTranslations.
 * Use `create(GoalTranslationsSchema)` to create a new message.
 */
export declare const GoalTranslationsSchema: GenMessage<GoalTranslations>;
/**
 * @generated from message Pokelink.Core.Proto.V3.Goal
 */
export type Goal = Message<"Pokelink.Core.Proto.V3.Goal"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: bool obtained = 2;
     */
    obtained: boolean;
    /**
     * @generated from field: Pokelink.Core.Proto.V3.GoalTranslations translations = 3;
     */
    translations?: GoalTranslations | undefined;
    /**
     * @generated from field: optional string sprite = 4;
     */
    sprite?: string | undefined;
    /**
     * @generated from field: optional string levelText = 5;
     */
    levelText?: string | undefined;
    /**
     * @generated from field: optional uint32 levelCap = 6;
     */
    levelCap?: number | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.Goal.
 * Use `create(GoalSchema)` to create a new message.
 */
export declare const GoalSchema: GenMessage<Goal>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonMoveTranslation
 */
export type PokemonMoveTranslation = Message<"Pokelink.Core.Proto.V3.PokemonMoveTranslation"> & {
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
    secondType?: string | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonMoveTranslation.
 * Use `create(PokemonMoveTranslationSchema)` to create a new message.
 */
export declare const PokemonMoveTranslationSchema: GenMessage<PokemonMoveTranslation>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonTranslationObject
 */
export type PokemonTranslationObject = Message<"Pokelink.Core.Proto.V3.PokemonTranslationObject"> & {
    /**
     * @generated from field: optional string species = 1;
     */
    species?: string | undefined;
    /**
     * @generated from field: optional string form = 2;
     */
    form?: string | undefined;
    /**
     * @generated from field: optional string color = 3;
     */
    color?: string | undefined;
    /**
     * @generated from field: optional string status = 4;
     */
    status?: string | undefined;
    /**
     * @generated from field: repeated string types = 5;
     */
    types: string[];
    /**
     * @generated from field: optional string heldItem = 6;
     */
    heldItem?: string | undefined;
    /**
     * @generated from field: optional string gender = 7;
     */
    gender?: string | undefined;
    /**
     * @generated from field: optional string hiddenPowerType = 8;
     */
    hiddenPowerType?: string | undefined;
    /**
     * @generated from field: optional string pokeball = 9;
     */
    pokeball?: string | undefined;
    /**
     * @generated from field: optional string ability = 10;
     */
    ability?: string | undefined;
    /**
     * @generated from field: optional string pokerus = 11;
     */
    pokerus?: string | undefined;
    /**
     * @generated from field: optional string locationMet = 12;
     */
    locationMet?: string | undefined;
    /**
     * @generated from field: optional string nature = 13;
     */
    nature?: string | undefined;
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.PokemonMoveTranslation moves = 14;
     */
    moves: PokemonMoveTranslation[];
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonTranslationObject.
 * Use `create(PokemonTranslationObjectSchema)` to create a new message.
 */
export declare const PokemonTranslationObjectSchema: GenMessage<PokemonTranslationObject>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonTranslations
 */
export type PokemonTranslations = Message<"Pokelink.Core.Proto.V3.PokemonTranslations"> & {
    /**
     * @generated from field: Pokelink.Core.Proto.V3.PokemonTranslationObject english = 1;
     */
    english?: PokemonTranslationObject | undefined;
    /**
     * @generated from field: Pokelink.Core.Proto.V3.PokemonTranslationObject locale = 2;
     */
    locale?: PokemonTranslationObject | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonTranslations.
 * Use `create(PokemonTranslationsSchema)` to create a new message.
 */
export declare const PokemonTranslationsSchema: GenMessage<PokemonTranslations>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonEVIV
 */
export type PokemonEVIV = Message<"Pokelink.Core.Proto.V3.PokemonEVIV"> & {
    /**
     * @generated from field: uint32 attack = 1;
     */
    attack: number;
    /**
     * @generated from field: uint32 defense = 2;
     */
    defense: number;
    /**
     * @generated from field: uint32 specialAttack = 3;
     */
    specialAttack: number;
    /**
     * @generated from field: uint32 specialDefense = 4;
     */
    specialDefense: number;
    /**
     * @generated from field: uint32 speed = 5;
     */
    speed: number;
    /**
     * @generated from field: uint32 hp = 6;
     */
    hp: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonEVIV.
 * Use `create(PokemonEVIVSchema)` to create a new message.
 */
export declare const PokemonEVIVSchema: GenMessage<PokemonEVIV>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonStatus
 */
export type PokemonStatus = Message<"Pokelink.Core.Proto.V3.PokemonStatus"> & {
    /**
     * @generated from field: Pokelink.Core.Proto.V3.StatusEffect status = 1;
     */
    status: StatusEffect;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonStatus.
 * Use `create(PokemonStatusSchema)` to create a new message.
 */
export declare const PokemonStatusSchema: GenMessage<PokemonStatus>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonHiddenPower
 */
export type PokemonHiddenPower = Message<"Pokelink.Core.Proto.V3.PokemonHiddenPower"> & {
    /**
     * @generated from field: uint32 type = 1;
     */
    type: number;
    /**
     * @generated from field: uint32 power = 2;
     */
    power: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonHiddenPower.
 * Use `create(PokemonHiddenPowerSchema)` to create a new message.
 */
export declare const PokemonHiddenPowerSchema: GenMessage<PokemonHiddenPower>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonMisc
 */
export type PokemonMisc = Message<"Pokelink.Core.Proto.V3.PokemonMisc"> & {
    /**
     * @generated from field: Pokelink.Core.Proto.V3.Pokerus pokerus = 1;
     */
    pokerus: Pokerus;
    /**
     * @generated from field: uint32 heldItem = 2;
     */
    heldItem: number;
    /**
     * @generated from field: uint32 nature = 3;
     */
    nature: number;
    /**
     * @generated from field: optional string nickname = 4;
     */
    nickname?: string | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonMisc.
 * Use `create(PokemonMiscSchema)` to create a new message.
 */
export declare const PokemonMiscSchema: GenMessage<PokemonMisc>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonHP
 */
export type PokemonHP = Message<"Pokelink.Core.Proto.V3.PokemonHP"> & {
    /**
     * @generated from field: uint32 current = 1;
     */
    current: number;
    /**
     * @generated from field: uint32 max = 2;
     */
    max: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonHP.
 * Use `create(PokemonHPSchema)` to create a new message.
 */
export declare const PokemonHPSchema: GenMessage<PokemonHP>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonEXP
 */
export type PokemonEXP = Message<"Pokelink.Core.Proto.V3.PokemonEXP"> & {
    /**
     * @generated from field: uint32 level = 1;
     */
    level: number;
    /**
     * @generated from field: uint32 current = 2;
     */
    current: number;
    /**
     * @generated from field: uint32 nextLevel = 3;
     */
    nextLevel: number;
    /**
     * @generated from field: uint32 nextLevelRemaining = 4;
     */
    nextLevelRemaining: number;
    /**
     * @generated from field: double nextLevelPercent = 5;
     */
    nextLevelPercent: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonEXP.
 * Use `create(PokemonEXPSchema)` to create a new message.
 */
export declare const PokemonEXPSchema: GenMessage<PokemonEXP>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonMet
 */
export type PokemonMet = Message<"Pokelink.Core.Proto.V3.PokemonMet"> & {
    /**
     * @generated from field: uint32 location = 1;
     */
    location: number;
    /**
     * @generated from field: uint32 level = 2;
     */
    level: number;
    /**
     * @generated from field: uint32 pokeball = 3;
     */
    pokeball: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonMet.
 * Use `create(PokemonMetSchema)` to create a new message.
 */
export declare const PokemonMetSchema: GenMessage<PokemonMet>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonMove
 */
export type PokemonMove = Message<"Pokelink.Core.Proto.V3.PokemonMove"> & {
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
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonMove.
 * Use `create(PokemonMoveSchema)` to create a new message.
 */
export declare const PokemonMoveSchema: GenMessage<PokemonMove>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonMoves
 */
export type PokemonMoves = Message<"Pokelink.Core.Proto.V3.PokemonMoves"> & {
    /**
     * @generated from field: repeated Pokelink.Core.Proto.V3.PokemonMove moves = 1;
     */
    moves: PokemonMove[];
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonMoves.
 * Use `create(PokemonMovesSchema)` to create a new message.
 */
export declare const PokemonMovesSchema: GenMessage<PokemonMoves>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonShadow
 */
export type PokemonShadow = Message<"Pokelink.Core.Proto.V3.PokemonShadow"> & {
    /**
     * @generated from field: bool isShadow = 1;
     */
    isShadow: boolean;
    /**
     * @generated from field: float heartGaugePercentage = 2;
     */
    heartGaugePercentage: number;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonShadow.
 * Use `create(PokemonShadowSchema)` to create a new message.
 */
export declare const PokemonShadowSchema: GenMessage<PokemonShadow>;
/**
 * @generated from message Pokelink.Core.Proto.V3.Pokemon
 */
export type Pokemon = Message<"Pokelink.Core.Proto.V3.Pokemon"> & {
    /**
     * Required fields
     *
     * @generated from field: string uid = 1;
     */
    uid: string;
    /**
     * @generated from field: Pokelink.Core.Proto.V3.PokemonTranslations translations = 2;
     */
    translations?: PokemonTranslations | undefined;
    /**
     * @generated from field: uint32 pid = 3;
     */
    pid: number;
    /**
     * @generated from field: uint32 species = 4;
     */
    species: number;
    /**
     * @generated from field: uint32 form = 5;
     */
    form: number;
    /**
     * @generated from field: Pokelink.Core.Proto.V3.Gender gender = 6;
     */
    gender: Gender;
    /**
     * @generated from field: bool hasFemaleSprite = 7;
     */
    hasFemaleSprite: boolean;
    /**
     * @generated from field: bool isEgg = 8;
     */
    isEgg: boolean;
    /**
     * Required fields
     *
     * @generated from field: bool isShiny = 9;
     */
    isShiny: boolean;
    /**
     * @generated from field: map<string, google.protobuf.Any> subComponents = 11;
     */
    subComponents: {
        [key: string]: Any;
    };
};
/**
 * Describes the message Pokelink.Core.Proto.V3.Pokemon.
 * Use `create(PokemonSchema)` to create a new message.
 */
export declare const PokemonSchema: GenMessage<Pokemon>;
/**
 * @generated from message Pokelink.Core.Proto.V3.PokemonGrave
 */
export type PokemonGrave = Message<"Pokelink.Core.Proto.V3.PokemonGrave"> & {
    /**
     * @generated from field: google.protobuf.Timestamp timeOfDeath = 1;
     */
    timeOfDeath?: Timestamp | undefined;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: optional Pokelink.Core.Proto.V3.Pokemon pokemon = 3;
     */
    pokemon?: Pokemon | undefined;
};
/**
 * Describes the message Pokelink.Core.Proto.V3.PokemonGrave.
 * Use `create(PokemonGraveSchema)` to create a new message.
 */
export declare const PokemonGraveSchema: GenMessage<PokemonGrave>;
/**
 * @generated from enum Pokelink.Core.Proto.V3.Gender
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
 * Describes the enum Pokelink.Core.Proto.V3.Gender.
 */
export declare const GenderSchema: GenEnum<Gender>;
/**
 * @generated from enum Pokelink.Core.Proto.V3.Pokerus
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
 * Describes the enum Pokelink.Core.Proto.V3.Pokerus.
 */
export declare const PokerusSchema: GenEnum<Pokerus>;
/**
 * @generated from enum Pokelink.Core.Proto.V3.StatusEffect
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
    burned = 5,
    /**
     * @generated from enum value: badlyPoisoned = 6;
     */
    badlyPoisoned = 6
}
/**
 * Describes the enum Pokelink.Core.Proto.V3.StatusEffect.
 */
export declare const StatusEffectSchema: GenEnum<StatusEffect>;
/**
 * @generated from enum Pokelink.Core.Proto.V3.RouteEvent
 */
export declare enum RouteEvent {
    /**
     * @generated from enum value: available = 0;
     */
    available = 0,
    /**
     * @generated from enum value: caught = 1;
     */
    caught = 1,
    /**
     * @generated from enum value: ranAway = 2;
     */
    ranAway = 2,
    /**
     * @generated from enum value: defeated = 3;
     */
    defeated = 3
}
/**
 * Describes the enum Pokelink.Core.Proto.V3.RouteEvent.
 */
export declare const RouteEventSchema: GenEnum<RouteEvent>;
