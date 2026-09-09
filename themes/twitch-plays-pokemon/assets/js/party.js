import { createApp } from 'vue';
import { V3, clientSettings } from 'pokelink';
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
            this.resetSpriteSet();
            V3.onSpriteSetReset(this.resetSpriteSet);
            V3.initialize();
            V3.onConnect(() => {
                vm.connected = true;
                this.loaded = true;
            });
            this.settings = clientSettings;
        },
        mounted: function () {
        },
        methods: {
            resetSpriteSet() {
                V3.updateSpriteTemplate('https://assets.pokelink.xyz/V3/sprites/pokemon/heartgold-soulsilver/{{ifElse isShiny "shiny" "normal"}}/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}{{addFemaleTag this "-f"}}.png');
            }
        }
    }).mount('#party');
})();
//# sourceMappingURL=party.js.map