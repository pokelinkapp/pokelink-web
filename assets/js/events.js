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
    let connection
    let protobufTypes = {}
    protobufTypes['v1'] = {}

    function loadV1Protos() {
        protobuf.load('../../assets/proto/V1.proto', function (err, root) {
            if (err) {
                throw err
            }

            protobufTypes['v1']['party'] = root.lookupType('Pokelink.Core.Proto.V1.PartyMessage')
            openConnection()
        })
    }

    function openConnection() {
        connection = new WebSocket(address)
        connection.binaryType = 'arraybuffer'

        connection.onopen = function (ev) {
            events.emit('connect', ev.target)
            connection.onmessage = event => {
                let buffer = new Uint8Array(event.data)
                try {
                    const party = protobufTypes['v1']['party'].decode(buffer)
                    let data = protobufTypes['v1']['party'].toObject(party)
                    var channel = data.channel
                    delete data.channel
                    var user = data.username
                    delete data.username

                    events.emit(channel, {username: user, update: data})
                } catch {}

            }

            connection.send(JSON.stringify({
                handshake: {
                    version: 1, client: 'WebSource', dataType: 'Protobuf', gzip: false
                }
            }))
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