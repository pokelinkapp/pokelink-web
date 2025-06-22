import {createApp} from 'vue'
import {V2, clientSettings, isDefined} from 'pokelink'
import list from './components/list.vue.js'

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
            }
        },
        created: function () {
            const vm = this

            this.resetSpriteSet()

            V2.onSpriteSetReset(this.resetSpriteSet)

            V2.initialize()

            V2.onConnect(() => {
                vm.connected = true
                this.loaded = true
            })
            this.settings = clientSettings
        },
        mounted: function () {
        },
        methods: {
            resetSpriteSet() {
                V2.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/heartgold-soulsilver/{{ifElse isShiny "shiny" "normal"}}/{{toLower (noSpaces (nidoranGender translations.english.speciesName "" "-f"))}}{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}{{addFemaleTag this "-f"}}.png')
            }
        }
    }).mount('#party')
})()