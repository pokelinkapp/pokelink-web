import {defineComponent} from 'vue'
import {V2, clientSettings} from 'pokelink'
import pokemon from './pokemon.vue.js'
import type {Pokemon} from 'v2Proto'
import type {Nullable} from 'global'

export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true, 'darkMode': darkMode }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in party" :slotId="idx + 1" :key="poke?.pid ?? idx" :pokemon="poke">
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
        V2.handlePartyUpdates((party => {
            vm.party = party
            vm.$forceUpdate()
        }))
    },
    methods: {},
    computed: {
        darkMode() {
            return clientSettings.params.getBool('darkMode', false)
        }
    }
})