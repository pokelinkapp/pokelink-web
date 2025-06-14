import {defineComponent} from 'vue'
import {V2, clientSettings, collect, isDefined} from 'pokelink'
import pokemon from './pokemon.vue.js'
import {pokemonTCGCardSets} from '../party.js'
import type {Pokemon} from 'v2Proto'
import type {Nullable} from 'global'

export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in partySlots" :slotId="idx + 1" :key="poke?.pid ?? idx" :pokemon="poke" :art="art[idx]">
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
            party: [] as Nullable<Pokemon>[],
            art: [null, null, null, null, null] as Nullable<string>[],
            players: {},
            party_count: 0,
            switchSpeed: 'switchMedium',
            flipped: false,
            horizontal: false
        }
    },
    created: function () {
        this.loaded = true
    },
    mounted() {
        let vm = this
        this.flipped = clientSettings.params.getBool('flipped', false)
        V2.onPartyUpdate((party => {
            if (this.flipped) {
                party = party.reverse()
            }
            const filteredParty = party.filter(this.isDefined)

            this.getArtInBatches(filteredParty).then((cards: any) => {
                for (let i = 0; i < filteredParty.length; i++) {
                    if (!this.isDefined(filteredParty[i])) {
                        continue
                    }
                    if (filteredParty[i]!.isEgg) {
                        this.art[i] = 'https://images.pokemontcg.io/pl4/88_hires.png'
                    } else {
                        try {
                            let cardImages = cards.flat().reduce((flat: any, item: any) => {
                                return [...flat, ...item.cards]
                            }, []).find((card: any) => card.nationalPokedexNumber === filteredParty[i]!.species)

                            this.art[i] = cardImages.imageUrl
                        } catch (e) {
                            console.log(`unknown image for ${filteredParty[i]!.translations!.english!.speciesName}`, e)
                            if (clientSettings.debug) {
                                console.debug(cards.cards)
                            }
                        }
                    }
                }
                vm.party = party
            })
        }))
    },
    methods: {
        getArtInBatches(party: any[]) {
            let promises = collect(party)
                .chunk(15)
                .map(async pokemonList => {
                    let idList = pokemonList.filter(mon => isDefined(mon)).map(mon => mon?.species).join('|')
                    if (idList.length === 0) {
                        return {}
                    }
                    let response = await fetch(`https://api.pokemontcg.io/v1/cards?setCode=${pokemonTCGCardSets().join('|')}&supertype=pokemon&nationalPokedexNumber=${idList}`)
                    return await response.json()
                })
            return Promise.all(promises)
        },
        isDefined(obj: Nullable<any>) {
            return isDefined(obj)
        }
    },
    computed: {
        partySlots() {
            const filteredParty = this.party.filter(this.isDefined)
            return [...new Array(6).keys()]
                .map(slot => {
                    return filteredParty[slot]
                })
        }
    }
})