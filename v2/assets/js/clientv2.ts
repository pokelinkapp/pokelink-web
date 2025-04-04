import {PokelinkClientBase} from './client.js'
import {
    BadgesSchema,
    BaseSchema,
    PartySchema,
    PokemonDeathSchema,
    PokemonReviveSchema,
    SettingsSchema
} from './v2_pb.js'
import {fromBinary} from '@bufbuild/protobuf'
import {Nullable} from './global'
import {clientSettings} from './pokelink.js'

export const PartyChannel = 'client:party:updated'
export const BadgesChannel = 'client:badges:updated'
export const DeathChannel = 'client:party:death'
export const ReviveChannel = 'client:party:revive'
export const SettingsChannel = 'client:settings:updated'

export class PokelinkClientV2 extends PokelinkClientBase {
    private readonly protobufTypes: { [key: string]: any } = {}

    constructor() {
        super()
        this.openConnection()

        this.protobufTypes[PartyChannel] = PartySchema
        this.protobufTypes[BadgesChannel] = BadgesSchema
        this.protobufTypes[DeathChannel] = PokemonDeathSchema
        this.protobufTypes[ReviveChannel] = PokemonReviveSchema
        this.protobufTypes[SettingsChannel] = SettingsSchema
    }

    protected SendHandshake(): void {
        if (this.connection === null || this.connection == undefined) {
            return
        }

        this.connection.send(JSON.stringify({
            handshake: {
                version: 2,
                client: 'WebSource',
                dataType: 'Protobuf',
                gzip: false
            }
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
                console.debug(`No user valid. Skipping update`, user, clientSettings.users)
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