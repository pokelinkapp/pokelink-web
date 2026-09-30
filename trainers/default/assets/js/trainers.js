import { createApp } from 'vue';
import { clientSettings, trainerTrackerId, V3 } from 'pokelink';
(() => {
    createApp({
        data() {
            return {
                connected: false,
                loaded: false,
                trainers: [],
                settings: {
                    port: 0,
                }
            };
        },
        create() {
        },
        mounted() {
            const vm = this;
            this.settings.port = clientSettings.port;
            const components = {};
            components[trainerTrackerId] = [
                'levelCap'
            ];
            V3.initialize(components);
            V3.onTrainerTrackerUpdate(() => { });
            V3.onConnect(() => {
                vm.connected = true;
            });
        }
    }).mount('#trainers');
})();
//# sourceMappingURL=trainers.js.map