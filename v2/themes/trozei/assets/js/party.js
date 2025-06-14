import { createApp } from 'vue';
import { V2, clientSettings, isDefined } from 'pokelink';
import pokemonCard from './components/pokemon-card.vue.js';
(() => {
    createApp({
        components: {
            'pokemon-card': pokemonCard
        },
        data() {
            return {
                connected: false,
                loaded: false,
                settings: {},
                party: [],
                switchSpeed: 'switchMedium'
            };
        },
        mounted: function () {
            const vm = this;
            V2.updateSpriteTemplate('https://assets.pokelink.xyz/assets/sprites/pokemon/trozei/{{ species }}.png');
            V2.initialize({ listenForSpriteUpdates: false });
            this.settings.verticalPokemon = clientSettings.params.getBool('verticalPokemon', false);
            this.settings.hp = clientSettings.params.getBool('hp', false);
            V2.onPartyUpdate((party) => {
                vm.party = party;
                this.loaded = true;
                vm.$forceUpdate();
            });
            V2.onConnect(() => {
                vm.connected = true;
            });
        },
        computed: {
            singleSlot() {
                return clientSettings.params.hasKey('slot');
            },
            slotId() {
                let availableSlots = [1, 2, 3, 4, 5, 6];
                if (clientSettings.params.hasKey('slot') && availableSlots.includes(clientSettings.params.getNumber('slot', 1))) {
                    return clientSettings.params.getNumber('slot', 1) - 1;
                }
                return 0;
            },
            pokemonToShow() {
                if (this.singleSlot) {
                    return [this.party[this.slotId]];
                }
                if (clientSettings.params.hasKey('fromSlot') && clientSettings.params.hasKey('slots')) {
                    return this.party.slice(clientSettings.params.getNumber('fromSlot', 1) - 1, clientSettings.params.getNumber('fromSlot', 1) -
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