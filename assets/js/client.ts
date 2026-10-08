import {EventEmitter, Nullable} from './global.js'
import {clientSettings} from './pokelink.js'

export abstract class PokelinkClientBase {
    protected connection: Nullable<WebSocket> = null
    private static firstConnect: boolean = true
    public readonly events: EventEmitter = new EventEmitter()

    protected openConnection() {
        if (clientSettings.debug) {
            console.debug('Attempting to connect')
        }

        try {
            this.connection = new WebSocket(`ws://${clientSettings.host}:${clientSettings.port}`)
        } catch {
            this.events?.emit('disconnected')
            return
        }

        this.connection!.binaryType = 'arraybuffer'

        this.connection!.onopen = () => {
            this.events.emit('connect')
            this.connection!.onerror = event => {
                this.events.emit('disconnected')
                console.error('WebSocket error:', event)
            }
            this.connection!.onmessage = event => {
                this.OnMessageReceived(new Uint8Array(event.data))
            }
            this.SendHandshake()
        }
        this.connection!.onclose = () => {
            this.events.emit('disconnected')
        }
    }

    public reconnect() {
        this.connection?.close()
        this.openConnection()
    }

    protected ShowUser(user: Nullable<string>): boolean {
        if (user === null || user === undefined) {
            return false
        }
        return clientSettings.users.indexOf(user) !== -1
    }

    protected abstract SendHandshake(): void

    protected abstract OnMessageReceived(buffer: Uint8Array): void
}