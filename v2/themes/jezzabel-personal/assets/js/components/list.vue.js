import { defineComponent } from 'vue';
import { V2, clientSettings, isDefined } from 'pokelink';
import pokemon from './pokemon.vue.js';
export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in partySlots" :slotId="idx + 1" :key="poke?.pid" :pokemon="poke">
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
        };
    },
    created: function () {
        this.loaded = true;
    },
    mounted() {
        let vm = this;
        this.flipped = clientSettings.params.getBool('flipped', false);
        V2.onPartyUpdate((party => {
            vm.party = party;
            vm.$forceUpdate();
        }));
    },
    methods: {
        isValid(pokemon) {
            return V2.isValidPokemon(pokemon);
        },
        isDefined(obj) {
            return isDefined(obj);
        }
    },
    computed: {
        partySlots() {
            const filteredParty = this.party.filter(this.isDefined);
            return [...new Array(6).keys()]
                .map(slot => {
                return filteredParty[slot] || {};
            });
        }
    }
});
//# sourceMappingURL=list.vue.js.map