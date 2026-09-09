import { defineComponent } from 'vue';
import { V3, clientSettings, homeSpriteTemplate, isDefined } from 'pokelink';
import pokemon from './pokemon.vue.js';
export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in partySlots" :slotId="idx + 1" :key="poke?.uid ?? poke?.pid" :pokemon="poke">
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
        let vm = this;
        V3.onSpriteSetReset(() => {
            V3.updateSpriteTemplate(homeSpriteTemplate);
        });
        V3.initialize();
        V3.onPartyUpdate((party => {
            vm.loaded = true;
            vm.party = party;
        }));
    },
    mounted() {
        this.flipped = clientSettings.params.getBool('flipped', false);
    },
    computed: {
        partySlots() {
            const filteredParty = this.party.filter(this.isDefined);
            return [...new Array(6).keys()]
                .map(slot => {
                return filteredParty[slot] || {};
            });
        }
    },
    methods: {
        isDefined(obj) {
            return isDefined(obj);
        }
    }
});
//# sourceMappingURL=list.vue.js.map