import { PokelinkClientV3 } from './clientv3.js';
import { GoalsMessageSchema, GraveyardMessageSchema, PartyMessageSchema, PCMessageSchema, PokemonDeathMessageSchema, PokemonEVIVSchema, PokemonHiddenPowerSchema, PokemonHPSchema, PokemonMetSchema, PokemonMiscSchema, PokemonMovesSchema, PokemonReviveMessageSchema, PokemonShadowSchema, PokemonStatusSchema, RoutesMessageSchema, SettingsMessageSchema, PokemonEXPSchema, PokemonSchema } from './v3_pb.js';
import * as V3DataTypes from './v3_pb.js';
import { fromBinary, toJsonString } from '@bufbuild/protobuf';
import { EventEmitter, htmlColors, statusColors, typeColors, string2ColHex, ParamsManager, isDefined, hex2rgba, examplePokemon, resolveIllegalCharacters } from './global.js';
import Handlebars from 'handlebars';
import collect from 'collect.js';
export const homeSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/pokemon/home/' +
    '{{ifElse isShiny "shiny" "normal"}}' +
    '/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}' +
    '{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}' +
    '{{addFemaleTag this "-f"}}.png';
export const itemSpriteTemplate = 'https://assets.pokelink.xyz/v2/sprites/items/{{toLower (underscoreSpaces (remove translations.english.misc?.heldItem "."))}}.png';
export const clientSettings = {
    debug: false,
    params: new ParamsManager(),
    host: 'localhost',
    port: 3000,
    users: [],
    useFallbackSprites: false,
    spriteTemplate: Handlebars.compile(homeSpriteTemplate),
    itemSpriteTemplate: Handlebars.compile(itemSpriteTemplate)
};
const spriteUpdate = 'theme:settings:sprite';
const spriteReset = 'theme:settings:spriteReset';
let client = null;
const events = new EventEmitter();
function globalInitialize(numberOfPlayers = 1) {
    if (numberOfPlayers < 1) {
        numberOfPlayers = 1;
    }
    clientSettings.debug = clientSettings.params.getBool('debug', false);
    if (clientSettings.debug) {
        console.debug('Pokélink library now running in debug mode');
    }
    clientSettings.host = clientSettings.params.getString('server', 'localhost');
    clientSettings.port = clientSettings.params.getNumber('port', 3000);
    let value = clientSettings.params.getString('users', '');
    if (value.indexOf(',') === -1) {
        clientSettings.users = [value];
    }
    else {
        clientSettings.users = value.split(',');
    }
    if (numberOfPlayers < clientSettings.users.length) {
        let newList = [];
        for (let i = 0; i < numberOfPlayers && i < clientSettings.users.length; i++) {
            if (clientSettings.users[0] === undefined) {
                i--;
                clientSettings.users.shift();
                continue;
            }
            newList.push(clientSettings.users.shift());
        }
        if (newList.length <= numberOfPlayers) {
            console.error('The following users will not be updated due to not fitting in the theme:', clientSettings.users);
        }
        clientSettings.users = newList;
    }
    clientSettings.useFallbackSprites = clientSettings.params.getBool('useLocalSprites', false);
}
export function spriteTestInitialize() {
    globalInitialize();
}
const schemaStorage = {};
const componentCallbacks = {};
const partyId = 'pokelink.component.party';
const goalsId = 'pokelink.component.goals';
const graveyardId = 'pokelink.component.graveyard';
const reviveId = 'pokelink.component.revive';
const deathId = 'pokelink.component.death';
const settingsId = 'pokelink.component.settings';
const pcId = 'pokelink.component.pc';
const routesId = 'pokelink.component.routes';
const pokemonId = 'pokemon';
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
};
const goalsSubcomponents = {
    'sprite': 'sprite',
    'name': 'name',
    'category': 'category',
    'levelCap': 'levelCap'
};
const graveyardSubcomponents = {
    'pokemon': 'pokemon'
};
export var V3;
(function (V3) {
    let v3Settings = {
        numberOfPlayers: 1,
        listenForSpriteUpdates: true
    };
    let hasRegisteredParty = false;
    let hasRegisteredGraveyard = false;
    let hasRegisteredDeath = false;
    let hasRegisteredRevive = false;
    function initializeClient(componentConfigs = null) {
        client = new PokelinkClientV3(componentConfigs, clientSettings.users);
        client.events.once('disconnected', () => {
            events.emit('disconnected');
            setTimeout(() => {
                initializeClient(componentConfigs);
            }, 1000);
        });
        client.events.on('connect', () => {
            events.emit('connect');
        });
        client.events.on('componentUpdate', (key, component) => {
            const callbacks = componentCallbacks[key] ?? [];
            if (clientSettings.debug) {
                console.debug(`Received update for ${key} calling:`, callbacks);
            }
            for (const cb of callbacks) {
                try {
                    cb(component);
                }
                catch (ex) {
                    console.error(cb, 'encountered the following error:', ex);
                }
            }
        });
    }
    function initialize(settings = null, componentConfigs = null) {
        v3Settings = { ...v3Settings, ...settings };
        globalInitialize(v3Settings.numberOfPlayers);
        initializeClient(componentConfigs);
        if (v3Settings.listenForSpriteUpdates) {
            if (clientSettings.params.hasKey('template')) {
                const newTemplate = clientSettings.params.getString('template', undefined);
                if (isDefined(newTemplate)) {
                    updateSpriteTemplate(newTemplate);
                }
            }
        }
    }
    V3.initialize = initialize;
    function registerPartyComponentListener() {
        registerComponentListener(partyId, (component) => {
            let party = [];
            for (let member of component.party) {
                if (!isDefined(member)) {
                    party.push(null);
                    continue;
                }
                party.push(convertFromPokemonProtobuf(member));
            }
            events.emit(partyId, party);
        });
    }
    function registerGraveyardComponentListener() {
        registerComponentListener(graveyardId, (component) => {
            let graves = [];
            for (let grave of component.graves) {
                if (!isDefined(grave)) {
                    graves.push(null);
                    continue;
                }
                let flatGrave = {
                    id: grave.id,
                    timeOfDeath: grave.timeOfDeath
                };
                if (isDefined(grave.pokemon)) {
                    flatGrave.pokemon = convertFromPokemonProtobuf(grave.pokemon);
                }
                graves.push(flatGrave);
            }
            events.emit(graveyardId, graves);
        });
    }
    function registerDeathComponentListener() {
        registerComponentListener(deathId, (component) => {
            if (!isDefined(component.grave?.pokemon)) {
                return;
            }
            const grave = component.grave;
            let flatGrave = {
                id: grave.id,
                timeOfDeath: grave.timeOfDeath
            };
            if (isDefined(grave.pokemon)) {
                flatGrave.pokemon = convertFromPokemonProtobuf(grave.pokemon);
            }
            events.emit(deathId, flatGrave);
        });
    }
    function registerReviveComponentListener() {
        registerComponentListener(reviveId, (component) => {
            events.emit(reviveId, component.graveId);
        });
    }
    function convertFromPokemonProtobuf(pokemon) {
        let flatPokemon = {
            form: pokemon.form,
            gender: pokemon.gender,
            hasFemaleSprite: pokemon.hasFemaleSprite,
            isEgg: pokemon.isEgg,
            isShiny: pokemon.isShiny,
            pid: pokemon.pid,
            species: pokemon.species,
            translations: pokemon.translations,
            uid: pokemon.uid
        };
        for (const key in pokemon.subComponents) {
            const schema = getComponentSchema(`${pokemonId}.${key}`);
            if (!isDefined(schema)) {
                continue;
            }
            const component = fromBinary(schema, pokemon.subComponents[key].value);
            let temp = {};
            temp[key] = JSON.parse(toJsonString(schema, component, { alwaysEmitImplicit: true }));
            flatPokemon = { ...flatPokemon, ...temp };
        }
        return flatPokemon;
    }
    V3.convertFromPokemonProtobuf = convertFromPokemonProtobuf;
    function onPartyUpdate(handler) {
        if (!hasRegisteredParty) {
            hasRegisteredParty = true;
            registerPartyComponentListener();
        }
        events.on(partyId, handler);
    }
    V3.onPartyUpdate = onPartyUpdate;
    function onGraveyardUpdate(handler) {
        if (!hasRegisteredGraveyard) {
            hasRegisteredGraveyard = true;
            registerGraveyardComponentListener();
        }
        events.on(graveyardId, handler);
    }
    V3.onGraveyardUpdate = onGraveyardUpdate;
    function onDeath(handler) {
        if (!hasRegisteredDeath) {
            hasRegisteredDeath = true;
            registerDeathComponentListener();
        }
        events.on(deathId, handler);
    }
    V3.onDeath = onDeath;
    function onRevive(handler) {
        if (!hasRegisteredRevive) {
            hasRegisteredRevive = true;
            registerReviveComponentListener();
        }
        events.on(reviveId, handler);
    }
    V3.onRevive = onRevive;
    function onSpriteTemplateUpdate(handler) {
        events.on(spriteUpdate, handler);
    }
    V3.onSpriteTemplateUpdate = onSpriteTemplateUpdate;
    function onSpriteSetReset(handler) {
        events.on(spriteReset, handler);
    }
    V3.onSpriteSetReset = onSpriteSetReset;
    function onConnect(handler) {
        events.on('connect', handler);
    }
    V3.onConnect = onConnect;
    function isValidPokemon(pokemon) {
        return isDefined(pokemon?.species);
    }
    V3.isValidPokemon = isValidPokemon;
    function getSprite(pokemon) {
        let output;
        if (clientSettings.useFallbackSprites) {
            // noinspection HttpUrlsUsage
            output = getFallbackImg(pokemon);
        }
        else {
            output = resolveIllegalCharacters(clientSettings.spriteTemplate(pokemon));
        }
        console.debug(output, pokemon);
        return output?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`);
    }
    V3.getSprite = getSprite;
    function getPartySprite(pokemon) {
        let output;
        if (clientSettings.useFallbackSprites) {
            output = getPartyFallbackImg(pokemon);
        }
        else {
            output = resolveIllegalCharacters(clientSettings.spriteTemplate(pokemon));
        }
        return output?.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`);
    }
    V3.getPartySprite = getPartySprite;
    function getFallbackImg(pokemon) {
        // noinspection HttpUrlsUsage
        return `http://${clientSettings.host}:${clientSettings.port}/api/pokelink/fallback/`; // TODO: Replace with API call
    }
    V3.getFallbackImg = getFallbackImg;
    function getPartyFallbackImg(pokmeon) {
        // noinspection HttpUrlsUsage
        return `http://${clientSettings.host}:${clientSettings.port}/api/pokelink/partyFallback/`; // TODO: Replace with API call
    }
    V3.getPartyFallbackImg = getPartyFallbackImg;
    function useFallback(img, pokemon) {
        let fallback = getFallbackImg(pokemon);
        if (img.src === fallback || !isDefined(fallback)) {
            return;
        }
        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${fallback}`);
        }
        img.src = fallback;
    }
    V3.useFallback = useFallback;
    function usePartyFallback(img, pokemon) {
        let fallback = getPartyFallbackImg(pokemon);
        if (img.src === fallback || !isDefined(fallback)) {
            return;
        }
        if (clientSettings.debug) {
            console.debug(`${img.src} encountered an error. Falling back to ${fallback}`);
        }
        img.src = fallback;
    }
    V3.usePartyFallback = usePartyFallback;
    function getTypeColor(englishType) {
        let value = typeColors[englishType];
        if (!isDefined(value)) {
            return 'white';
        }
        return value;
    }
    V3.getTypeColor = getTypeColor;
    function getStatusColor(englishStatus) {
        let value = statusColors[englishStatus];
        if (isDefined(value)) {
            return 'white';
        }
        return value;
    }
    V3.getStatusColor = getStatusColor;
    function updateSpriteTemplate(template) {
        if (!v3Settings.listenForSpriteUpdates || !isDefined(template) || template.length <= 0) {
            events.emit(spriteReset);
            return;
        }
        try {
            let test = Handlebars.compile(template);
            test(examplePokemon);
            clientSettings.spriteTemplate = test;
            if (clientSettings.debug) {
                console.debug('Received new sprite template:', template);
            }
            events.emit(spriteUpdate);
        }
        catch (ex) {
            console.error('Failed to assign new sprite template');
            console.error(ex);
        }
    }
    V3.updateSpriteTemplate = updateSpriteTemplate;
    function registerComponentListener(id, callback) {
        if (!isDefined(componentCallbacks[id])) {
            componentCallbacks[id] = [];
        }
        let callbacks = componentCallbacks[id];
        callbacks.push(callback);
    }
    V3.registerComponentListener = registerComponentListener;
    function registerComponentSchema(id, componentSchema) {
        if (isDefined(schemaStorage[id])) {
            return false;
        }
        schemaStorage[id] = componentSchema;
        return true;
    }
    V3.registerComponentSchema = registerComponentSchema;
    function getComponentSchema(id) {
        let schema = schemaStorage[id];
        if (isDefined(schema)) {
            return schema;
        }
        return null;
    }
    V3.getComponentSchema = getComponentSchema;
    function pokelinkHostToUrl(input) {
        return input.replace('$POKELINK_HOST', `http://${clientSettings.host}:${clientSettings.port}`);
    }
    V3.pokelinkHostToUrl = pokelinkHostToUrl;
    registerComponentListener(settingsId, (component) => {
        if (v3Settings.listenForSpriteUpdates && !clientSettings.params.hasKey('template')) {
            const spriteTemplate = component.settings['spriteTemplate'];
            if (isDefined(spriteTemplate)) {
                if (spriteTemplate.setting.case === 'string') {
                    updateSpriteTemplate(spriteTemplate.setting.value);
                }
            }
        }
    });
})(V3 || (V3 = {}));
V3.registerComponentSchema(partyId, PartyMessageSchema);
V3.registerComponentSchema(goalsId, GoalsMessageSchema);
V3.registerComponentSchema(graveyardId, GraveyardMessageSchema);
V3.registerComponentSchema(reviveId, PokemonReviveMessageSchema);
V3.registerComponentSchema(deathId, PokemonDeathMessageSchema);
V3.registerComponentSchema(settingsId, SettingsMessageSchema);
V3.registerComponentSchema(pcId, PCMessageSchema);
V3.registerComponentSchema(routesId, RoutesMessageSchema);
V3.registerComponentSchema(pokemonId, PokemonSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.misc}`, PokemonMiscSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.status}`, PokemonStatusSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.hp}`, PokemonHPSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.exp}`, PokemonEXPSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.evs}`, PokemonEVIVSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.ivs}`, PokemonEVIVSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.stats}`, PokemonEVIVSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.hiddenPower}`, PokemonHiddenPowerSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.met}`, PokemonMetSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.moves}`, PokemonMovesSchema);
V3.registerComponentSchema(`${pokemonId}.${pokemonSubcomponents.shadow}`, PokemonShadowSchema);
export { htmlColors, statusColors, typeColors, EventEmitter, V3DataTypes, string2ColHex, collect, isDefined, hex2rgba, resolveIllegalCharacters, Handlebars, partyId, goalsId, graveyardId, reviveId, deathId, settingsId, pcId, routesId, pokemonSubcomponents, goalsSubcomponents, graveyardSubcomponents };
