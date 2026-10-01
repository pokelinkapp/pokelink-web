import {PokelinkClientBase} from './client.js'
import {PokelinkClientV3} from './clientv3.js'
import * as V3DataTypes from './v3_pb.js'
import {
    Gender,
    GoalsMessageSchema,
    GraveyardMessage,
    GraveyardMessageSchema,
    PartyMessage,
    PartyMessageSchema,
    PCMessageSchema,
    Pokemon as PokemonPB,
    PokemonDeathMessage,
    PokemonDeathMessageSchema,
    PokemonEVIVSchema,
    PokemonEXPSchema,
    PokemonHiddenPowerSchema,
    PokemonHPSchema,
    PokemonMetSchema,
    PokemonMiscSchema,
    PokemonMovesSchema,
    PokemonReviveMessage,
    PokemonReviveMessageSchema,
    PokemonSchema,
    PokemonShadowSchema,
    PokemonStatusSchema,
    RoutesMessageSchema,
    SettingsMessage,
    SettingsMessageSchema, TrainerTrackerMessage, TrainerTrackerMessageSchema, TTPartiesSchema, TTTrainerSchema
} from './v3_pb.js'
import {fromBinary, Message, toJsonString} from '@bufbuild/protobuf'
import {
    ClientSettings,
    EventEmitter,
    examplePokemon,
    hex2rgba,
    htmlColors,
    isDefined,
    Nullable,
    ParamsManager,
    Pokemon,
    PokemonGrave,
    resolveIllegalCharacters,
    statusColors,
    string2ColHex, TrackedTrainer, TrainerTracker,
    typeColors
} from './global.js'
import Handlebars from 'handlebars'
import collect from 'collect.js'
import {GenMessage} from '@bufbuild/protobuf/codegenv2'

export const homeSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/pokemon/home/' +
    '{{ifElse isShiny "shiny" "normal"}}' +
    '/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}' +
    '{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}' +
    '{{addFemaleTag this "-f"}}.png'

