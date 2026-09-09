import { createApp } from 'vue';
import { V3, clientSettings, homeSpriteTemplate } from 'pokelink';
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
            V3.onSpriteSetReset(() => {
                V3.updateSpriteTemplate(homeSpriteTemplate);
            });
            V3.initialize();
            V3.onConnect(() => {
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