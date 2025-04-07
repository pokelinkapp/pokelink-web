import { createApp } from 'vue';
import { V2, clientSettings } from 'pokelink';
import list from './components/list.vue.js';
(() => {
    createApp({
        components: {
            'list': list
        },
        data() {
            return {
                connected: false,
                loaded: false,
                settings: {}
            };
        },
        created: function () {
            const vm = this;
            V2.initialize();
            V2.onConnect(() => {
                vm.connected = true;
                this.loaded = true;
            });
            this.settings = clientSettings;
        },
        mounted: function () {
        }
    }).mount('#party');
})();
//# sourceMappingURL=party.js.map