export const itemSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/items/{{toLower (underscoreSpaces (remove translations.english.heldItem "."))}}.png'

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
    clientSettings.debug = clientSettings.params.getBool('debug', false)

    if (clientSettings.debug) {
        console.debug('Pokélink library now running in debug mode')
    }

    clientSettings.host = clientSettings.params.getString('server', 'localhost')!

    clientSettings.port = clientSettings.params.getNumber('port', 3000)

    let value = clientSettings.params.getString('users', '')!

    if (value == '' && numberOfPlayers === -1) {
        clientSettings.users = []
    } else if (value.indexOf(',') === -1) {
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

export type ComponentCallback<T extends Message> = (component: T, user: string) => void

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
const trainerTrackerId = 'pokelink.component.trainerTracker'
const pokemonId = 'pokemon'
const trainerId = 'trainer'

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

const settingsSubcomponents = {
    'spriteTemplate': 'spriteTemplate'
}

const trainerTrackerSubcomponents = {
    levelCap: 'levelCap',
    trainersDefeated: 'trainersDefeated',
    trainerCount: 'trainerCount', 
    trainers: {
        name: 'name',
        trainerClass: 'trainerClass',
        location: 'location',
        notes: 'notes',
        sprites: {
            trainer: 'trainerSprite',
            badge: 'badgeSprite'
        },
        pokemon: {
            item: 'item',
            level: 'level',
            moves: 'moves',
            ability: 'ability'
        }
    }
}

export namespace V3 {
    interface V3Settings {
        numberOfPlayers?: number
    }

    let v3Settings: V3Settings = {
        numberOfPlayers: 1
    }

    let hasRegisteredParty = false
    let hasRegisteredGraveyard = false
    let hasRegisteredDeath = false
    let hasRegisteredRevive = false
    let hasRegisteredTrainerTracking = false

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

        client.events.on('componentUpdate', (key: string, component: Message, user: string) => {
            const callbacks = componentCallbacks[key] ?? []

            if (clientSettings.debug) {
                console.debug(`Received update for ${key} calling(${user}):`, callbacks)
            }

            for (const cb of callbacks) {
                try {
                    cb(component, user)
                } catch (ex) {
                    console.error(cb, 'encountered the following error:', ex)
                }
            }
        })
    }

    export function initialize(componentConfigs: Nullable<ComponentConfig> = null, settings: Nullable<V3Settings> = null) {
        v3Settings = {...v3Settings, ...settings}
        globalInitialize(v3Settings.numberOfPlayers)
        initializeClient(componentConfigs)

        if (clientSettings.params.hasKey('template')) {
            const newTemplate = clientSettings.params.getString('template', undefined)
            if (isDefined(newTemplate)) {
                updateSpriteTemplate(newTemplate!)
            }
        }
    }

    function registerPartyComponentListener() {
        registerComponentListener<PartyMessage>(partyId, (component, user) => {
            let party: Nullable<Pokemon>[] = []

            for (let member of component.party) {
                if (!isDefined(member)) {
                    party.push(null)
                    continue
                }

                party.push(convertFromPokemonProtobuf(member))
            }

            if (clientSettings.debug) {
                console.debug(`Party(${user}):`, party)
            }

            events.emit(partyId, party, component.maxPartySize, user)
        })
    }

    function registerGraveyardComponentListener() {
        registerComponentListener<GraveyardMessage>(graveyardId, (component, user) => {
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

            if (clientSettings.debug) {
                console.debug(`Graves(${user}):`, graves)
            }

            events.emit(graveyardId, graves, user)
        })
    }

    function registerDeathComponentListener() {
        registerComponentListener<PokemonDeathMessage>(deathId, (component, user) => {
            if (!isDefined(component.grave)) {
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

            if (clientSettings.debug) {
                console.debug(`Grave added(${user}):`, flatGrave)
            }

            events.emit(deathId, flatGrave, user)
        })
    }

    function registerReviveComponentListener() {
        registerComponentListener<PokemonReviveMessage>(reviveId, (component, user) => {
            if (clientSettings.debug) {
                console.debug(`Revived(${user}) ${component.graveId}`)
            }
            events.emit(reviveId, component.graveId, user)
        })
    }
    
    function registerTrainerTrackerComponentListener() {
        registerComponentListener<TrainerTrackerMessage>(trainerTrackerId, (component, user) => {
            
            let output: TrainerTracker = {trainers: []}
            output.levelCap = component.levelCap
            output.trainerCount = component.trainerCount
            output.trainersDefeated = component.trainersDefeated
            
            for (let trainer of component.trainers) {
                let flatTrainer: TrackedTrainer = {
                    isBoss: trainer.isBoss,
                    isGymLeader: trainer.isGymLeader,
                    translations: trainer.translations!,
                    notes: trainer.notes,
                    trainerSprite: trainer.trainerSprite,
                    badgeSprite: trainer.badgeSprite
                }

                for (const key in trainer.subComponents) {
                    const schema = getComponentSchema(`${trainerId}.${key}`)

                    if (!isDefined(schema)) {
                        continue
                    }

                    const component = fromBinary(schema!, trainer.subComponents[key].value)

                    let temp: { [key: string]: any } = {}
                    temp[key] = JSON.parse(toJsonString(schema!, component, {alwaysEmitImplicit: true}))

                    flatTrainer = {...flatTrainer, ...temp}
                }
                
                output.trainers.push(flatTrainer)
            }
            
            if (clientSettings.debug) {
                console.debug(`Trainer(${user})`, output)
            }
            
            events.emit(trainerTrackerId, output, user)
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

    export function onPartyUpdate(handler: (party: Nullable<Pokemon>[], maxPartySize: number, username: string) => void) {
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

    export function onDeath(handler: (pokemon: PokemonGrave, username: string) => void) {
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
    
    export function onTrainerTrackerUpdate(handler: (data: any, username: string) => void) {
        if (!hasRegisteredTrainerTracking) {
            hasRegisteredTrainerTracking = true
            registerTrainerTrackerComponentListener()
        }
        events.on(trainerTrackerId, handler)
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

    export function getFallbackImg(pokemon: Pokemon, user?: string) {
        user ??= clientSettings.users[0]
        // noinspection HttpUrlsUsage
        return `http://${clientSettings.host}:${clientSettings.port}/api/pokelink/v1/pokedex/getSprite?species=${pokemon.species}&form=${pokemon.form}&shiny=${pokemon.isShiny ? 'true' : 'false'}&female=${pokemon.gender === Gender.female ? 'true' : 'false'}&user=${clientSettings.users[0]}`
    }

    export function getPartyFallbackImg(pokemon: Pokemon, user?: string) {
        user ??= clientSettings.users[0]
        // noinspection HttpUrlsUsage
        return `http://${clientSettings.host}:${clientSettings.port}/api/pokelink/v1/pokedex/getSprite/party?species=${pokemon.species}&form=${pokemon.form}&shiny=${pokemon.isShiny ? 'true' : 'false'}&female=${pokemon.gender === Gender.female ? 'true' : 'false'}&user=${clientSettings.users[0]}`
    }

    export function useFallback(img: HTMLImageElement, pokemon: Pokemon, user?: string) {
        let fallback = getFallbackImg(pokemon, user)
        if (img.src === fallback || !isDefined(fallback)) {
            return
        }

        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${fallback}`)
        }

        img.src = fallback!
    }

    export function usePartyFallback(img: HTMLImageElement, pokemon: Pokemon, user?: string) {
        let fallback = getPartyFallbackImg(pokemon, user)
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
        if (!isDefined(template) || template!.length <= 0) {
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

    export function getPartySize() {
        return clientSettings.params.getNumber('partySize', 6)
    }

    export function getFromSlot() {
        return clientSettings.params.getNumber('fromSlot', 0)
    }

    registerComponentListener<SettingsMessage>(settingsId, (component) => {
        if (!clientSettings.params.hasKey('template')) {
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
V3.registerComponentSchema(trainerTrackerId, TrainerTrackerMessageSchema)
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
V3.registerComponentSchema(`${trainerId}`, TTTrainerSchema)
V3.registerComponentSchema(`${trainerId}.parties`, TTPartiesSchema)

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
    trainerTrackerId,
    pokemonSubcomponents,
    goalsSubcomponents,
    graveyardSubcomponents,
    settingsSubcomponents,
    trainerTrackerSubcomponents
}