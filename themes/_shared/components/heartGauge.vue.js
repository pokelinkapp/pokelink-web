import { defineComponent } from 'vue';
export default defineComponent({
    template: `
      <div
          :class="['heart-gauge', { 'heart-gauge--vertical': orientation === 'vertical' }]"
          v-if="!pokemon.isEgg && pokemon.shadow?.isShadow"
          role="meter"
          aria-label="Shadow heart gauge"
          :aria-valuenow="pokemon.shadow?.heartGaugePercent ?? 0"
          aria-valuemin="0"
          aria-valuemax="100"
      >
        <div
            :style="innerStyle"
            class="heart-gauge__inner"
        ></div>
        <div v-if="segmented" class="heart-gauge__segments" aria-hidden="true"></div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object,
            required: true
        },
        orientation: {
            type: String,
            default: 'horizontal'
        },
        segmented: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        heartGaugeRemaining() {
            return `${this.pokemon.shadow?.heartGaugePercent ?? 0}%`;
        },
        innerStyle() {
            return this.orientation === 'vertical'
                ? { height: this.heartGaugeRemaining }
                : { width: this.heartGaugeRemaining };
        }
    }
});
//# sourceMappingURL=heartGauge.vue.js.map