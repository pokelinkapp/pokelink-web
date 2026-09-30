import {createApp} from 'vue'
import {
    V3,
    clientSettings,
    isDefined,
    homeSpriteTemplate,
    ComponentConfig,
    settingsId,
    settingsSubcomponents, partyId, pokemonSubcomponents
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

            V3.onSpriteSetReset(() => {
                V3.updateSpriteTemplate(homeSpriteTemplate)
            })

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
                    pokemonSubcomponents.hp,
                    pokemonSubcomponents.status,
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