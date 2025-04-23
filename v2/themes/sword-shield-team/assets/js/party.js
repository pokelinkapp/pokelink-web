import { createApp } from 'vue';
import { V2, clientSettings } from 'pokelink';
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
            V2.updateSpriteTemplate('https://assets.pokelink.xyz/assets/sprites/pokemon/pkhex/party/{{toLower (noSpaces (nidoranGender translations.english.speciesName "" "-f"))}}{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}.png');
            V2.initialize({ listenForSpriteUpdates: false });
            V2.handlePartyUpdates((party => {
                vm.party = party;
                this.loaded = true;
                vm.$forceUpdate();
            }));
            V2.onConnect(() => {
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
                        clientSettings.params.getNumber('slots'));
                }
                return this.party;
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
        }
    }).mount('#party');
})();
//# sourceMappingURL=party.js.map