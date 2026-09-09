import { defineComponent } from 'vue';
import { V3, typeColors, V3DataTypes } from 'pokelink';
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js';
import heartGauge from '../../../../_shared/components/heartGauge.vue.js';
export default defineComponent({
    template: `
      <div
          :class="{'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage, isPoisoned: isPoisoned }"
          :style="activeStyles"
      >
        <div v-if="isValid">
          <div class="hp" v-if="!pokemon.isEgg">
            <div :style="{width:healthPercent}"
                 :class="{ hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
          </div>

          <div class="sleeping" v-if="isSleeping">
            <span>z</span>
            <span>z</span>
            <span>z</span>
          </div>

          <div class="pokemon__row">
            <div class="pokemon__level" v-if="!this.pokemon.isEgg">
              <small>Lv.</small>{{ pokemon.exp?.level }}
            </div>
            <trimmedSprite
                v-if="isValid"
                :key="ident"
                :get-sprite="getSprite"
                :pokemon="pokemon"
                :maxBoundingBoxHeight="95"
                @done="loaded = true"
            ></trimmedSprite>
          </div>

          <div class="pokemon__name" :style="nameStyle">
            {{ nickname }}
          </div>

          <heart-gauge :pokemon="pokemon"></heart-gauge>
          <div class="exp" v-if="!pokemon.isEgg && !pokemon.isShadow">
            <div :style="{width:experienceRemaining}" class="exp__inner"></div>
          </div>
        </div>
        <div v-else></div>
      </div>
    `,
    components: {
        'trimmedSprite': trimmedSprite,
        'heart-gauge': heartGauge
    },
    props: {
        pokemon: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            justTookDamage: false,
            loaded: false
        };
    },
    mounted() {
        const vm = this;
        V3.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
    },
    methods: {
        getSprite(pokemon) {
            return V3.getSprite(pokemon);
        }
    },
    computed: {
        isValid() {
            return V3.isValidPokemon(this.pokemon);
        },
        healthPercent() {
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + '%';
        },
        isDead() {
            if (!this.isValid) {
                return false;
            }
            return parseFloat(this.healthPercent) === 0;
        },
        isSleeping() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.status === V3DataTypes.StatusEffect.asleep;
        },
        isPoisoned() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.status === V3DataTypes.StatusEffect.poisoned || this.pokemon.status === V3DataTypes.StatusEffect.badlyPoisoned;
        },
        nickname() {
            return this.pokemon.misc?.nickname || this.pokemon.translations.locale.species;
        },
        sex() {
            return (this.pokemon.gender === V3DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V3DataTypes.Gender.female ? 'female' : 'male'));
        },
        ident() {
            if (!this.isValid) {
                return null;
            }
            return this.pokemon.species;
        },
        opacity() {
            if (!this.isValid) {
                return '0.4';
            }
            return '1';
        },
        hasItem() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.misc?.heldItem !== 0;
        },
        experienceRemaining() {
            if (!this.isValid) {
                return '0%';
            }
            return `${this.pokemon.exp?.nextLevelPercent}%`;
        },
        nameStyle() {
            let styles = {
                'opacity': this.opacity
            };
            if (this.pokemon) {
                let primaryType = this.pokemon.translations.english.types[0];
                let secondaryType = primaryType;
                if (this.pokemon.translations.english.types.length < 1) {
                    secondaryType = this.pokemon.translations.english.types[1];
                }
                styles = {
                    ...styles,
                    'background-image': 'linear-gradient(180deg, ' + typeColors[primaryType] + ', ' + typeColors[secondaryType] + ')'
                };
            }
            return styles;
        }
    },
    watch: {
        pokemon(newVal, oldVal) {
            try {
                if (newVal.hp.current < oldVal.hp.current) {
                    this.justTookDamage = true;
                    setTimeout(() => {
                        this.justTookDamage = false;
                    }, 3000);
                }
            }
            catch (e) {
                return;
            }
        }
    }
});
//# sourceMappingURL=pokemon.vue.js.map