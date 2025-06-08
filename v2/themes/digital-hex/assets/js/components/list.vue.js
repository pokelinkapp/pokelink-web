import { defineComponent } from 'vue';
import { V2, clientSettings, homeSpriteTemplate } from 'pokelink';
import pokemon from './pokemon.vue.js';
export default defineComponent({
    template: `
      <div style="display: none" :class="{ 'browser-connected' : true }" class="pokes">
        <transition-group :name="switchSpeed" tag="div"
                          :class="['pokemon__list', {'flipped': flipped}]"
                          v-if="loaded">
          <pokemon v-for="( poke, idx ) in party" :slotId="idx + 1" :key="poke?.pid" :pokemon="poke">
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
        V2.onSpriteSetReset(() => {
            V2.updateSpriteTemplate(homeSpriteTemplate);
        });
        V2.initialize();
        V2.onPartyUpdate((party => {
            vm.loaded = true;
            vm.party = party;
        }));
    },
    mounted() {
        this.flipped = clientSettings.params.getBool('flipped', false);
    },
    computed: {
        partySlots() {
            return [...new Array(6).keys()]
                .map(slot => {
                return this.party[slot] || {};
            });
        }
    }
});
//# sourceMappingURL=list.vue.js.map