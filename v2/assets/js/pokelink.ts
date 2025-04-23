import {PokelinkClientBase} from './client.js'
import {
    BadgesChannel,
    DeathChannel,
    PartyChannel,
    PokelinkClientV2,
    ReviveChannel,
    SettingsChannel
} from './clientv2.js'
import {
    Badge,
    Badges, BadgeSchema,
    Party,
    Pokemon,
    PokemonDeath,
    PokemonDeathSchema,
    PokemonRevive,
    PokemonReviveSchema, PokemonSchema,
    Gender, StatusEffect, SettingsData, SettingsSchema, Settings, SettingsDataSchema
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

export const homeSpriteTemplate = 'https://assets.pokelink.xyz/assets/sprites/pokemon/home/' +
    '{{ifElse isShiny "shiny" "normal"}}' +
    '/{{toLower (noSpaces (nidoranGender translations.english.speciesName "" "-f"))}}' +
    '{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}' +
    '{{addFemaleTag this "-f"}}.png'

export const clientSettings: ClientSettings = {
    debug: false,
    params: new ParamsManager(),
    host: 'localhost',
    port: 3000,
    users: [],
    useFallbackSprites: false,
    spriteTemplate: Handlebars.compile(homeSpriteTemplate)
}

const spriteUpdate = 'theme:settings:sprite'

let client: Nullable<PokelinkClientBase> = null

let events = new EventEmitter()

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

    export function initialize(settings?: V2Settings) {
        v2Settings = {...v2Settings, ...settings}
        globalInitialize(v2Settings.numberOfPlayers)
        client = new PokelinkClientV2()

        client.events.on('connect', () => {
            events.emit('connect')
        })

        client.events.on(PartyChannel, (party: Party) => {
            if (clientSettings.debug && events.hasEvents(PartyChannel)) {
                console.debug(`Party update:`, party.party.map(x => x.pokemon == null ? null : toJson(PokemonSchema, x.pokemon)))
            }
            events.emit(PartyChannel, party.party.map(x => x.pokemon))
        })

        client.events.on(BadgesChannel, (badges: Badges) => {
            if (clientSettings.debug && events.hasEvents(BadgesChannel)) {
                console.debug(`Badge update:`, badges.badges.map(x => toJson(BadgeSchema, x)))
            }
            events.emit(BadgesChannel, badges.badges)
        })

        client.events.on(DeathChannel, (death: PokemonDeath) => {
            if (clientSettings.debug && events.hasEvents(DeathChannel)) {
                console.debug(`Death update:`, toJson(PokemonDeathSchema, death))
            }
            events.emit(DeathChannel, death.pokemon)
        })

        client.events.on(ReviveChannel, (revive: PokemonRevive) => {
            if (clientSettings.debug && events.hasEvents(ReviveChannel)) {
                console.debug(`Revive update:`, toJson(PokemonReviveSchema, revive))
            }
            events.emit(ReviveChannel, revive.pokemon)
        })

        client.events.on(SettingsChannel, (data: Settings) => {
            if (isDefined(data.data!.spriteTemplate) && v2Settings.listenForSpriteUpdates && !clientSettings.params.hasKey('template')) {
                updateSpriteTemplate(data.data!.spriteTemplate!)
            }
        })

        if (v2Settings.listenForSpriteUpdates) {
            if (clientSettings.params.hasKey('template')) {
                const newTemplate = clientSettings.params.getString('template', undefined)
                if (isDefined(newTemplate)) {
                    updateSpriteTemplate(newTemplate!)
                }
            }
        }
    }

    export function handlePartyUpdates(handler: (party: Nullable<Pokemon>[]) => void) {
        events.on(PartyChannel, handler)
    }

    export function handleBadgeUpdates(handler: (badges: Badge[]) => void) {
        events.on(BadgesChannel, handler)
    }

    export function handleDeath(handler: (pokemon: Pokemon) => void) {
        events.on(DeathChannel, handler)
    }

    export function handleRevive(handler: (pokemon: Pokemon) => void) {
        events.on(ReviveChannel, handler)
    }

    export function handleSpriteTemplateUpdate(handler: () => void) {
        events.on(spriteUpdate, handler)
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

    export function updateSpriteTemplate(template: string) {
        if (!v2Settings.listenForSpriteUpdates || !isDefined(template) || template.length <= 0) {
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