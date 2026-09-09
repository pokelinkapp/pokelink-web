import {createApp} from 'vue'
import {V3, clientSettings, Nullable} from 'pokelink'
import display from './components/display.vue.js'

(() => {
    createApp({
        components: {
            'display': display
        },
        data() {
            return {
                connected: false,
                loaded: false,
                settings: {},
            }
        },
        created: function () {
            this.settings = clientSettings
        },
        mounted: function () {
            V3.onConnect(() => {
                this.connected = true
            })
        }
    }).mount('#party')
})()
