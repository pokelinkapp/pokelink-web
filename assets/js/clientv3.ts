import {PokelinkClientBase} from './client.js'
import {
    PacketSchema,
} from './v3_pb.js'
import {fromBinary} from '@bufbuild/protobuf'
import {Nullable} from './global'
import {clientSettings, V3} from './pokelink.js'

export class PokelinkClientV3 extends PokelinkClientBase {
    private readonly allowAllUsers: boolean = false

    constructor(allowAllUsers: boolean) {
        super()
        this.allowAllUsers = allowAllUsers
        this.openConnection()
    }

    protected SendHandshake(): void {
        if (this.connection === null || this.connection == undefined) {
            return
        }

        this.connection.send(JSON.stringify({
            handshake: {
                version: 3,
                client: 'Overlay',
                dataType: 'Protobuf',
                gzip: false
            }
        }))
    }

    protected OnMessageReceived(buffer: Uint8Array): void {
        let user: Nullable<string> = null

        try {
            const packet = fromBinary(PacketSchema, buffer)
            user = packet.username

            if (!this.ShowUser(user) && !this.allowAllUsers) {
                console.debug(`No user valid. Skipping update`, user, clientSettings.users)
                return
            }

            for (const key in packet.components) {
                const component = packet.components[key]
                
                const schema = V3.getComponentSchema(key)
                
                if (schema == null) {
                    console.error(`Unknown schema id: ${key}`)
                    continue
                }
                
                let parsedComponent= fromBinary(schema, component.value)
                
                this.events.emit('componentUpdate', key, parsedComponent)
            }
        } catch (ex) {
            console.error(ex)
        }
    }
}