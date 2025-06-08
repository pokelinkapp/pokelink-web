import { createApp } from 'vue';
import { clientSettings, isDefined, V2 } from 'pokelink';
import pokeImg from './components/pokeImg.vue.js';
function sortDeaths(x, y) {
    let f = x.graveyardMeta?.timeOfDeath?.seconds;
    let l = y.graveyardMeta?.timeOfDeath?.seconds;
    if (!isDefined(f) || !isDefined(l)) {
        return 0;
    }
    if (f > l) {
        return 1;
    }
    if (f < l) {
        return -1;
    }
    return 0;
}
(() => {
    createApp({
        components: {
            pokeImg: pokeImg
        },
        data: function () {
            return {
                connected: false,
                loaded: false,
                deaths: [],
                prefixText: ''
            };
        },
        created: function () {
            this.loaded = true;
        },
        mounted: function () {
            const vm = this;
            V2.initialize({ listenForSpriteUpdates: false });
            this.prefixText = clientSettings.params.getString('prefixText', '');
            V2.onDeath((pokemon) => {
                let deaths = vm.deaths;
                deaths.push(pokemon);
                vm.deaths = deaths.sort(sortDeaths);
            });
            V2.onRevive((graveId) => {
                vm.deaths = vm.deaths.filter((x) => x.graveyardMeta?.id !== graveId);
            });
            V2.onSpriteTemplateUpdate(() => {
                const deaths = vm.deaths;
                vm.deaths = [];
                vm.deaths = deaths;
                vm.$forceUpdate();
            });
            V2.onConnect(() => {
                vm.connected = true;
                vm.loaded = true;
            });
        },
        computed: {
            showCounter() {
                return clientSettings.params.getBool('counter', true);
                // return this.type === VIEW_TYPE_COUNTER
            },
            showNames() {
                return clientSettings.params.getBool('showNames', false);
                // return this.type === VIEW_TYPE_COUNTER
            },
            scroll() {
                return clientSettings.params.getBool('scroll', false);
                // return this.type === VIEW_TYPE_COUNTER
            }
        }
    }).mount('#deaths');
})();
//# sourceMappingURL=deathCounter.js.map