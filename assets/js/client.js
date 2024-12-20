window.settings = {}
settings = deepmerge(settings, defaultSettings)
settings = deepmerge(settings, themeSettings)
settings = deepmerge(settings, clientSettings)
if (window.settings.debug) {
    console.log(settings)
}

if (typeof pokedex !== 'undefined') {
    pokedex = collect(pokedex)
}

if (typeof movedex !== 'undefined') {
    movedex = collect(movedex)
}

if (typeof itemdex !== 'undefined') {
    itemdex = collect(itemdex)
}

let loadCustomSprites = (socket, payload, cb) => {
    // return fetch('./../../assets/sprites/spritesets.json')
    return fetch('https://assets.pokelink.xyz/assets/sprites/spritesets.json', {cors: 'no-cors'})
        .then(response => response.json())
        .then(data => {
            window.settings.spritesets = data.spritesets
            if (params.has('spriteset')) {
                let customSpriteSet = data.spritesets.pokemon
                    .find(set => set.name.toLowerCase() === params.get('spriteset').toLowerCase())

                if (customSpriteSet) {
                    window.settings = deepmerge(window.settings, customSpriteSet.settings)
                    client.handleRemotePlayerSettings(null, {
                        ...payload, updatedSettings: {
                            settings: {
                                ...customSpriteSet
                            }
                        }
                    }, cb)
                }
            }
        })
}

let template = {
    'pokemon': {
        'is_active_in_battle': false,
        'isEgg': 0,
        'exp': 5181,
        'hp': {
            'max': 72, 'current': 72
        },
        'nature': 'Relaxed',
        'move2': {
            'name': 'Ice Ball', 'pp': 20
        },
        'isGenderless': true,
        'speciesName': 'Walrein',
        'species': 578,
        'status': {
            'psn': 0, 'slp': 0, 'par': 0, 'fzn': 0, 'brn': 0
        },
        'nickname': null,
        'levelMet': 6,
        'isShiny': false,
        'pid': Math.random() * 10000,
        'ability': '--',
        'level': 19,
        'hiddenpower': 'Psychic',
        'move1': {
            'name': 'Powder Snow', 'pp': 25
        },
        'pokerus': 0,
        'evs': {
            'atk': 35, 'def': 6, 'spatk': 7, 'spd': 24, 'spdef': 14, 'hp': 11
        },
        'isFemale': false,
        'move4': {
            'name': 'Body Slam', 'pp': 15
        },
        'heldItem': 200,
        'ivs': {
            'atk': 6, 'def': 29, 'spatk': 27, 'spd': 14, 'spdef': 27, 'hp': 7
        },
        'locationMet': 60,
        'move3': {
            'name': 'Water Gun', 'pp': 25
        }
    }, 'slotId': 1, 'changeId': 0
}

const createParty = () => {
    const page = params.get('page') || 1
    const start = (page - 1) * 15
    return pokedex.slice(start, 15).items.map((pokemon, idx) => {
        let tempPokemon = {...template.pokemon, species: pokemon.id, speciesName: pokemon.name.english}
        if (pokemon.id == 0) {
            tempPokemon = {
                ...tempPokemon, species: 1, isEgg: true
            }
        }
        return {slotId: idx, changeId: 1, pokemon: tempPokemon}
    })
}

const normalizeAndParseHost = (serverHost) => {
    try {
        let URLParts = new URL(serverHost)
        if (params.get('neo')?.toLowerCase() === 'true') {
            URLParts.protocol = 'ws:'
        } else {
            URLParts.protocol = 'http:'
        }

        return URLParts.href
    } catch (e) {
        if (params.get('neo')?.toLowerCase() === 'true') {
            `ws://${serverHost}/`
        }
        return `http://${serverHost}/`
    }
}

const loadProtobuf = (callback) => {
    const existingScript = document.getElementById('protobuf')

    if (existingScript) {
        callback()
        return
    }

    const script = document.createElement('script')
    script.src = '../../assets/libs/protobuf.min.js'
    script.id = 'protobuf'
    document.body.appendChild(script)

    script.onload = () => {
        callback()
    }
}

const loadExternalSocketIO = (baseUrl, neo, callback) => {
    if (neo) {
        loadProtobuf(callback)
        return
    }

    const existingScript = document.getElementById('socketIOClient')

    if (!existingScript) {
        const script = document.createElement('script')
        script.src = `${baseUrl}socket.io/socket.io.js` // URL for the third-party library being loaded.
        script.id = 'socketIOClient' // e.g., googleMaps or stripe
        document.body.appendChild(script)

        script.onload = () => {
            if (callback) callback()
        }
    }

    if (existingScript && callback) callback()
}

var events = []
var rootSocket = null

