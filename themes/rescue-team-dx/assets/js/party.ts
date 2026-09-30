import {createApp} from 'vue'
import {V3, clientSettings, isDefined, ComponentConfig, partyId, pokemonSubcomponents} from 'pokelink'
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

            V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/rescue-team-dx/normal/{{ species }}.png')

            const components: ComponentConfig = {}
            components[partyId] = {
                partySize: V3.getPartySize(),
                fromSlot: V3.getFromSlot(),
                pokemon: [
                    pokemonSubcomponents.hp,
                    pokemonSubcomponents.misc,
                    pokemonSubcomponents.shadow
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
        }
    }).mount('#party')
})()