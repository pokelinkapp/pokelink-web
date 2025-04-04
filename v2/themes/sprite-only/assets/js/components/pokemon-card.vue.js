import {defineComponent} from 'vue'
import {V2} from 'pokelink'

export default defineComponent({
    template: `
      <div>
        <div :class="{ 'pokemon__slot': true }" v-if="pokemon !== null">
          <div :class="{ 'pokemon__image': true, 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img ref="pokemonSprite" @error="this.$refs.pokemonSprite.src = this.pokemon.fallbackSprite" :src="sprite"/>
          </div>
        </div>
        <div class="pokemon__slot pokemon__empty" v-else>
          <div class="pokemon__image">
          </div>
        </div>
      </div>
    `,
    props: {
        pokemon: {
            default: null,
            type: Object,
            required: false
        }
    },
    computed: {
        sprite() {
            return V2.getSprite(this.pokemon)
        }
    }
})