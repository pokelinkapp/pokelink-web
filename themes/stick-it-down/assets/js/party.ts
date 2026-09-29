import {createApp} from 'vue'
import {
    V3, clientSettings, isDefined, ComponentConfig, settingsId, settingsSubcomponents, partyId,
    pokemonSubcomponents
} from 'pokelink'
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

            V3.onSpriteSetReset(this.resetSpriteSet)

            const components: ComponentConfig = {}
            components[settingsId] = [
                settingsSubcomponents.spriteTemplate
            ]
            components[partyId] = [
                pokemonSubcomponents.misc,
                pokemonSubcomponents.exp,
                pokemonSubcomponents.hp,
                pokemonSubcomponents.status,
                pokemonSubcomponents.shadow
            ]

            V3.initialize(components)

            V3.onConnect(() => {
                vm.connected = true
                this.loaded = true
            })
            this.settings = clientSettings
        },
        mounted: function () {
        },
        methods: {
            resetSpriteSet() {
                V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/gen7/normal/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}{{addFemaleTag this "-f"}}.png')
            }
        }
    }).mount('#party')
})()