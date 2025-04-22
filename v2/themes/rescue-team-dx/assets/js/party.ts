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

            V2.updateSpriteTemplate('https://assets.pokelink.xyz/assets/sprites/pokemon/rescue-team-dx/normal/{{ species }}.png')

            V2.initialize({listenForSpriteUpdates: false})

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