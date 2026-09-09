import {defineComponent, PropType} from 'vue'
import {V3, clientSettings, typeColors, V3DataTypes} from 'pokelink'
import type {Pokemon} from 'pokelink'
import type {Nullable} from 'global'
import heartGauge from '../../../../_shared/components/heartGauge.vue.js'

export default defineComponent({
    template: `
      <div :class="[statusClass, { 'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage }]">
        <div v-if="isValid" style="display: flex;">

          <div class="pokemon__details">
            <div class="pokemon__level">
              <small>Lv. {{ pokemon.exp?.level }}</small>
            </div>
            <div class="pokemon__name">
              {{ nickname }}
            </div>
          </div>

          <div class="pokemon__image">
            <img v-if="pokemon.isEgg" @error="useFallback" ref="pokemonImg" class="sprite" :src="sprite()" style="transform: scale(0.8); bottom: 0px;"/>
            <img v-else class="sprite" @error="useFallback" ref="pokemonImg" :src="sprite()"/>
          </div>
          <div class="hp" v-if="!pokemon.isEgg">
            <div
                :style="{height:healthPercent}"
                :class="{ hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"
            ></div>
          </div>
          <heart-gauge v-if="!pokemon.isEgg" :pokemon="pokemon" orientation="vertical"></heart-gauge>
        </div>
        <div v-else></div>
      </div>
    `,
    components: {
        'heart-gauge': heartGauge
    },
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        }
    },
    data() {
        return {
            justTookDamage: false
        }
    },
    mounted() {
        const vm = this
        V3.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate()
        })
    },
    methods: {
        useFallback() {
            V3.useFallback(this.$refs.pokemonImg as HTMLImageElement, this.pokemon)
        },
        sprite() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return ''
            }

            return V3.getSprite(this.pokemon)
        },
    },
    computed: {
        isValid() {
            return V3.isValidPokemon(this.pokemon)
        },
        healthPercent() {
            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current + '%'
        },
        isDead() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return false
            }

            return this.pokemon.hp!.current === 0
        },
        isSleeping() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return false
            }

            return this.pokemon.status === V3DataTypes.StatusEffect.asleep
        },
        nickname() {
            return this.pokemon.misc?.nickname || this.pokemon.translations!.english!.species
        },
        sex() {
            return (this.pokemon.gender === V3DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V3DataTypes.Gender.female ? 'female' : 'male'))
        },
        ident() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return null
            }
            return this.pokemon.species
        },
        opacity() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return '0.4'
            }
            return '1'
        },
        hasItem() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return false
            }
            return this.pokemon.misc?.heldItem !== 0
        },
        experienceRemaining() {
            return `${this.pokemon.exp?.nextLevelPercent}%`
        },
        statusClass() {
            if (!V3.isValidPokemon(this.pokemon)) {
                return ''
            }

            switch (this.pokemon.status) {
                case V3DataTypes.StatusEffect.badlyPoisoned:
                case V3DataTypes.StatusEffect.poisoned:
                    return 'isPoisoned'
                case V3DataTypes.StatusEffect.paralyzed:
                    return 'isParalyzed'
                case V3DataTypes.StatusEffect.burned:
                    return 'isBurned'
                case V3DataTypes.StatusEffect.frozen:
                    return 'isFrozen'
            }

            return ''
        },
        selectedPokemon: {
            get: function () {
                return this.nickname
            },
            set: function () {
                this.$emit('change', this.nickname)
            }
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
