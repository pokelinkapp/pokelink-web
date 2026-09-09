import { PokelinkClientBase } from './client.js';
import { PacketSchema, } from './v3_pb.js';
import { fromBinary } from '@bufbuild/protobuf';
import { clientSettings, V3 } from './pokelink.js';
export class PokelinkClientV3 extends PokelinkClientBase {
    allowAllUsers = false;
    constructor(allowAllUsers) {
        super();
        this.allowAllUsers = allowAllUsers;
        this.openConnection();
    }
    SendHandshake() {
        if (this.connection === null || this.connection == undefined) {
            return;
        }
        this.connection.send(JSON.stringify({
            handshake: {
                version: 3,
                client: 'Overlay',
                dataType: 'Protobuf',
                gzip: false
            }
        }));
    }
    OnMessageReceived(buffer) {
        let user = null;
        try {
            const packet = fromBinary(PacketSchema, buffer);
            user = packet.username;
            if (!this.ShowUser(user) && !this.allowAllUsers) {
                console.debug(`No user valid. Skipping update`, user, clientSettings.users);
                return;
            }
            for (const key in packet.components) {
                const component = packet.components[key];
                const schema = V3.getComponentSchema(key);
                if (schema == null) {
                    console.error(`Unknown schema id: ${key}`);
                    continue;
                }
                let parsedComponent = fromBinary(schema, component.value);
                this.events.emit('componentUpdate', key, parsedComponent);
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
}
