import {defineComponent, PropType} from 'vue'
import {clientSettings, string2ColHex, V2, V2DataTypes} from 'pokelink'
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js'
import pokeball from './pokeball.vue.js'
import male from './male.vue.js'
import female from './female.vue.js'
import type {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div :class="{ 'pokemon': true, 'opaque': !fixedSprite}" :style="{'opacity': opacity }">
        <div
            class="pokemon__sprite"
            v-if="isValid"
        >
          <pokeball :topColor="getPokeballTopColor()" :bottomColor="getPokeballBottomColor()" :ident="ident"></pokeball>
          <!-- <img class="sprite" :src="pokemon.img" v-if="this.isValid" /> -->
          <trimmedSprite
              :pokemon="pokemon"
              v-if="this.isValid"
              @done="fixedSprite = true"
              :getSprite="getSprite"
          ></trimmedSprite>
        </div>
        <div class="details" v-if="this.isValid">
          <h2 class="name">
            {{ pokemon.nickname }}
            <span class="sex" :class="sex" v-if="!hideGender && sex !== ''">
            <female v-if="sex === 'female'"></female>
            <male v-if="sex === 'male'"></male>
          </span>
          </h2>
          <div class="hp">
            <div class="bar">
              <div class="health" :style="{ width: healthPercent }"
                   :class="{ low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
            </div>
            <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
          </div>
          <span class="lvl" v-if="!hideLevel && this.isValid">Lv.
            {{ pokemon.level }}</span>
        </div>
        <div v-else></div>
      </div>
    `,
    components: {
        'trimmedSprite': trimmedSprite,
        'pokeball': pokeball,
        'male': male,
        'female': female
    },
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        },
        key: {}
    },
    data() {
        return {
            fixedSprite: false,
            colorPokeball: false,
            colorPokemon: false,
            colorRoute: false,
            colorType: false,
            colorBothSides: true
        }
    },
    mounted() {
        let color = clientSettings.params.getString('color', 'type')
        this.colorPokeball = clientSettings.params.getBool('colorPokeball', false)
        this.colorBothSides = clientSettings.params.getBool('colorBothSides', true)

        this.colorPokemon = color === 'pokemon'
        this.colorRoute = color === 'route'
        this.colorType = color === 'type'
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        },
        healthPercent() {
            if (!this.isValid) {
                return '0%'
            }
            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current + '%'
        },
        nickname() {
            if (!this.isValid) {
                return null
            }
            return this.pokemon.nickname || this.pokemon.translations!.locale!.speciesName
        },
        sex() {
            if (!this.isValid) {
                return ''
            }
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
                return '1'
            }
            if (!this.fixedSprite) {
                return ''
            }
            return ''
        },
        hasItem() {
            if (!this.isValid) {
                return false
            }

            return this.pokemon.heldItem!== 0
        },
        selectedPokemon: {
            get: function () {
                return this.nickname
            },
            set: function () {
                this.$emit('change', this.nickname)
            }
        },
        hideGender() {
            return clientSettings.params.getBool("hideGender", false)
        },
        hideLevel() {
            return clientSettings.params.getBool("hideLevels", false)
        }
    },
    methods: {
        getSprite(pokemon: Pokemon) {
            return V2.getSprite(pokemon)
        },
        getPokeballTopColor: function () {
            if (!this.isValid || !this.colorPokeball || (!this.colorPokemon && !this.colorRoute && !this.colorType)) {
                return '#C3C4C6'
            }

            if (this.colorPokemon) {
                return this.pokemon.color
            }

            if (this.colorRoute) {
                return string2ColHex(this.pokemon.translations?.locale?.locationMetName || '')
            }

            if (this.colorType) {
                return V2.getTypeColor(this.pokemon.translations!.english!.types[0])
            }

            return 'white'
        },
        getPokeballBottomColor: function () {
            if (!this.isValid || !this.colorPokeball || (!this.colorPokemon && !this.colorRoute && !this.colorType)) {
                return '#C3C4C6'
            }
            if (!this.isValid) {
                return '#C3C4C6'
            }

            if (this.colorPokemon) {
                if (!this.colorBothSides) {
                    return '#C3C4C6'
                }
                return this.pokemon.color
            }

            if (this.colorRoute) {
                if (!this.colorBothSides) {
                    return 'C3C4C6'
                }
                return string2ColHex(this.pokemon.translations?.locale?.locationMetName || '')
            }

            if (this.colorType) {
                if (this.pokemon.translations!.english!.types.length === 2) {
                    return V2.getTypeColor(this.pokemon.translations!.english!.types[1])
                }
                return V2.getTypeColor(this.pokemon.translations!.english!.types[0])
            }

            return 'white'
        }

    }
})
