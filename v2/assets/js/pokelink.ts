import {PokelinkClientBase} from './client.js'
import {
    BadgesChannel,
    DeathChannel,
    PartyChannel,
    PokelinkClientV2,
    GraveyardChannel,
    ReviveChannel,
    SettingsChannel
} from './clientv2.js'
import {
    Badge,
    Badges,
    BadgeSchema,
    Party,
    Pokemon,
    PokemonDeath,
    PokemonDeathSchema,
    PokemonRevive,
    PokemonReviveSchema,
    PokemonSchema,
    Gender,
    StatusEffect,
    SettingsData,
    SettingsSchema,
    Settings,
    SettingsDataSchema,
    GraveyardUpdate,
    GraveyardUpdateSchema
} from './v2_pb.js'
import {toJson} from '@bufbuild/protobuf'
import {
    EventEmitter,
    Nullable,
    htmlColors,
    statusColors,
    typeColors,
    string2ColHex,
    ClientSettings,
    ParamsManager,
    isDefined,
    hex2rgba, examplePokemon, resolveIllegalCharacters
} from './global.js'
import * as V2DataTypes from './v2_pb.js'
import Handlebars from 'handlebars'
import collect from 'collect.js'

export const homeSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/pokemon/home/' +
    '{{ifElse isShiny "shiny" "normal"}}' +
    '/{{toLower (noSpaces (nidoranGender translations.english.speciesName "" "-f"))}}' +
    '{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}' +
    '{{addFemaleTag this "-f"}}.png'

export const itemSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/items/{{toLower (underscoreSpaces (remove translations.english.heldItemName "."))}}.png'

export const clientSettings: ClientSettings = {
    debug: false,
    params: new ParamsManager(),
    host: 'localhost',
    port: 3000,
    users: [],
    useFallbackSprites: false,
    spriteTemplate: Handlebars.compile(homeSpriteTemplate),
    itemSpriteTemplate: Handlebars.compile(itemSpriteTemplate)
}

const spriteUpdate = 'theme:settings:sprite'

const spriteReset = 'theme:settings:spriteReset'

let client: Nullable<PokelinkClientBase> = null

const events = new EventEmitter()

function globalInitialize(numberOfPlayers: number = 1) {
    if (numberOfPlayers < 1) {
        numberOfPlayers = 1
    }
    clientSettings.debug = clientSettings.params.getBool('debug', false)

    if (clientSettings.debug) {
        console.debug('Pokélink library now running in debug mode')
    }

    clientSettings.host = clientSettings.params.getString('server', 'localhost')!

    clientSettings.port = clientSettings.params.getNumber('port', 3000)

    let value = clientSettings.params.getString('users', '')!

    if (value.indexOf(',') === -1) {
        clientSettings.users = [value]
    } else {
        clientSettings.users = value.split(',')
    }

    if (numberOfPlayers < clientSettings.users.length) {
        let newList = []

        for (let i = 0; i < numberOfPlayers && i < clientSettings.users.length; i++) {
            if (clientSettings.users[0] === undefined) {
                i--
                clientSettings.users.shift()
                continue
            }
            newList.push(clientSettings.users.shift()!)
        }

        if (newList.length <= numberOfPlayers) {
            console.error('The following users will not be updated due to not fitting in the theme:', clientSettings.users)
        }
        clientSettings.users = newList
    }

    clientSettings.useFallbackSprites = clientSettings.params.getBool('useLocalSprites', false)
}

export function spriteTestInitialize() {
    globalInitialize()
}

export namespace V2 {
    interface V2Settings {
        numberOfPlayers?: number,
        listenForSpriteUpdates?: boolean
    }

    let v2Settings: V2Settings = {
        numberOfPlayers: 1,
        listenForSpriteUpdates: true
    }

    function initializeClient() {
        client = new PokelinkClientV2(v2Settings.numberOfPlayers === -1)

        client.events.once('disconnected', () => {
            events.emit('disconnected')

            setTimeout(initializeClient, 1000)
        })

        client.events.on('connect', () => {
            events.emit('connect')
        })

        client.events.on(GraveyardChannel, (graveyard: GraveyardUpdate) => {
            if (clientSettings.debug && events.hasEvents(GraveyardChannel)) {
                console.debug('Graveyard update: ', graveyard.graves.map(x => toJson(PokemonSchema, x)))
            }

            events.emit(GraveyardChannel, graveyard.graves, graveyard.username)
        })

        client.events.on(PartyChannel, (party: Party) => {
            if (clientSettings.debug && events.hasEvents(PartyChannel)) {
                console.debug(`Party update:`, party.party.map(x => x.pokemon == null ? null : toJson(PokemonSchema, x.pokemon)))
            }
            events.emit(PartyChannel, party.party.map(x => x.pokemon), party.username)
        })

        client.events.on(BadgesChannel, (badges: Badges) => {
            for (let badge of badges.badges) {
                badge.sprite = badge.sprite.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
            }

            if (clientSettings.debug && events.hasEvents(BadgesChannel)) {
                console.debug(`Badge update:`, badges.badges.map(x => toJson(BadgeSchema, x)))
            }

            events.emit(BadgesChannel, badges.badges, badges.username)
        })

        client.events.on(DeathChannel, (death: PokemonDeath) => {
            if (clientSettings.debug && events.hasEvents(DeathChannel)) {
                console.debug(`Death update:`, toJson(PokemonDeathSchema, death))
            }
            events.emit(DeathChannel, death.pokemon, death.username)
        })

        client.events.on(ReviveChannel, (revive: PokemonRevive) => {
            if (clientSettings.debug && events.hasEvents(ReviveChannel)) {
                console.debug(`Revive update:`, toJson(PokemonReviveSchema, revive))
            }
            events.emit(ReviveChannel, revive.graveId, revive.username)
        })

        client.events.on(SettingsChannel, (data: Settings) => {
            if (v2Settings.listenForSpriteUpdates && !clientSettings.params.hasKey('template')) {
                updateSpriteTemplate(data.data!.spriteTemplate)
            }
        })
    }

