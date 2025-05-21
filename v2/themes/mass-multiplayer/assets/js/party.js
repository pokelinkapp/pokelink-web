import { createApp } from 'vue';
import { V2, clientSettings } from 'pokelink';
import display from './components/display.vue.js';
(() => {
    createApp({
        components: {
            'display': display
        },
        data() {
            return {
                connected: false,
                loaded: false,
                settings: {},
            };
        },
        created: function () {
            this.settings = clientSettings;
        },
        mounted: function () {
            V2.onConnect(() => {
                this.connected = true;
            });
        }
    }).mount('#party');
})();
//# sourceMappingURL=party.js.map