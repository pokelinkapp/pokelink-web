import {createApp} from 'vue'
import {
    V3, clientSettings, isDefined, pokemonSubcomponents, partyId, settingsId, settingsSubcomponents,
    ComponentConfig
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
            components[partyId] = {
                partySize: V3.getPartySize(),
                fromSlot: V3.getFromSlot(),
                pokemon: [
                    pokemonSubcomponents.misc,
                    pokemonSubcomponents.exp,
                    pokemonSubcomponents.stats,
                    pokemonSubcomponents.hp,
                    pokemonSubcomponents.status,
                    pokemonSubcomponents.shadow,
                    pokemonSubcomponents.moves
                ]
            }

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
                V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/heartgold-soulsilver/{{ifElse isShiny "shiny" "normal"}}/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}{{addFemaleTag this "-f"}}.png')
            }
        }
    }).mount('#party')
})()