    export function initialize(settings?: V2Settings) {
        v2Settings = {...v2Settings, ...settings}
        globalInitialize(v2Settings.numberOfPlayers)
        initializeClient()

        if (v2Settings.listenForSpriteUpdates) {
            if (clientSettings.params.hasKey('template')) {
                const newTemplate = clientSettings.params.getString('template', undefined)
                if (isDefined(newTemplate)) {
                    updateSpriteTemplate(newTemplate!)
                }
            }
        }
    }

    export function onPartyUpdate(handler: (party: Nullable<Pokemon>[], username: string) => void) {
        events.on(PartyChannel, handler)
    }

    export function onBadgeUpdate(handler: (badges: Badge[], username: string) => void) {
        events.on(BadgesChannel, handler)
    }

    export function onGraveyardUpdate(handler: (graves: Pokemon[], username: string) => void) {
        events.on(GraveyardChannel, handler)
    }

    export function onDeath(handler: (pokemon: Pokemon, username: string) => void) {
        events.on(DeathChannel, handler)
    }

    export function onRevive(handler: (graveId: string, username: string) => void) {
        events.on(ReviveChannel, handler)
    }

    export function onSpriteTemplateUpdate(handler: () => void) {
        events.on(spriteUpdate, handler)
    }

    export function onSpriteSetReset(handler: () => void) {
        events.on(spriteReset, handler)
    }

    export function onConnect(handler: () => void) {
        events.on('connect', handler)
    }

    export function isValidPokemon(pokemon: Nullable<Pokemon>) {
        return pokemon?.species !== undefined && pokemon?.species !== null
    }

    export function getSprite(pokemon: Pokemon) {
        let output: Nullable<string> = ""
        if (clientSettings.useFallbackSprites) {
            output = pokemon.fallbackSprite
        } else {
            output = resolveIllegalCharacters(clientSettings.spriteTemplate(pokemon))
        }

        return output?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
    }

    export function getPartySprite(pokemon: Pokemon) {
        let output: Nullable<string> = ""
        if (clientSettings.useFallbackSprites) {
            output = pokemon.fallbackPartySprite
        } else {
            output = resolveIllegalCharacters(clientSettings.spriteTemplate(pokemon))
        }

        return output?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
    }

    export function useFallback(img: HTMLImageElement, pokemon: Pokemon) {
        let fallback = pokemon.fallbackSprite?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
        if (img.src === fallback || !isDefined(fallback)) {
            return
        }

        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${fallback}`)
        }

        img.src = fallback!
    }

    export function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon) {
        let fallback = pokemon.fallbackPartySprite?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
        if (img.src === fallback || !isDefined(fallback)) {
            return
        }

        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${fallback}`)
        }

        img.src = fallback!
    }

    export function getTypeColor(englishType: string) {
        let value = typeColors[englishType]

        if (!isDefined(value)) {
            return 'white'
        }

        return value
    }

    export function getStatusColor(englishStatus: string) {
        let value = statusColors[englishStatus]

        if (isDefined(value)) {
            return 'white'
        }

        return value
    }

    export function updateSpriteTemplate(template: Nullable<string>) {
        if (!v2Settings.listenForSpriteUpdates || !isDefined(template) || template!.length <= 0) {
            events.emit(spriteReset)
            return
        }

        try {
            let test = Handlebars.compile(template)
            test(examplePokemon)
            clientSettings.spriteTemplate = test

            if (clientSettings.debug) {
                console.debug('Received new sprite template:', template)
            }

            events.emit(spriteUpdate)
        } catch (ex) {
            console.error('Failed to assign new sprite template')
            console.error(ex)
        }
    }
}

export {
    htmlColors,
    statusColors,
    typeColors,
    EventEmitter,
    V2DataTypes,
    string2ColHex,
    collect,
    isDefined,
    hex2rgba,
    resolveIllegalCharacters,
    Handlebars,
    Nullable
}