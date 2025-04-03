import {PokelinkClientBase} from './client.js'
import {
    BadgesSchema,
    BaseSchema,
    PartySchema,
    PokemonDeathSchema,
    PokemonReviveSchema,
    SettingsSchema,
} from './v2_pb.js'
import {fromBinary} from '@bufbuild/protobuf'
import {Nullable} from './global'

export class PokelinkClientV2 extends PokelinkClientBase {
    private readonly protobufTypes: {[key:string]: any} = {
        'player:party:updated': PartySchema,
        'player:badges:updated': BadgesSchema,
        'player:party:death': PokemonDeathSchema,
        'player:party:revive': PokemonReviveSchema,
        'player:settings:updated': SettingsSchema
    }

    constructor() {
        super()
        this.openConnection()
    }

    protected SendHandshake(): void {
        if (this.connection === null || this.connection == undefined) {
            return
        }

        this.connection.send(JSON.stringify({
            version: 2,
            client: 'WebSource',
            dataType: 'Protobuf',
            gzip: false
        }))
    }

    protected OnMessageReceived(buffer: Uint8Array): void {
        let user: Nullable<string> = null
        let channel = null

        try {
            const base = fromBinary(BaseSchema, buffer)

            channel = base.channel
            user = base.username
            
            if (!this.ShowUser(user)) {
                return
            }

            if (!this.protobufTypes.hasOwnProperty(channel)) {
                console.error(`Unknown channel ${channel}`)
                return
            }

            this.events.emit(channel, fromBinary(this.protobufTypes[channel], buffer))
        } catch (ex) {
            console.error(ex)
        }
    }
}