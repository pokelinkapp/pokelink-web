import { defineComponent } from 'vue';
import { V2 } from 'pokelink';
export default defineComponent({
    template: `
      <div>
        <div :class="{ 'pokemon__slot': true }" v-if="pokemon !== null">
          <div :class="{ 'pokemon__image': true, 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img ref="pokemonSprite" @error="useFallback" :src="sprite()"/>
          </div>
        </div>
        <div class="pokemon__slot pokemon__empty" v-else>
          <div class="pokemon__image">
          </div>
        </div>
      </div>
    `,
    mounted() {
        const vm = this;
        V2.handleSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
    },
    props: {
        pokemon: {
            default: null,
            type: Object,
            required: false
        }
    },
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite, this.pokemon);
        },
        sprite() {
            return V2.getSprite(this.pokemon);
        }
    }
});
//# sourceMappingURL=pokemon-card.vue.js.map