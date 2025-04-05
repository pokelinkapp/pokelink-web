import {defineComponent} from 'vue'
import {V2, clientSettings} from 'pokelink'
import pokemon from './pokemon.vue.js'

export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in partySlots" :slotId="idx + 1" :key="'slot' + idx" :pokemon="poke">
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
            vm.party = party
            vm.$forceUpdate()
        }))
    },
    methods: {
        update(val) {
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