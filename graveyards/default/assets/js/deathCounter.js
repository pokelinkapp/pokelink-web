import { createApp } from 'vue';
import { clientSettings, isDefined, V3, pokemonSubcomponents, graveyardSubcomponents, graveyardId } from 'pokelink';
import pokeImg from './components/pokeImg.vue.js';
function sortDeaths(x, y) {
    let f = x.timeOfDeath?.seconds;
    let l = y.timeOfDeath?.seconds;
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
            const components = {};
            components[graveyardId] = {};
            if (!this.showCounter) {
                components[graveyardId][graveyardSubcomponents.pokemon] = [];
                if (this.showNames) {
                    components[graveyardId][graveyardSubcomponents.pokemon] = [
                        pokemonSubcomponents.misc
                    ];
                }
            }
            V3.initialize({ listenForSpriteUpdates: false }, components);
            this.prefixText = clientSettings.params.getString('prefixText', '');
            V3.onGraveyardUpdate((graveyard) => {
                vm.deaths = graveyard.sort(sortDeaths);
            });
            V3.onDeath((pokemon) => {
                let deaths = vm.deaths;
                deaths.push(pokemon);
                vm.deaths = deaths.sort(sortDeaths);
            });
            V3.onRevive((graveId) => {
                vm.deaths = vm.deaths.filter((x) => x.id !== graveId);
            });
            V3.onSpriteTemplateUpdate(() => {
                const deaths = vm.deaths;
                vm.deaths = [];
                vm.deaths = deaths;
                vm.$forceUpdate();
            });
            V3.onConnect(() => {
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