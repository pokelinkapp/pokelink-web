import {PokelinkClientBase} from './client.js'
import {PokelinkClientV2} from './clientv2.js'
import {
    Badge,
    Badges,
    BadgesSchema,
    Party,
    PartySchema, Pokemon,
    PokemonDeath,
    PokemonDeathSchema,
    PokemonRevive,
    PokemonReviveSchema
} from './v2_pb.js'
import {toJson} from '@bufbuild/protobuf'
import {EventEmitter, Nullable} from './global.js'
import type {ClientSettings} from './global'
import Handlebars from 'handlebars'

export const clientSettings: ClientSettings = {
    debug: false,
    params: new URLSearchParams(),
    host: 'localhost',
    port: 3000,
    users: [],
    spriteTemplate: Handlebars.compile('https://assets.pokelink.xyz/assets/sprites/pokemon/home/' +
        '{{#if isShiny}}' +
        'shiny' +
        '{{else}}' +
        'normal' +
        '{{/if}}' +
        '/{{translations.english.speciesName}}' +
        '{{#if (isDefined translations.english.formName)}}' +
        '-{{translations.english.formName}}' +
        '{{/if}}' +
        '.png')
}

export function updateSpriteTemplate(template: string) {
    try {
        let t = Handlebars.compile(template)

        clientSettings.spriteTemplate = t
    } catch (ex) {
        console.error(ex)
        console.error(`Template: ${template}`)
    }
}

let client: Nullable<PokelinkClientBase> = null

let events = new EventEmitter()

function globalInitialize() {
    console.log(clientSettings.spriteTemplate({
        isShiny: false,
        translations: {english: {speciesName: 'pikachu', formName: 'phd'}}
    }))
    clientSettings.params = new URLSearchParams(window.location.search)

    let value = clientSettings.params.get('server')

    if (value !== null) {
        clientSettings.host = value
    }

    value = clientSettings.params.get('port')

    if (value !== null) {
        let num = parseInt(value)
        if (!isNaN(num)) {
            if (num > 1000 && num < 65535) {
                clientSettings.port = num
            }
        }
    }

    value = clientSettings.params.get('users')

    if (value !== null) {
        clientSettings.users = value.split(',')
    }
}

export namespace V2 {
    export function initialize() {
        globalInitialize()
        client = new PokelinkClientV2()

        client.events.on('connect', () => {
            events.emit('connect')
        })

        client.events.on('player:party:updated', (party: Party) => {
            if (clientSettings.debug && events.hasEvents('player:party:updated')) {
                console.debug(`Party update:`)
                console.debug(toJson(PartySchema, party))
            }
            events.emit('player:party:updated', party.party.map(x => x.pokemon))
        })

        client.events.on('player:badges:updated', (badges: Badges) => {
            if (clientSettings.debug && events.hasEvents('player:badges:updated')) {
                console.debug(`Badge update:`)
                console.debug(toJson(BadgesSchema, badges))
            }
            events.emit('player:badges:updated', badges.badges)
        })

        client.events.on('player:party:death', (death: PokemonDeath) => {
            if (clientSettings.debug && events.hasEvents('player:party:death')) {
                console.debug(`Death update:`)
                console.debug(toJson(PokemonDeathSchema, death))
            }
            events.emit('player:party:death', death.pokemon)
        })

        client.events.on('player:party:revive', (revive: PokemonRevive) => {
            if (clientSettings.debug && events.hasEvents('player:party:revive')) {
                console.debug(`Revive update:`)
                console.debug(toJson(PokemonReviveSchema, revive))
            }
            events.emit('player:party:revive', revive.pokemon)
        })
    }

    export function handlePartyUpdates(handler: (party: Nullable<Pokemon>[]) => void) {
        events.on('player:party:updated', handler)
    }

    export function handleBadgeUpdates(handler: (badges: Badge[]) => void) {
        events.on('player:badges:updated', handler)
    }

    export function handleDeath(handler: (pokemon: Pokemon) => void) {
        events.on('player:party:death', handler)
    }

    export function handleRevive(handler: (pokemon: Pokemon) => void) {
        events.on('player:party:revive', handler)
    }

    export function onConnect(handler: () => void) {
        events.on('connect', handler)
    }

    export function getSprite(pokemon: Pokemon) {

    }
}