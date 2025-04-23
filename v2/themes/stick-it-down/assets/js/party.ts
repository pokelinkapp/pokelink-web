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

            V2.updateSpriteTemplate('https://assets.pokelink.xyz/assets/sprites/pokemon/gen7/normal/{{toLower (noSpaces (nidoranGender translations.english.speciesName \"\" \"-f\"))}}{{ifElse (isDefined translations.english.formName) (concat \"-\" (toLower (noSpaces translations.english.formName))) \"\"}}{{addFemaleTag this \"-f\"}}.png')

            V2.initialize()

            V2.onConnect(() => {
                vm.connected = true
                this.loaded = true
            })
            this.settings = clientSettings
        },
        mounted: function () {
        }
    }).mount('#party')
})()