import {defineComponent, PropType} from 'vue'
import type {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div class="heart-gauge" v-if="!pokemon.isEgg && pokemon.isShadow">
        <div
            :style="{width: heartGaugeRemaining}"
            class="heart-gauge__inner"
        ></div>
        <div class="heart-gauge__segments"></div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        }
    },
    computed: {
        heartGaugeRemaining(): string {
            return `${this.pokemon.heartGaugePercentage ?? 0}%`
        }
    }
})