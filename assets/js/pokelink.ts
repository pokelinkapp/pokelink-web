import {PokelinkClientBase} from './client.js'
import {
    PokelinkClientV3
} from './clientv3.js'
import {
    GoalsMessageSchema,
    GraveyardMessageSchema,
    PartyMessage,
    PartyMessageSchema,
    PCMessageSchema,
    PokemonDeathMessageSchema,
    PokemonEVIVSchema,
    PokemonHiddenPowerSchema,
    PokemonHPSchema,
    PokemonMetSchema,
    PokemonMiscSchema,
    PokemonMovesSchema,
    PokemonReviveMessageSchema, PokemonShadowSchema,
    PokemonStatusSchema,
    RoutesMessageSchema,
    SettingsMessageSchema,
    Pokemon as PokemonPB, GraveyardMessage, PokemonDeathMessage, PokemonReviveMessage, PokemonEXPSchema,
    SettingsMessage,
    PokemonSchema
} from './v3_pb.js'
import * as V3DataTypes from './v3_pb.js'
import {fromBinary, Message, toJsonString} from '@bufbuild/protobuf'
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
    hex2rgba, examplePokemon, resolveIllegalCharacters,
    Pokemon, PokemonGrave
} from './global.js'
import Handlebars from 'handlebars'
import collect from 'collect.js'
import {GenMessage} from '@bufbuild/protobuf/codegenv2'

export const homeSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/pokemon/home/' +
    '{{ifElse isShiny "shiny" "normal"}}' +
    '/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}' +
    '{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}' +
    '{{addFemaleTag this "-f"}}.png'

export const itemSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/items/{{toLower (underscoreSpaces (remove translations.english.misc?.heldItem "."))}}.png'

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

export type ComponentConfig = {
    [key: string]: Nullable<ComponentConfig | string | number | boolean | Array<ComponentConfig | string>>
}

export type ComponentCallback<T extends Message> = (component: T) => void

const schemaStorage: { [key: string]: GenMessage<any> } = {}
const componentCallbacks: { [key: string]: ComponentCallback<any>[] } = {}

const partyId = 'pokelink.component.party'
const goalsId = 'pokelink.component.goals'
const graveyardId = 'pokelink.component.graveyard'
const reviveId = 'pokelink.component.revive'
const deathId = 'pokelink.component.death'
const settingsId = 'pokelink.component.settings'
const pcId = 'pokelink.component.pc'
const routesId = 'pokelink.component.routes'
const pokemonId = 'pokemon'

const pokemonSubcomponents = {
    'misc': 'misc',
    'status': 'status',
    'hp': 'hp',
    'exp': 'exp',
    'evs': 'evs',
    'ivs': 'ivs',
    'stats': 'stats',
    'hiddenPower': 'hiddenPower',
    'met': 'met',
    'moves': 'moves',
    'shadow': 'shadow'
}

const goalsSubcomponents = {
    'sprite': 'sprite',
    'name': 'name',
    'category': 'category',
    'levelCap': 'levelCap'
}

const graveyardSubcomponents = {
    'pokemon': 'pokemon'
}

export namespace V3 {
    interface V3Settings {
        numberOfPlayers?: number,
        listenForSpriteUpdates?: boolean
    }

    let v3Settings: V3Settings = {
        numberOfPlayers: 1,
        listenForSpriteUpdates: true
    }

    let hasRegisteredParty = false
    let hasRegisteredGraveyard = false
    let hasRegisteredDeath = false
    let hasRegisteredRevive = false

    function initializeClient(componentConfigs: Nullable<ComponentConfig> = null) {
        client = new PokelinkClientV3(componentConfigs, clientSettings.users)

        client.events.once('disconnected', () => {
            events.emit('disconnected')

            setTimeout(() => {
                initializeClient(componentConfigs)
            }, 1000)
        })

        client.events.on('connect', () => {
            events.emit('connect')
        })

        client.events.on('componentUpdate', (key: string, component: Message) => {
            const callbacks = componentCallbacks[key] ?? []

            if (clientSettings.debug) {
                console.debug(`Received update for ${key} calling:`, callbacks)
            }

            for (const cb of callbacks) {
                try {
                    cb(component)
                } catch (ex) {
                    console.error(cb, 'encountered the following error:', ex)
                }
            }
        })
    }

