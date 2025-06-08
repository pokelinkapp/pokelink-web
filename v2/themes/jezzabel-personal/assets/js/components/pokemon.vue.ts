import {defineComponent, PropType} from 'vue'
import {V2, clientSettings, typeColors, V2DataTypes} from 'pokelink'
import type {Pokemon} from 'v2Proto'
import type {Nullable} from 'global'
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js'

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
            <div class="pokemon__level">
              <small>Lv.</small>{{ pokemon.level }}
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

          <div class="exp" v-if="!pokemon.isEgg">
            <div :style="{width:experienceRemaining}" class="exp__inner"></div>
          </div>
        </div>
        <div v-else></div>
      </div>
    `,
    components: {
        'trimmedSprite': trimmedSprite
    },
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        }
    },
    data() {
        return {
            justTookDamage: false,
            loaded: false
        }
    },
    mounted() {
        const vm = this
        V2.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate()
        })
    },
    methods: {
        getSprite(pokemon: Pokemon) {
            return V2.getSprite(pokemon)
        }
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        },
        healthPercent() {
            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current + '%'
        },
        isDead() {
            if (!this.isValid) {
                return false
            }

            return parseFloat(this.healthPercent) === 0
        },
        isSleeping() {
            if (!this.isValid) {
                return false
            }

            return this.pokemon.status === V2DataTypes.StatusEffect.asleep
        },
        isPoisoned() {
            if (!this.isValid) {
                return false
            }

            return this.pokemon.status === V2DataTypes.StatusEffect.poisoned
        },
        nickname() {
            return this.pokemon.nickname || this.pokemon.translations!.locale!.speciesName
        },
        sex() {
            return (this.pokemon.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V2DataTypes.Gender.female ? 'female' : 'male'))
        },
        ident() {
            if (!this.isValid) {
                return null
            }
            return this.pokemon.species
        },
        opacity() {
            if (!this.isValid) {
                return '0.4'
            }
            return '1'
        },
        hasItem() {
            if (!this.isValid) {
                return false
            }

            return this.pokemon.heldItem !== 0
        },
        experienceRemaining() {
            if (!this.isValid) {
                return '0%'
            }
            return `${this.pokemon.expPercentage}%`
        },
        nameStyle() {
            let styles: {} = {
                'opacity': this.opacity
            }

            if (this.pokemon) {
                let primaryType = this.pokemon.translations!.english!.types[0]
                let secondaryType = primaryType
                if (this.pokemon.translations!.english!.types.length < 1) {
                    secondaryType = this.pokemon.translations!.english!.types[1]
                }

                styles = {
                    ...styles,
                    'background-image': 'linear-gradient(180deg, ' + typeColors[primaryType] + ', ' + typeColors[secondaryType] + ')'
                }
            }

            return styles
        }
    },
    watch: {
        pokemon(newVal, oldVal) {
            try {
                if (newVal.hp.current < oldVal.hp.current) {
                    this.justTookDamage = true
                    setTimeout(() => {
                        this.justTookDamage = false
                    }, 3000)
                }
            } catch (e) {
                return
            }
        }
    }
})
