import {createApp} from 'vue'
import {V2, clientSettings} from 'pokelink'
import pokemonCard from './components/pokemon-card.vue.js'

(() => {
    createApp({
        components: {
            'pokemon-card': pokemonCard
        }, data() {
            return {
                connected: false, loaded: false, settings: {}, party: [], switchSpeed: 'switchMedium'
            }
        }, created: function () {
            this.settings = clientSettings
        }, mounted: function () {
            const vm = this
            V2.initialize()

            V2.handlePartyUpdates((party => {
                vm.party = party
                this.loaded = true
                vm.$forceUpdate()
            }))

            V2.onConnect(() => {
                vm.connected = true
            })
        }, computed: {
            singleSlot() {
                return !!clientSettings.params.has('slot')
            }, slotId() {
                let availableSlots = [1, 2, 3, 4, 5, 6]
                if (clientSettings.params.has('slot') && availableSlots.includes(parseInt(params.get('slot')))) {
                    return clientSettings.params.get('slot') - 1
                }
                return 0
            }, pokemonToShow() {
                if (this.singleSlot === true) {
                    return [this.party[this.slotId]]
                }

                if (clientSettings.params.has('fromSlot') && params.has('slots')) {
                    return this.party.slice(parseInt(clientSettings.params.get('fromSlot')) - 1, parseInt(clientSettings.params.get('fromSlot')) - 1 + parseInt(clientSettings.params.get('slots')))
                }

                return this.party
            }, showEmptySlots() {
                if (this.singleSlot === true) {
                    return false
                }

                if (clientSettings.params.has('fromSlot') && clientSettings.params.has('slots')) {
                    return !!this.pokemonToShow.includes(false);
                }

                if (this.party.length !== 6) {
                    return true
                }

                return true
            }
        }
    }).mount('#party')
})()