var client = {
    connection: null,
    players: [],
    connected: false,
    username: null,
    currentUser: settings.currentUser,
    events: new EventEmitter(),
    neo: false,

    setup(serverPort, username, host, cb) {
        let neo = params.get('neo')
        if (neo) {
            this.neo = neo.toLowerCase() === 'true'
        }
        if (host === 'localhost') host = 'http://localhost'
        host = host || 'http://127.0.0.1'
        this.username = username
        let address = normalizeAndParseHost(host + ':' + serverPort)

        loadExternalSocketIO(address, this.neo, () => {
            if (neo) {
                rootSocket = this.connection = new NeoClient(address)
            } else {
                try {
                    rootSocket = this.connection = io(address, {
                        transports: ['websocket'], extraHeaders: {
                            'Access-Control-Allow-Origin': '*', 'Access-Control-Request-Private-Network': true
                        }
                    })
                } catch (e) {
                    rootSocket = this.connection = io(address, {
                        transports: ['websocket'], extraHeaders: {
                            'Access-Control-Allow-Origin': '*'
                        }
                    })
                }
            }


            rootSocket.on('connect', socket => {
                this.log('Client Connected')
                this.connected = true

                if (params.has('test')) {
                    let event = {
                        event: 'client:party:updated', payload: {
                            username: settings.currentUser, update: {
                                party: createParty()
                            }
                        }
                    }
                    events.push(event)
                    this.handleRemotePlayerParty(socket, event.payload, cb)
                }

                if (params.has('spriteset')) {
                    loadCustomSprites(null, {
                        username: this.currentUser
                    }, cb)
                }

                if (params.has('test')) return

                rootSocket
                    .on('client:party:updated', (data) => {
                        let event = {
                            event: 'client:party:updated', payload: data
                        }
                        events.push(event)
                        console.log(event)
                        this.handleRemotePlayerParty(socket, data, cb)
                    })
                    .on('client:badges:updated', (data) => {
                        let event = {
                            event: 'client:badges:updated', payload: data
                        }
                        events.push(event)
                        console.log(event)
                        this.handleRemotePlayerTrainer(socket, data, cb)
                    })
                    .on('client:players:list', (players) => {
                        let event = {
                            event: 'client:players:list', payload: players
                        }
                        events.push(event)
                        console.log(event)
                        this.addPlayersInBulk(socket, players, cb)
                    })
                    .on('player:trainer:updated', (data) => {
                        let event = {
                            event: 'player:trainer:updated', payload: data
                        }
                        events.push(event)
                        console.log(event)
                        this.handleRemotePlayerTrainer(socket, data, cb)
                    })
                    .on('player:settings:updated', (data) => {
                        let event = {
                            event: 'player:settings:updated', payload: data
                        }
                        events.push(event)
                        console.log(event)
                        this.handleRemotePlayerSettings(socket, data, cb)
                    })
                    .on('player:party:death', (data) => {
                        let event = {
                            event: 'player:party:death', payload: data
                        }
                        events.push(event)
                        console.log(event)
                        this.events.emit('player:party:death', event)
                    })
                    .on('player:party:revive', (data) => {
                        let event = {
                            event: 'player:party:revive', payload: data
                        }
                        events.push(event)
                        console.log(event)
                        this.events.emit('player:party:revive', event)
                    })
            })
            // this.connection = io.connect(address, {
            //   // secure: true,
            //   reconnection: true,
            //   rejectUnauthorized: false
            // });
        })

        return this
    },

    on(eventName, callback) {
        this.events.on(eventName, callback)

        return this
    },

    join() {
    },

    handleRemotePlayerTrainer(socket, payload, cb) {
        if (window.settings.debug) {
            console.log('Player Trainer Updated')
            console.log(payload)
        }
        this.events.emit('player:trainer:updated', payload)
    },

    handleRemotePlayerParty(socket, payload, cb) {
        if (window.settings.debug) {
            console.log('Party Updated')
        }
        let newPlayerParty = []

        if (this.players.hasOwnProperty(payload.username) === false) {
            this.players[payload.username] = payload.update.party
        }

        payload.update.party.forEach(mon => {
            newPlayerParty[mon.slotId - 1] = mon
        })

        newPlayerParty = {...this.players[payload.username], ...newPlayerParty}
        this.players = {...this.players, [payload.username]: newPlayerParty}

        this.log('Client Rcv: Player %s updated their party', payload.username)
        cb(payload.username, Object.values(this.players[payload.username]))
        this.events.emit('client:party:updated', this.players[payload.username])
    },

    handleRemotePlayerSettings(socket, payload, cb) {
        if (settings.currentUser !== payload.username) return

        window.settings = deepmerge(window.settings, payload.updatedSettings?.settings ?? payload.update.settings)

        if (this.players[payload.username] !== undefined) {
            const transformedParty = Object.values(this.players[payload.username])
                .map(poke => {
                    if (poke !== null && poke.pokemon !== null && poke.pokemon !== undefined) delete poke['pokemon']['transformed']
    
                    return poke
                })

            console.info(transformedParty)
            cb(payload.username, transformedParty)
            this.events.emit('client:party:updated', transformedParty)
        }


        console.info(`Settings updated`)
        this.events.emit('settings:updated', window.settings)
    },

    addPlayersInBulk(socket, players, cb) {
        if (window.settings.debug) {
            console.log('Initial Bulk Load')
            console.log(players)
        }
        players.forEach((player) => {
            let tempPlayer = {
                id: player.id, username: player.username, update: {
                    party: player.party
                }
            }

            if (player.username === settings.currentUser) {
                settings.game = {
                    id: player.trainer.game.id,
                    name: player.trainer.game.friendlyName,
                    generation: player.trainer.game.generation
                }
                if (window.settings.debug) {
                    console.log(['setting game to gen: ' + settings.game.generation + ' - ' + settings.game.name])
                }
                this.events.emit('player:trainer:updated', player)
                this.events.emit('client:party:updated', player.party)
            }

            this.handleRemotePlayerParty(socket, tempPlayer, (username, newPlayerList) => {
                cb(username, newPlayerList)
            })
        })
        this.events.emit('client:players:list', players)
    },

    log(title, msg, ...params) {
        params = params || []
        console.log.apply(this, [title, msg].concat(params))
    }
}
