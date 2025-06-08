import {defineComponent, PropType} from 'vue'
import {V2, V2DataTypes} from 'pokelink'
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js'
import type {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div :style="mainStyle">
        <div
            :class="{ 'pokemon': true, 'isDead': isDead, 'isEmpty': !pokemonExists }"
            :style="{'height': (radius * 2) + 'px', 'width': (radius * 2) + 'px'}"
        >
          <svg
              class="outerHPBar"
              :height="radius * 2"
              :width="radius * 2"
          >
            <circle
                stroke="#d5d5d5"
                :stroke-dasharray="circumference + ' ' + circumference"
                :stroke-width="stroke"
                fill="#ffffff"
                :r="normalizedRadius"
                :cx="radius"
                :cy="radius"
            />
            <circle
                v-if="pokemonExists"
                :class="{hpBar: true, low: healthPercent <= 50, critical: healthPercent <= 15 }"
                stroke="#00ff00"
                :stroke-dasharray="circumference + ' ' + circumference"
                :style="'stroke-dashoffset:' + dashOffset"
                :stroke-width="stroke"
                fill="transparent"
                :r="normalizedRadius"
                :cx="radius"
                :cy="radius"
            />
          </svg>

          <trimmedSprite
              v-if="pokemonExists"
              :key="ident"
              :pokemon="pokemon"
              :maxBoundingBoxHeight="150"
              @done="fixedSprite = true"
              :getSprite="getSprite"
              :style="{'max-height': 'calc(' + radius + 'px * 0.8)', 'max-width': 'calc(' + radius + 'px * 0.8)'}"
          ></trimmedSprite>

          <div class="pokemon__details">
            <div class="pokemon__name">
              {{ nickname }}
            </div>
          </div>
        </div>
      </div>
    `,
    components: {
        'trimmedSprite': trimmedSprite
    },
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        },
        key: {},
        radius: {
            type: Number,
            default() {
                return 100
            }
        },
        stroke: {
            type: Number,
            default() {
                return 10
            }
        }
    },
    data() {
        return {
            fixedSprite: false
        }
    },
    created() {

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
        },
        useFallback() {

        }
    },
    computed: {
        pokemonExists() {
            return V2.isValidPokemon(this.pokemon)
        },
        normalizedRadius() {
            return this.radius - this.stroke * 2
        },
        circumference() {
            return this.normalizedRadius * 2 * Math.PI
        },
        dashOffset() {
            if (!this.pokemonExists) {
                return false
            }
            return this.circumference - (this.healthPercent / 100 * this.circumference)
        },
        healthPercent() {
            if (!this.pokemonExists) {
                return 0
            }
            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current
        },
        isDead() {
            if (!this.pokemonExists) {
                return false
            }

            return this.healthPercent === 0
        },
        level() {
            if (!this.pokemonExists) {
                return null
            }
            return this.pokemon.level || '0'
        },
        nickname() {
            if (!this.pokemonExists) {
                return null
            }
            return this.pokemon.nickname || this.pokemon.translations!.locale!.speciesName
        },
        sex() {
            return (this.pokemon.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V2DataTypes.Gender.female ? 'female' : 'male'))
        },
        ident() {
            if (!this.pokemonExists) {
                return null
            }
            return this.pokemon.pid
        },
        opacity() {
            if (typeof this.pokemon === 'undefined') {
                return '0.4'
            }
            return '1'
        },
        hasItem() {
            if (!this.pokemonExists) {
                return null
            }
            if (typeof this.pokemon === 'undefined') {
                return false
            }
            if (typeof this.pokemon.heldItem === 'undefined') {
                return false
            }

            return this.pokemon.heldItem !== 0
        },
        mainStyle() {
            if (!this.pokemonExists) {
                return null
            }
            return {
                'opacity': this.opacity
            }
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
        pokemon(oldPoke, newPoke) {
            if (oldPoke.img !== newPoke.img) {
                this.fixedSprite = false
            }
        }
    }
})
