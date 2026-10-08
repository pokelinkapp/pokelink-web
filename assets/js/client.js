import { EventEmitter } from './global.js';
import { clientSettings } from './pokelink.js';
export class PokelinkClientBase {
    connection = null;
    static firstConnect = true;
    events = new EventEmitter();
    openConnection() {
        if (clientSettings.debug) {
            console.debug('Attempting to connect');
        }
        try {
            this.connection = new WebSocket(`ws://${clientSettings.host}:${clientSettings.port}`);
        }
        catch {
            this.events?.emit('disconnected');
            return;
        }
        this.connection.binaryType = 'arraybuffer';
        this.connection.onopen = () => {
            this.events.emit('connect');
            this.connection.onerror = event => {
                this.events.emit('disconnected');
                console.error('WebSocket error:', event);
            };
            this.connection.onmessage = event => {
                this.OnMessageReceived(new Uint8Array(event.data));
            };
            this.SendHandshake();
        };
        this.connection.onclose = () => {
            this.events.emit('disconnected');
        };
    }
    reconnect() {
        this.connection?.close();
        this.openConnection();
    }
    ShowUser(user) {
        if (user === null || user === undefined) {
            return false;
        }
        return clientSettings.users.indexOf(user) !== -1;
    }
}
