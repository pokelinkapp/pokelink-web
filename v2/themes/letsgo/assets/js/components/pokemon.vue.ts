import {defineComponent, PropType} from 'vue'
import {V2, V2DataTypes, hex2rgba, typeColors, string2ColHex, clientSettings, htmlColors, isDefined} from 'pokelink'
import female from './female.vue.js'
import male from './male.vue.js'
import pokeball from './pokeball.vue.js'
import bg from './bg.vue.js'
import {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div :class="{ 'pokemon': true }" :style="{'opacity': opacity }">
        <bg :border="getBorderColor()" :bgc="getBgColor()" :type1="type1" :type2="type2" :ident="ident"></bg>
        <pokeball :topColor="getPokeballTopColor()" :bottomColor="getPokeballBottomColor()"></pokeball>
        <label v-if="isValid">
          <input class="radio" type="radio" name="poke" :id="nickname" :value="nickname"
                 v-model="selectedPokemon">
          <span class="lvl">Lv. {{ pokemon.level }}</span>
          <span class="sex" :class="sex" v-if="sex !== ''">
          <female v-if="sex === 'female'"></female>
          <male v-if="sex === 'male'"></male>
        </span>
          <img v-if="pokemon.isEgg" ref="pokemonImg" @error="useFallback" class="sprite" :src="sprite" style="max-height: 80px;"/>
          <img v-else  ref="pokemonImg" @error="useFallback" class="sprite" :src="sprite"/>
          <span class="candy" v-if="hasItem"></span>
          <div class="details">
            <h2 class="name">{{ nickname }}</h2>
            <div class="hp">
              <div class="bar">
                <div class="health" :style="{ width: healthPercent }"
                     :class="{ low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
              </div>
              <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
            </div>
          </div>
        </label>
        <label v-else></label>
      </div>
    `,
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>
        }
    },
    components: {
        'female': female,
        'male': male,
        'pokeball': pokeball,
        'bg': bg
    },
    data() {
        return {
            settings: {
                colorPokeball: clientSettings.params.getBool('colorPokeball', false),
                colorBothSides: clientSettings.params.getBool('colorBothSides', true),
                colorBorder: clientSettings.params.getBool('colorBorder', false),
                colorBg: clientSettings.params.getBool('colorBg', true),
                pokemonColor: clientSettings.params.getString('color', 'type') === 'pokemon',
                typeColor: clientSettings.params.getString('color', 'type') === 'type',
                routeColor: clientSettings.params.getString('color', 'type') === 'route'
            }
        }
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        },
        sprite() {
            return V2.getSprite(this.pokemon!)
        },
        partner() {
            return false
        },
        healthPercent() {
            if (!this.isValid) {
                return '0%'
            }
            return (100 / this.pokemon!.hp!.max) * this.pokemon!.hp!.current + '%'
        },
        nickname() {
            if (!this.isValid) {
                return ''
            }
            return this.pokemon!.nickname || this.pokemon!.translations!.locale!.speciesName
        },
        sex() {
            if (!this.isValid) {
                return ''
            }
            return (this.pokemon!.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon!.gender === V2DataTypes.Gender.female ? 'female' : 'male'))
        },
        ident() {
            if (!this.isValid) {
                return null
            }
            return `${this.pokemon!.species}${isDefined(this.pokemon!.form) ? `-${this.pokemon!.form!}` : ''}`
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
            return this.pokemon!.heldItem !== 0
        },
        type1() {
            if (!this.isValid) {
                return 'rgba(255,255,255,.2)'
            }

            return hex2rgba(typeColors[this.pokemon!.translations!.english!.types[0]], 50)
        },
        type2() {
            if (!this.isValid) {
                return 'rgba(255,255,255,.2)'
            }

            if (this.pokemon!.translations!.english!.types.length >= 2) {
                return hex2rgba(typeColors[this.pokemon!.translations!.english!.types[1]], 50)
            }

            return hex2rgba(typeColors[this.pokemon!.translations!.english!.types[0]], 50)
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
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonImg as HTMLImageElement, this.pokemon!)
        },
        getPokeballTopColor: function () {
            if (!this.settings.colorPokeball) {
                return 'white'
            }

            if (!this.isValid) {
                return 'rgba(255,255,255,.2)'
            }

            if (this.settings.pokemonColor) {
                return isDefined(this.pokemon!.color) ? htmlColors[this.pokemon!.color!.toLowerCase()] : 'white'
            }

            if (this.settings.routeColor) {
                if (isDefined(this.pokemon!.translations!.locale!.locationMetName)) {
                    return string2ColHex(this.pokemon!.translations!.locale!.locationMetName!)
                }

                return 'white'
            }

            if (this.settings.typeColor) {
                return typeColors[this.pokemon!.translations!.english!.types[0]]
            }

            return 'white'
        },
        getPokeballBottomColor: function () {
            if (!this.settings.colorPokeball) {
                return 'white'
            }

            if (!this.isValid) {
                return 'rgba(255,255,255,.2)'
            }

            if (this.settings.pokemonColor) {
                if (!this.settings.colorBothSides) {
                    return 'white'
                }
                return isDefined(this.pokemon!.color) ? htmlColors[this.pokemon!.color!.toLowerCase()] : 'white'
            }

            if (this.settings.routeColor) {
                if (!this.settings.colorBothSides) {
                    return 'white'
                }

                if (isDefined(this.pokemon!.translations!.locale!.locationMetName)) {
                    return string2ColHex(this.pokemon!.translations!.locale!.locationMetName!)
                }

                return 'white'
            }

            if (this.settings.typeColor) {
                if (this.pokemon!.translations!.english!.types.length >= 2) {
                    return typeColors[this.pokemon!.translations!.english!.types[1]]
                }
                return typeColors[this.pokemon!.translations!.english!.types[0]]
            }

            return 'white'
        },

        getBorderColor: function () {
            if (!this.settings.colorBorder) {
                return 'white'
            }

            if (!this.isValid) {
                return 'white'
            }

            if (this.settings.routeColor) {
                if (isDefined(this.pokemon!.translations!.locale!.locationMetName)) {
                    return string2ColHex(this.pokemon!.translations!.locale!.locationMetName!)
                }

                return 'white'
            }

            if (this.settings.pokemonColor) {
                return hex2rgba(isDefined(this.pokemon!.color) ? htmlColors[this.pokemon!.color!.toLowerCase()] : 'white', 50)
            }

            if (this.settings.typeColor) {
                return typeColors[this.pokemon!.translations!.english!.types[0]]
            }

            return 'white'
        },

        getBgColor: function () {
            if (!this.settings.colorBg) {
                return 'rgba(255,255,255,.5)'
            }

            if (!this.isValid) {
                return 'rgba(255,255,255,.5)'
            }

            if (this.settings.routeColor) {
                if (isDefined(this.pokemon!.translations!.locale!.locationMetName)) {
                    return string2ColHex(this.pokemon!.translations!.locale!.locationMetName!)
                }

                return 'white'
            }

            if (this.settings.pokemonColor) {
                return hex2rgba(isDefined(this.pokemon!.color) ? htmlColors[this.pokemon!.color!.toLowerCase()] : 'white', 50)
            }

            if (this.settings.typeColor) {
                return `url('#types-${this.pokemon!.species}${isDefined(this.pokemon!.form) ? `-${this.pokemon!.form!}` : ''}')`
            }

            return 'rgba(255,255,255,.5)'
        }
    }
})
