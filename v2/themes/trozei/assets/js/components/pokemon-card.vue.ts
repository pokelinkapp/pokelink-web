import {defineComponent, PropType} from 'vue'
import type {Pokemon} from 'v2Proto'
import {clientSettings, V2} from 'pokelink'

export default defineComponent({
    template: `
      <div class="pokemon__slot" :class="{ 'pokemon__empty': isValid }">
        <div v-if="isValid">
          <div class="pokemon__level" v-if="!hide.level">{{ pokemon.level }}</div>
          <div :class="['pokemon__image', {'pokemon__egg': pokemon.isEgg}]"><img ref="pokemonImg" @error="useFallback" :src="getSprite()"></div>
          <div class="pokemon__nick" v-if="!hide.nickname">
            <span class="pokemon__nick-shiny" v-if="pokemon.isShiny">★</span>
            {{ this.pokemon.nickname || this.pokemon.translations.locale.speciesName }}
          </div>
          <div class="pokemon__hp-bar" v-if="!hide.hp">
            <div class="progress" style="height: 15px;">
              <div :class="healthBarClass(pokemon)" v-bind:style="{width: healthBarPercent(pokemon) + '%'}"
                   role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0"
                   :aria-valuemax="pokemon.hp.max"></div>
            </div>
            <div class="pokemon__hp">
              <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
            </div>
          </div>
          <div class="pokemon__bar" v-if="!hide.types">
            <span :class="'pokemon__types pokemon__types-' + pokemon.translations.english.types[idx].toLowerCase()" v-if="pokemon.translations.locale.types.length !== 0"
                  :style="{ 'backgroundColor': getTypeColor(pokemon.translations.english.types[idx]) }"
                  v-for="(type, idx) in pokemon.translations.locale.types">{{ type }}</span>
          </div>
        </div>
        <div v-else>
          <div class="pokemon__image">
            <img src="./assets/images/pokeball-icon-22.png"/>
          </div>
        </div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: false
        }
    },
    data() {
        return {
            hide: {
                level: false,
                nickname: false,
                hp: false,
                types: false
            }
        }
    },
    mounted() {
        this.hide.level = clientSettings.params.getBool('hideLevel', false)
        this.hide.nickname = clientSettings.params.getBool('hideNickname', false)
        this.hide.hp = clientSettings.params.getBool('hideHP', false)
        this.hide.types = clientSettings.params.getBool('hideTypes', false)
        const vm = this
        V2.handleSpriteTemplateUpdate(() => {
            vm.$forceUpdate()
        })
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        }
    },
    methods: {
        getSprite() {
            return V2.getSprite(this.pokemon!)
        },
        useFallback() {
            V2.useFallback(this.$refs.pokemonImg as HTMLImageElement, this.pokemon!)
        },
        healthBarPercent: function () {
            if (!this.isValid) {
                return 0
            }
            if (this.pokemon!.hp!.max === this.pokemon!.hp!.current) {
                return 100
            }

            return (100 / this.pokemon!.hp!.max) * this.pokemon!.hp!.current
        },
        healthBarClass: function () {
            var percent = this.healthBarPercent()

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
        getTypeColor: function (type: string) {
            return V2.getTypeColor(type)
        }
    }
})
