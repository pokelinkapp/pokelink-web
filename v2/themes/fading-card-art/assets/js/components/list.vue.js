import {defineComponent} from 'vue'
import {V2, clientSettings, collect} from 'pokelink'
import pokemon from './pokemon.vue.js'
import {pokemonTCGCardSets} from '../party.js'

export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in party" :slotId="idx + 1" :key="'slot' + idx" :pokemon="poke" :art="art[idx]">
          </pokemon>
        </transition-group>
      </div>
    `,
    components: {
        'pokemon': pokemon
    },
    data() {
        return {
            loaded: false,
            party: [],
            art: [null, null, null, null, null],
            players: {},
            party_count: 0,
            switchSpeed: 'switchMedium',
            flipped: false,
            horizontal: false
        }
    },
    created: function () {
        this.loaded = true
        this.flipped = clientSettings.params.get('flipped') === 'true'
    },
    mounted() {
        let vm = this
        V2.handlePartyUpdates((party => {
            if (this.flipped) {
                party = party.reverse()
            }

            this.getArtInBatches(party).then(cards => {
                for (let i = 0; i < party.length; i++) {
                    if (party[i].isEgg) {
                        this.art[i] = 'https://images.pokemontcg.io/pl4/88_hires.png'
                    } else {
                        try {
                            let cardImages = cards.flat().reduce((flat, item) => {
                                return [...flat, ...item.cards]
                            }, []).find(card => card.nationalPokedexNumber === party[i].species)

                            this.art[i] = cardImages.imageUrl
                        } catch (e) {
                            console.log(`unknown image for ${party[i].translations.english.speciesName}`, e)
                            if (clientSettings.debug) {
                                console.debug(cards.cards)
                            }
                        }
                    }

                    if (i === party.length - 1) {
                        vm.party = party
                    }
                }
            })
        }))
    },
    methods: {
        update(val) {
        },
        getArtInBatches (party) {
            let promises = collect(party)
                .chunk(15)
                .map(pokemonList => {
                    let idList = pokemonList.map(mon => mon.species).join('|')
                    return fetch(`https://api.pokemontcg.io/v1/cards?setCode=${pokemonTCGCardSets().join('|')}&supertype=pokemon&nationalPokedexNumber=${idList}`)
                        .then(response => response.json())
                })
            return Promise.all(promises)
        }
    },
    computed: {
        partySlots() {
            return [...new Array(6).keys()]

                .map(slot => {
                    return this.party[slot] || {}
                })
        }
    }
})