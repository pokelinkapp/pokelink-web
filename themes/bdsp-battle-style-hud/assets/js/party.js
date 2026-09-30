import { createApp } from 'vue';
import { V3, clientSettings, isDefined, partyId, pokemonSubcomponents } from 'pokelink';
import pokemon from './components/pokemon.vue.js';
(() => {
    createApp({
        components: {
            'pokemon': pokemon
        },
        data() {
            return {
                connected: false,
                loaded: false,
                party: [],
                switchSpeed: 'switchMedium'
            };
        },
        created: function () {
            this.settings = clientSettings;
        },
        mounted: function () {
            const vm = this;
            const components = {};
            components[partyId] = {
                partySize: V3.getPartySize(),
                fromSlot: V3.getFromSlot(),
                pokemon: [
                    pokemonSubcomponents.misc,
                    pokemonSubcomponents.hp,
                    pokemonSubcomponents.shadow
                ]
            };
            if (!clientSettings.params.getBool('hideLevel', false)) {
                components[partyId].pokemon.push(pokemonSubcomponents.exp);
            }
            V3.initialize(components);
            V3.onPartyUpdate((party => {
                vm.party = party;
                this.loaded = true;
                vm.$forceUpdate();
            }));
            V3.onConnect(() => {
                vm.connected = true;
            });
        },
        computed: {
            singleSlot() {
                return !clientSettings.params.hasKey('slot');
            },
            slotId() {
                let availableSlots = [1, 2, 3, 4, 5, 6];
                if (clientSettings.params.hasKey('slot') && availableSlots.includes(clientSettings.params.getNumber('slot'))) {
                    return clientSettings.params.getNumber('slot') - 1;
                }
                return 0;
            },
            pokemonToShow() {
                if (this.singleSlot) {
                    return [this.party[this.slotId]];
                }
                if (clientSettings.params.hasKey('fromSlot') && clientSettings.params.hasKey('slots')) {
                    return this.party.slice(clientSettings.params.getNumber('fromSlot') - 1, clientSettings.params.getNumber('fromSlot') -
                        1 +
                        clientSettings.params.getNumber('slots')).filter(this.isDefined);
                }
                return this.party.filter(this.isDefined);
            },
            showEmptySlots() {
                if (this.singleSlot) {
                    return false;
                }
                if (clientSettings.params.hasKey('fromSlot') && clientSettings.params.hasKey('slots')) {
                    return this.pokemonToShow.includes(false);
                }
                if (this.party.length !== 6) {
                    return true;
                }
                return true;
            }
        },
        methods: {
            isDefined(obj) {
                return isDefined(obj);
            }
        }
    }).mount('#party');
})();
//# sourceMappingURL=party.js.map