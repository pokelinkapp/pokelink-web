import {createApp} from 'vue'
import {V2, clientSettings} from 'pokelink'
import type {Nullable} from 'global'
import type {Pokemon} from 'v2Proto'
import pokemonCard from './components/pokemon.vue.js'

export function pokemonTCGCardSets() {
    let userDefinedSets = clientSettings.params.getString('sets', '')!

    if (userDefinedSets !== null && userDefinedSets.length > 0) {
        return userDefinedSets.split('|')
    }

    return [
        'base1',
        'base2',
        'basep',
        'ex3',
        'pop5',
        'pop1',
        'pop3',
        'xyp',
        'col1',
        'dp1',
        'dp2',
        'dp3',
        'dp4',
        'swsh1',
        'swsh2',
        'ex15',
        'ex12',
        'dp6',
        'pl2',
        'bw11',
        'bw10',
        'bw9',
        'bw8',
        'bw7',
        'bw6',
        'bw5',
        'bw4',
        'bw4',
        'bw3',
        'bw2',
        'bw1',
        'xy1',
        'xy2',
        'xy3',
        'xy4',
        'xy5',
        'xy6',
        'xy7',
        'xy8',
    ]
}

(() => {
    createApp({
        components: {
            'pokemon-card': pokemonCard
        },
        data() {
            return {
                connected: false,
                loaded: false,
                settings: {},
                party: [],
                switchSpeed: 'switchMedium',
            }
        },
        mounted: function () {
            const vm = this
            V2.initialize()

            this.settings.verticalPokemon = clientSettings.params.getBool('verticalPokemon', false)
            this.settings.noGap = clientSettings.params.getBool('noGap', false)

            V2.handlePartyUpdates((party: Nullable<Pokemon>[]) => {
                vm.party = party
                this.loaded = true

                requestAnimationFrame(() => {
                    let currentFixedTimeline = document.timeline.currentTime;
                    document.getAnimations().map((tickerAnim) => {
                        tickerAnim.cancel();
                        tickerAnim.currentTime = currentFixedTimeline;
                        tickerAnim.play();
                    })
                })


                vm.$forceUpdate()
            })

            V2.onConnect(() => {
                vm.connected = true
            })
        },
        computed: {
            singleSlot() {
                return clientSettings.params.hasKey('slot')
            },
            slotId() {
                let availableSlots = [1, 2, 3, 4, 5, 6]
                if (clientSettings.params.hasKey('slot') && availableSlots.includes(clientSettings.params.getNumber('slot', 1))) {
                    return clientSettings.params.getNumber('slot', 1) - 1
                }
                return 0
            },
            pokemonToShow() {
                if (this.singleSlot) {
                    return [this.party[this.slotId]]
                }

                if (clientSettings.params.hasKey('fromSlot') && clientSettings.params.hasKey('slots')) {
                    return this.party.slice(clientSettings.params.getNumber('fromSlot', 1) - 1,
                        clientSettings.params.getNumber('fromSlot', 1) -
                        1 +
                        clientSettings.params.getNumber('slots'))
                }

                return this.party
            },
            showEmptySlots() {
                if (this.singleSlot) {
                    return false
                }

                if (clientSettings.params.hasKey('fromSlot') && clientSettings.params.hasKey('slots')) {
                    return this.pokemonToShow.includes(false)
                }

                if (this.party.length !== 6) {
                    return true
                }

                return true
            }
        }
    }).mount('#party')
})()
