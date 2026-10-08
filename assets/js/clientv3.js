import { PokelinkClientBase } from './client.js';
import { PacketSchema, } from './v3_pb.js';
import { fromBinary } from '@bufbuild/protobuf';
import { clientSettings, V3 } from './pokelink.js';
export class PokelinkClientV3 extends PokelinkClientBase {
    allowAllUsers = false;
    users = [];
    componentConfigs = null;
    constructor(componentConfigs = null, users = []) {
        super();
        this.users = users;
        this.allowAllUsers = this.users.length === 0;
        this.componentConfigs = componentConfigs;
        this.openConnection();
    }
    updateComponents(componentConfigs) {
        this.componentConfigs = componentConfigs;
        this.send({
            update: {
                components: this.componentConfigs
            }
        });
    }
    updateUsers(users = []) {
        this.users = users;
        this.allowAllUsers = this.users.length === 0;
        this.send({
            update: {
                users: this.users
            }
        });
    }
    SendHandshake() {
        this.send({
            handshake: {
                version: 3,
                client: 'Overlay',
                dataType: 'Protobuf',
                gzip: false,
                components: this.componentConfigs,
                users: this.users
            }
        });
    }
    send(message) {
        if (this.connection?.readyState !== 1 /*OPEN*/) {
            return;
        }
        if (clientSettings.debug) {
            console.debug("Sending: ", message);
        }
        this.connection.send(JSON.stringify(message));
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
                this.events.emit('componentUpdate', key, parsedComponent, user);
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
}
