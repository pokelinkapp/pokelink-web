import {defineComponent} from 'vue'
import {V2, clientSettings, typeColors} from 'pokelink'
import trimmedSprite from '../../../../../assets/components/trimmedSprite.vue.js'

export default defineComponent({
    template: `
      <div :style="mainStyle"
           :class="{ 'pokemon': true, 'isDead': isDead, 'isEmpty': !isValid, 'loaded': loaded, 'staggered': staggered }">
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="250"
            height="250"
            viewbox="0 0 250 200"
            style="padding:0px;"
        >
          <path
              id="background"
              class="slot__background"
              fill="#252027"
              stroke-width="0px"
              style=""
              d="M86.60254037844386 5L169.20508075688772 55L169.20508075688772 151L86.60254037844386 201L5 151L5 55Z"
          >
          </path>
          <defs>
            <clipPath id="hexagon">
              <path
                  fill="transparent"
                  stroke-width="0"
                  style=""
                  d="M86.60254037844386 5L169.20508075688772 55L169.20508075688772 151L86.60254037844386 201L5 151L5 55Z"
                  class="slot__border-background"
              >
              </path>
            </clipPath>
          </defs>
          <path
              id="clip"
              class="slot__background-inner"
              :fill="borderColor"
              stroke-width="0px"
              style="opacity:0.3;"
              d="M91.28203230275508 29L155.56406460551017 64L155.56406460551017 137L89.28203230275508 177L29 141L29 61Z"
          >
          </path>
        </svg>

        <trimmedSprite
            v-if="isValid"
            :key="ident"
            :get-sprite="getSprite"
            :pokemon="pokemon"
            :maxBoundingBoxHeight="150"
            @done="loaded = true"
        ></trimmedSprite>

        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="250"
            height="250"
            viewbox="0 0 250 200"
            style="padding:0px;"
            class="slot__border-wrapper"
        >
          <path
              fill="transparent"
              stroke="rgb(62 62 75)"
              stroke-width="10px"
              style=""
              d="M86.60254037844386 5L169.20508075688772 55L169.20508075688772 151L86.60254037844386 201L5 151L5 55Z"
              class="slot__border-background"
          >
          </path>
          <path
              fill="transparent"
              :stroke="borderColor"
              stroke-dasharray="600 600"
              stroke-width="10px"
              stroke-linecap="butt"
              :stroke-dashoffset="dashOffset"
              d="M86.60254037844386 5L169.20508075688772 55L169.20508075688772 151L86.60254037844386 201L5 151L5 55Z"
              class="slot__border"
          >
          </path>
        </svg>
      </div>
    `,
    components: {
        'trimmedSprite': trimmedSprite
    },
    props: {
        pokemon: {},
        key: {},
        stroke: {
            type: Number,
            default() {
                return 10
            }
        }
    },
    data() {
        return {
            loaded: false
        }
    },
    created() {

    },
    methods: {
        getSprite(pokemon) {
            return V2.getSprite(this.pokemon)
        }
    },
    computed: {
        staggered() {
            return (clientSettings.params.get('staggered') ?? 'true') === 'true'
        },
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        },
        dashOffset() {
            if (!this.isValid) {
                return false
            }
            if ((clientSettings.params.get('hideHPBar') ?? 'false') === 'true') {
                return 0
            }
            return 600 - (this.healthPercent / 100 * 600)
        },
        healthPercent() {
            if (!this.isValid) {
                return null
            }
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current
        },
        isDead() {
            if (!this.isValid) {
                return false
            }

            return parseFloat(this.healthPercent) === 0
        },
        level() {
            if (!this.isValid) {
                return null
            }
            return this.pokemon.level || '0'
        },
        nickname() {
            if (!this.isValid) {
                return null
            }
            return this.pokemon.nickname || this.pokemon.speciesName
        },
        sex() {
            return (this.pokemon.isGenderless ? '' : (this.pokemon.isFemale ? 'female' : 'male'))
        },
        ident() {
            if (!this.isValid) {
                return null
            }
            return this.pokemon.pid
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
        sprite() {
            return V2.getSprite(this.pokemon)
        },
        mainStyle() {
            if (!this.isValid) {
                return null
            }
            let styles = {
                'opacity': this.opacity,
            }

            if (this.pokemon) {
                styles = {...styles}//'background-image': 'linear-gradient(180deg, ' + this.settings.typeColors[primaryType] + ', white)'}
            }

            return styles
        },
        borderColor() {
            if (!this.isValid) {
                return '#7375ae'
            }
            return typeColors[this.pokemon.translations.english.types[0]]
        },
        nature() {
            if (!this.isValid) {
                return ''
            }
            if (!this.pokemon.nature) {
                return ''
            }

            return this.pokemon.nature.charAt(0).toUpperCase() + this.pokemon.nature.slice(1)
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
});
