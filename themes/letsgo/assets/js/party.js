import { createApp } from 'vue';
import { V3, clientSettings, isDefined, settingsId, settingsSubcomponents, partyId, pokemonSubcomponents } from 'pokelink';
import pokemonCard from './components/pokemon.vue.js';
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
            this.resetSpriteSet();
            V3.onSpriteSetReset(this.resetSpriteSet);
            const components = {};
            components[settingsId] = [
                settingsSubcomponents.spriteTemplate
            ];
            components[partyId] = {
                partySize: V3.getPartySize(),
                fromSlot: V3.getFromSlot(),
                pokemon: [
                    pokemonSubcomponents.misc,
                    pokemonSubcomponents.exp,
                    pokemonSubcomponents.stats,
                    pokemonSubcomponents.hp,
                    pokemonSubcomponents.status,
                    pokemonSubcomponents.shadow
                ]
            };
            V3.initialize(components);
            this.settings.verticalPokemon = clientSettings.params.getBool('verticalPokemon', false);
            this.settings.hp = clientSettings.params.getBool('hp', false);
            V3.onPartyUpdate((party) => {
                vm.party = party;
                this.loaded = true;
                vm.$forceUpdate();
            });
            V3.onConnect(() => {
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
            resetSpriteSet() {
                V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/national/animated' +
                    '{{ifElse isShiny "-shiny" ""}}' +
                    '/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}' +
                    '{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}' +
                    '{{addFemaleTag this "-f"}}.gif');
            },
            isDefined(obj) {
                return isDefined(obj);
            }
        }
    }).mount('#party');
})();
//# sourceMappingURL=party.js.map