    export function initialize(settings: Nullable<V3Settings> = null, componentConfigs: Nullable<ComponentConfig> = null) {
        v3Settings = {...v3Settings, ...settings}
        globalInitialize(v3Settings.numberOfPlayers)
        initializeClient(componentConfigs)

        if (v3Settings.listenForSpriteUpdates) {
            if (clientSettings.params.hasKey('template')) {
                const newTemplate = clientSettings.params.getString('template', undefined)
                if (isDefined(newTemplate)) {
                    updateSpriteTemplate(newTemplate!)
                }
            }
        }
    }

    function registerPartyComponentListener() {
        registerComponentListener<PartyMessage>(partyId, (component) => {
            let party: Nullable<Pokemon>[] = []

            for (let member of component.party) {
                if (!isDefined(member)) {
                    party.push(null)
                    continue
                }

                party.push(convertFromPokemonProtobuf(member))
            }

            events.emit(partyId, party)
        })
    }

    function registerGraveyardComponentListener() {
        registerComponentListener<GraveyardMessage>(graveyardId, (component) => {
            let graves: Nullable<PokemonGrave>[] = []

            for (let grave of component.graves) {
                if (!isDefined(grave)) {
                    graves.push(null)
                    continue
                }

                let flatGrave: PokemonGrave = {
                    id: grave.id,
                    timeOfDeath: grave.timeOfDeath!
                }

                if (isDefined(grave.pokemon)) {
                    flatGrave.pokemon = convertFromPokemonProtobuf(grave.pokemon!)
                }

                graves.push(flatGrave)
            }

            events.emit(graveyardId, graves)
        })
    }

    function registerDeathComponentListener() {
        registerComponentListener<PokemonDeathMessage>(deathId, (component) => {
            if (!isDefined(component.grave?.pokemon)) {
                return
            }

            const grave = component.grave!

            let flatGrave: PokemonGrave = {
                id: grave.id,
                timeOfDeath: grave.timeOfDeath!
            }

            if (isDefined(grave.pokemon)) {
                flatGrave.pokemon = convertFromPokemonProtobuf(grave.pokemon!)
            }

            events.emit(deathId, flatGrave)
        })
    }

    function registerReviveComponentListener() {
        registerComponentListener<PokemonReviveMessage>(reviveId, (component) => {
            events.emit(reviveId, component.graveId)
        })
    }

    export function convertFromPokemonProtobuf(pokemon: PokemonPB): Pokemon {
        let flatPokemon: Pokemon = {
            form: pokemon.form,
            gender: pokemon.gender,
            hasFemaleSprite: pokemon.hasFemaleSprite,
            isEgg: pokemon.isEgg,
            isShiny: pokemon.isShiny,
            pid: pokemon.pid,
            species: pokemon.species,
            translations: pokemon.translations!,
            uid: pokemon.uid
        }

        for (const key in pokemon.subComponents) {
            const schema = getComponentSchema(`${pokemonId}.${key}`)

            if (!isDefined(schema)) {
                continue
            }

            const component = fromBinary(schema!, pokemon.subComponents[key].value)

            let temp: { [key: string]: any } = {}
            temp[key] = JSON.parse(toJsonString(schema!, component, {alwaysEmitImplicit: true}))

            flatPokemon = {...flatPokemon, ...temp}
        }

        return flatPokemon
    }

    export function onPartyUpdate(handler: (party: Nullable<Pokemon>[], username: string) => void) {
        if (!hasRegisteredParty) {
            hasRegisteredParty = true
            registerPartyComponentListener()
        }
        events.on(partyId, handler)
    }

    export function onGraveyardUpdate(handler: (graves: PokemonGrave[], username: string) => void) {
        if (!hasRegisteredGraveyard) {
            hasRegisteredGraveyard = true
            registerGraveyardComponentListener()
        }
        events.on(graveyardId, handler)
    }

    export function onDeath(handler: (pokemon: Pokemon, username: string) => void) {
        if (!hasRegisteredDeath) {
            hasRegisteredDeath = true
            registerDeathComponentListener()
        }
        events.on(deathId, handler)
    }

    export function onRevive(handler: (graveId: string, username: string) => void) {
        if (!hasRegisteredRevive) {
            hasRegisteredRevive = true
            registerReviveComponentListener()
        }
        events.on(reviveId, handler)
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
        return isDefined(pokemon?.species)
    }

