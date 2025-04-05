import {EventEmitter, Nullable} from './global.js'
import {clientSettings} from './pokelink.js'

export abstract class PokelinkClientBase {
    protected connection: Nullable<WebSocket> = null
    private firstConnect: boolean = true
    public readonly events: EventEmitter = new EventEmitter()

    public openConnection() {
        this.connection = new WebSocket(`ws://${clientSettings.host}:${clientSettings.port}`)

        this.connection.binaryType = 'arraybuffer'

        let vm = this

        this.connection.onopen = ev => {
            if (this.firstConnect) {
                this.firstConnect = false
                this.events.emit('connect')
                console.log('Successfully connected to server')
            }
            vm.connection!.onmessage = event => {
                this.OnMessageReceived(new Uint8Array(event.data))
            }
            vm.SendHandshake()
        }

        this.connection.onclose = () => {
            setTimeout(() => location.reload(), 10000)
        }

        this.connection.onerror = event => {
            console.error('WebSocket error:', event)
        }
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