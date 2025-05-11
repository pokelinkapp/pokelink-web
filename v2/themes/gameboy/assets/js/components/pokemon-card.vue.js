import { defineComponent } from 'vue';
import { V2 } from 'pokelink';
export default defineComponent({
    template: `
  <div class="party_row" v-if="isValid">
    <div class="sprite"><img ref="pokemonImg" @error="useFallback" :src="imageTag()"/></div>
    <div class="details">
      <div class="half top">
        <div class="identity text">
          <span v-if="pokemon.isShiny"><img src="./assets/images/shiny.png" alt="" /></span>{{ pokemon.nickname || pokemon.translations.locale.speciesName }} <span class="pokemon__gender pokemon__gender-male" v-if="pokemon.isGenderless == 0 && pokemon.isFemale == 0">♂</span><span class="pokemon__gender pokemon__gender-female" v-if="pokemon.isGenderless == 0 && pokemon.isFemale == 1">♀</span>
        </div>
        <div class="hp text">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</div>
      </div>
      <div class="half bottom">
        <div class="level half">
<!--          <span :class="' text pokemon__status  pokemon__status-'+ pokemon.status.img.toLowerCase()" v-if="pokemon.status.img != 0">-->
<!--              {{pokemon.status.img}}-->
<!--          </span>-->
          <span class="level text">:L{{pokemon.level}}</span>
        </div>
        <div class="half heathBar">
          <div class="heathBar__label text">HP:</div>
          <div class="healthBar__bar">
            <div class="bar">
              <div class="health" :style="{ width: healthPercent }" :class="{ low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
            </div>
          </div>
          <div class="healthBar__chock"></div>
        </div>
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
    mounted() {
        const vm = this;
        V2.handleSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
    },
    methods: {
        useFallback() {
            V2.usePartyFallback(this.$refs.pokemonImg, this.pokemon);
        },
        imageTag() {
            if (!this.isValid) {
                return null;
            }
            return V2.getPartySprite(this.pokemon);
        },
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon);
        },
        healthPercent() {
            if (!this.isValid) {
                return `0%`;
            }
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + "%";
        },
    }
});
//# sourceMappingURL=pokemon-card.vue.js.map