    export function getSprite(pokemon: Pokemon) {
        let output: Nullable<string>
        if (clientSettings.useFallbackSprites) {
            // noinspection HttpUrlsUsage
            output = getFallbackImg(pokemon)
        } else {
            output = resolveIllegalCharacters(clientSettings.spriteTemplate(pokemon))
        }

        console.debug(output, pokemon)

        return output?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
    }

    export function getPartySprite(pokemon: Pokemon) {
        let output: Nullable<string>
        if (clientSettings.useFallbackSprites) {
            output = getPartyFallbackImg(pokemon)
        } else {
            output = resolveIllegalCharacters(clientSettings.spriteTemplate(pokemon))
        }

        return output?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
    }

    export function getFallbackImg(pokemon: Pokemon) {
        // noinspection HttpUrlsUsage
        return `http://${clientSettings.host}:${clientSettings.port}/api/pokelink/fallback/` // TODO: Replace with API call
    }

    export function getPartyFallbackImg(pokmeon: Pokemon) {
        // noinspection HttpUrlsUsage
        return `http://${clientSettings.host}:${clientSettings.port}/api/pokelink/partyFallback/` // TODO: Replace with API call
    }

    export function useFallback(img: HTMLImageElement, pokemon: Pokemon) {
        let fallback = getFallbackImg(pokemon)
        if (img.src === fallback || !isDefined(fallback)) {
            return
        }

        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${fallback}`)
        }

        img.src = fallback!
    }

    export function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon) {
        let fallback = getPartyFallbackImg(pokemon)
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
        if (!v3Settings.listenForSpriteUpdates || !isDefined(template) || template!.length <= 0) {
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

    export function registerComponentListener<T extends Message>(id: string, callback: ComponentCallback<T>) {
        if (!isDefined(componentCallbacks[id])) {
            componentCallbacks[id] = []
        }

        let callbacks = componentCallbacks[id]

        callbacks.push(callback)
    }

    export function registerComponentSchema<T extends Message>(id: string, componentSchema: GenMessage<T>) {
        if (isDefined(schemaStorage[id])) {
            return false
        }

        schemaStorage[id] = componentSchema

        return true
    }

    export function getComponentSchema<T2 extends Message, T extends GenMessage<T2>>(id: string): T | null {
        let schema = schemaStorage[id]
        if (isDefined(schema)) {
            return schema as T
        }

        return null
    }

    export function pokelinkHostToUrl(input: string) {
        return input.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`)
    }

    registerComponentListener<SettingsMessage>(settingsId, (component) => {
        if (v3Settings.listenForSpriteUpdates && !clientSettings.params.hasKey('template')) {
            const spriteTemplate = component.settings['spriteTemplate']
            if (isDefined(spriteTemplate)) {
                if (spriteTemplate.setting.case === 'string') {
                    updateSpriteTemplate(spriteTemplate.setting.value)
                }
            }
        }
    })
}

V3.registerComponentSchema(partyId, PartyMessageSchema)
V3.registerComponentSchema(goalsId, GoalsMessageSchema)
V3.registerComponentSchema(graveyardId, GraveyardMessageSchema)
V3.registerComponentSchema(reviveId, PokemonReviveMessageSchema)
V3.registerComponentSchema(deathId, PokemonDeathMessageSchema)
V3.registerComponentSchema(settingsId, SettingsMessageSchema)
V3.registerComponentSchema(pcId, PCMessageSchema)
V3.registerComponentSchema(routesId, RoutesMessageSchema)
V3.registerComponentSchema(pokemonId, PokemonSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.misc}`, PokemonMiscSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.status}`, PokemonStatusSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.hp}`, PokemonHPSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.exp}`, PokemonEXPSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.evs}`, PokemonEVIVSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.ivs}`, PokemonEVIVSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.stats}`, PokemonEVIVSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.hiddenPower}`, PokemonHiddenPowerSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.met}`, PokemonMetSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.moves}`, PokemonMovesSchema)
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.shadow}`, PokemonShadowSchema)

export {
    htmlColors,
    statusColors,
    typeColors,
    EventEmitter,
    V3DataTypes,
    string2ColHex,
    collect,
    isDefined,
    hex2rgba,
    resolveIllegalCharacters,
    Handlebars,
    Nullable,
    Pokemon,
    PokemonGrave,
    partyId,
    goalsId,
    graveyardId,
    reviveId,
    deathId,
    settingsId,
    pcId,
    routesId,
    pokemonSubcomponents,
    goalsSubcomponents,
    graveyardSubcomponents
}