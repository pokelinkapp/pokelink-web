import {defineComponent, PropType} from 'vue'
import {V2, clientSettings, V2DataTypes, string2ColHex} from 'pokelink'
import {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div>
        <div :class="{ 'pokemon__slot': true, 'type_border': isBorderColorType() }" :style="styleBorder()"
             v-if="isValid">
          <div :class="{ 'pokemon__image': true, 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img ref="pokemonSprite" @error="useFallback" :src="getSprite()">
          </div>
          <div class="pokemon__nick">
            <span class="pokemon__nick-shiny" v-if="pokemon.isShiny">★</span>
            <span>{{ pokemon.nickname || pokemon.translations.locale.speciesName }}</span>
            <span class="pokemon__gender pokemon__gender-male"
                  v-if="isMale()">♂</span>
            <span class="pokemon__gender pokemon__gender-female"
                  v-if="isFemale">♀</span>

          </div>
          <div v-if="pokemon.hp.current !== 0">
            <div class="pokemon__level-bar" v-if="pokemon.level !== 100 && pokemon.level > 0">
              <span class="pokemon__level">L{{ pokemon.level }}</span>
              <span class="pokemon__hp" style="float: right;">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</span>
            </div>
            <div class="pokemon__level-bar" v-else>
              <div class="pokemon__hp">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</div>
            </div>
          </div>
          <div v-else>
            <div class="pokemon__dead-label"> DEAD</div>
          </div>
          <div class="pokemon__hp-bar">
            <div class="progress" style="height: 9px;">
              <div :class="healthBarClass()" v-bind:style="{width: healthBarPercent() + '%'}"
                   role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0"
                   :aria-valuemax="pokemon.hp.max"></div>
            </div>
          </div>
        </div>
        <div class="pokemon__slot pokemon__empty" v-else>
          <div class="pokemon__image">
          </div>
        </div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        },
        settings: Object
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        }
    },
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite as HTMLImageElement, this.pokemon!)
        },
        getSprite() {
            return V2.getSprite(this.pokemon!)
        },
        styleBorder(pokemon: Pokemon) {
            if (!this.isValid) {
                return {'border-color': 'black'}
            }

            let color = clientSettings.params.getString('color', undefined)
            const routeColor = color === 'route'
            const pokemonColor = color === 'pokemon'
            const typeColor = color === 'type'

            if (routeColor) {
                return {'border-color': string2ColHex(pokemon.translations!.english!.locationMetName!)}
            }

            if (pokemonColor) {
                return {'border-color': pokemon.color}
            }

            if (typeColor) {
                const types = pokemon.translations!.english!.types
                const count = types.length
                const type1 = V2.getTypeColor(types[0])

                if (count === 2) {
                    const type2 = V2.getTypeColor(types[1])
                    return {
                        'background': 'linear-gradient(to right, ' + type1 + ' 50%, ' + type2 + ' 50%)',
                        'border-color': 'black'
                    }
                }
                return {'background': type1, 'border-color': 'black'}
            }

            return {'border-color': 'black'}
        },
        healthBarPercent: function () {
            if (!this.isValid) {
                return 100
            }

            console.log("What is this shit?!")

            if (this.pokemon.hp!.max === this.pokemon.hp!.current) {
                return 100
            }

            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current
        },
        healthBarClass: function () {
            const percent = this.healthBarPercent()

            if (percent == 0) {
                return 'progress-bar grey'
            }
            if (percent <= 25) {
                return 'progress-bar red'
            }
            if (percent <= 50) {
                return 'progress-bar yellow'
            }

            return 'progress-bar green'
        },
        isBorderColorType: function () {
            return clientSettings.params.getString('color', undefined) === 'type'
        },

        getTypeColor: function (type: string) {
            return V2.getTypeColor(type)
        },

        getStatusColor: function (status: string) {
            return V2.getStatusColor(status)
        },
        string2Hex: function (str: string) {
            return string2ColHex(str)
        },
        isMale() {
            if (!this.isValid) {
                return false
            }
            return this.pokemon!.gender === V2DataTypes.Gender.male
        },
        isFemale() {
            if (!this.isValid) {
                return false
            }
            return this.pokemon!.gender === V2DataTypes.Gender.female
        }
    }
})

