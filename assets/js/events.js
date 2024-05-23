/* Polyfill indexOf. */
var indexOf

if (typeof Array.prototype.indexOf === 'function') {
    indexOf = function (haystack, needle) {
        return haystack.indexOf(needle)
    }
} else {
    indexOf = function (haystack, needle) {
        var i = 0, length = haystack.length, idx = -1, found = false

        while (i < length && !found) {
            if (haystack[i] === needle) {
                idx = i
                found = true
            }

            i++
        }

        return idx
    }
}


/* Polyfill EventEmitter. */
var EventEmitter = function () {
    this.events = {}
}

EventEmitter.prototype.on = function (event, listener) {
    if (typeof this.events[event] !== 'object') {
        this.events[event] = []
    }

    this.events[event].push(listener)
    return this.events
}

EventEmitter.prototype.removeListener = function (event, listener) {
    var idx

    if (typeof this.events[event] === 'object') {
        idx = indexOf(this.events[event], listener)

        if (idx > -1) {
            this.events[event].splice(idx, 1)
        }
    }
}

EventEmitter.prototype.emit = function (event) {
    var i, listeners, length, args = [].slice.call(arguments, 1)

    if (typeof this.events[event] === 'object') {
        listeners = this.events[event].slice()
        length = listeners.length

        for (i = 0; i < length; i++) {
            listeners[i].apply(this, args)
        }
    }
}

EventEmitter.prototype.once = function (event, listener) {
    this.on(event, function g() {
        this.removeListener(event, g)
        listener.apply(this, arguments)
    })
}

/* Polyfill NeoClient. */
const NeoClient = function (address) {
    let events = new EventEmitter()
    let firstTimeConnect = true
    let connection
    let protobufTypes = {}
    protobufTypes['v1'] = {}

    function loadV1Protos() {
        protobuf.load('../../assets/proto/V1.proto', function (err, root) {
            if (err) {
                throw err
            }

            protobufTypes['v1']['client:party:updated'] = root.lookupType('Pokelink.Core.Proto.V1.PartyMessage')
            protobufTypes['v1']['player:settings:updated'] = root.lookupType('Pokelink.Core.Proto.V1.SettingsMessage')
            protobufTypes['v1']['client:badges:updated'] = root.lookupType('Pokelink.Core.Proto.V1.BadgesMessage')
            protobufTypes['v1']['base'] = root.lookupType('Pokelink.Core.Proto.V1.Base')
            openConnection()
        })
    }

    function openConnection() {
        try {
            connection = new WebSocket(address)
        } catch {
            setTimeout(openConnection, 2000)
            return
        }
        connection.binaryType = 'arraybuffer'

        connection.onopen = function (ev) {
            if (firstTimeConnect) {
                events.emit('connect', ev.target)
                firstTimeConnect = false;
            }
            connection.onmessage = event => {
                let buffer = new Uint8Array(event.data)
                let data = null
                let user = null
                let channel = null
                try {
                    const base = protobufTypes['v1']['base'].decode(buffer)
                    channel = base.channel
                    if (!protobufTypes['v1'].hasOwnProperty(channel)) {
                        console.error(`Unknown channel ${channel}`)
                        return
                    } 
                    let decoded = protobufTypes['v1'][channel].decode(buffer)
                    data = protobufTypes['v1'][channel].toObject(decoded)
                    delete data.channel
                    user = data.username
                    delete data.username

                } catch (ex) {
                    console.error(ex)
                }

                if (channel === 'client:badges:updated') {
                    events.emit(channel, {username: user, trainer: data.trainer})
                } else {
                    events.emit(channel, {username: user, update: data})
                }
            }

            connection.send(JSON.stringify({
                handshake: {
                    version: 1, client: 'WebSource', dataType: 'Protobuf', gzip: false
                }
            }))
        }
        connection.onclose = () => {
            setTimeout(openConnection, 250)
        }
        this.connection = connection
    }

    loadV1Protos()

    this.events = events
}

NeoClient.prototype.on = function (event, listener) {
    this.events.on(event, listener)
    return this
}

NeoClient.prototype.removeListener = function (event, listener) {
    this.events.removeListener(event, listener)
}

NeoClient.prototype.emit = function (event) {
    this.events.emit(event, arguments)
}

NeoClient.prototype.once = function (event, listener) {
    this.events.once(event, listener)
    return this
}