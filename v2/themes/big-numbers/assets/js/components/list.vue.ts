import {defineComponent} from 'vue'
import {V2, clientSettings, isDefined} from 'pokelink'
import pokemon from './pokemon.vue.js'
import {Nullable} from 'global'
import {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped, 'horizontal': horizontal}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in partySlots" :slotId="idx + 1" :key="poke.pid" :pokemon="poke">
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
        this.horizontal = clientSettings.params.getBool('horizontal', false)
        V2.onPartyUpdate((party => {
            vm.party = party
            vm.$forceUpdate()
        }))
    },
    methods: {
        isDefined(obj: Nullable<any>) {
            return isDefined(obj)
        }
    },
    computed: {
        partySlots() {
            const filteredParty = this.party.filter(this.isDefined)
            return [...new Array(6).keys()]
                .map(slot => {
                    return filteredParty[slot] || {}
                })
        }
    }
})