import {defineComponent, PropType} from 'vue'
import {V2} from 'pokelink'
import type {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div>
        <div :class="{ 'pokemon__slot': true }" v-if="pokemon !== null">
          <div :class="{ 'pokemon__image': true, 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img ref="pokemonSprite" @error="useFallback" :src="sprite"/>
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
            type: Object as PropType<Pokemon>,
            required: false
        }
    },
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite as HTMLImageElement, this.pokemon)
        }
    },
    computed: {
        sprite() {
            return V2.getSprite(this.pokemon)
        }
    }
})