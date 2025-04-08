import {PokelinkClientBase} from './client.js'
import {BadgesChannel, DeathChannel, PartyChannel, PokelinkClientV2, ReviveChannel} from './clientv2.js'
import {
    Badge,
    Badges, BadgeSchema,
    Party,
    Pokemon,
    PokemonDeath,
    PokemonDeathSchema,
    PokemonRevive,
    PokemonReviveSchema, PokemonSchema,
    Gender, StatusEffect
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
    isDefined
} from './global.js'
import * as V2DataTypes from './v2_pb.js'
import Handlebars from 'handlebars'
import collect from 'collect.js'

export const clientSettings: ClientSettings = {
    debug: false,
    params: new ParamsManager(),
    host: 'localhost',
    port: 3000,
    users: [],
    spriteTemplate: Handlebars.compile('https://assets.pokelink.xyz/assets/sprites/pokemon/home/' +
        '{{ifElse isShiny "shiny" "normal"}}' +
        '/{{toLower (noSpaces (nidoranGender translations.english.speciesName "" "-f"))}}' +
        '{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}' +
        '{{addFemaleTag this "-f"}}.png')
}

export function updateSpriteTemplate(template: string) {
    try {
        clientSettings.spriteTemplate = Handlebars.compile(template)
    } catch (ex) {
        console.error(ex)
        console.error(`Template: ${template}`)
    }
}

let client: Nullable<PokelinkClientBase> = null

let events = new EventEmitter()

function globalInitialize() {
    clientSettings.host = clientSettings.params.getString('server', 'localhost')!

    clientSettings.port = clientSettings.params.getNumber('port', 3000)

    let value = clientSettings.params.getString('users', '')!

    if (value.indexOf(',') === -1) {
        clientSettings.users = [value]
    } else {
        clientSettings.users = value.split(',')
    }

    clientSettings.debug = clientSettings.params.getBool('debug', false)

    if (clientSettings.debug) {

        console.debug('Pokelink library now running in debug mode')
    }
}

export namespace V2 {
    export function initialize() {
        globalInitialize()
        Handlebars.registerHelper('addFemaleTag', function (pokemon: Pokemon, femaleTag: string) {
            return pokemon.gender === Gender.female && pokemon.hasFemaleSprite ? femaleTag : ''
        })
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

    export function onConnect(handler: () => void) {
        events.on('connect', handler)
    }

    export function isValidPokemon(pokemon: Nullable<Pokemon>) {
        return pokemon?.species !== undefined && pokemon?.species !== null
    }

    export function getSprite(pokemon: Pokemon) {
        return clientSettings.spriteTemplate(pokemon)
    }

    export function useFallback(img: HTMLImageElement, pokemon: Pokemon) {
        if (img.src === pokemon.fallbackSprite || !isDefined(pokemon.fallbackSprite)) {
            return
        }

        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${pokemon.fallbackSprite}`)
        }

        img.src = pokemon.fallbackSprite!
    }

    export function getTypeColor(englishType: string) {
        let value = typeColors[englishType]

        if (value === undefined || value === null) {
            return 'white'
        }

        return value
    }

    export function getStatusColor(englishStatus: string) {
        let value = statusColors[englishStatus]

        if (value === undefined || value === null) {
            return 'white'
        }

        return value
    }
}

export {htmlColors, statusColors, typeColors, EventEmitter, V2DataTypes, string2ColHex, collect, isDefined}