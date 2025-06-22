import {defineComponent, PropType} from 'vue'
import {V2, clientSettings, V2DataTypes} from 'pokelink'
import {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div class="card has-text-weight-bold has-text-white">
        <div class="card-image" v-if="typeof this.pokemon === 'object'">
          <div class="card-image-container">
            <span><img style="max-width: 300px; max-height: 300px" ref="pokemonSprite"
                       @error="useFallback" :src="imageTag"
                       :data-missingno="isMissingno"/></span>
          </div>
        </div>
        <div class="card-content has-text-centered" v-if="typeof this.pokemon === 'object'">
          <div class="main">
            <div class="title has-text-white">
              {{ this.pokemon.nickname || this.pokemon.translations.locale.speciesName }}
            </div>
            <div class="hp" v-if="settings.hp">
              <div class="bar">
                <div class="health" :style="{ width: healthPercent }"
                     :class="{ low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
              </div>
              <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
            </div>
          </div>
          <div class="stats" v-if="!this.pokemon.isEgg">
            <div v-if="this.pokemon.level > 0">
              <span class="value">{{ this.pokemon.level }}</span>
              <span class="tag">Level</span>
            </div>
            <div>
              <span class="img" v-for="type in this.pokemon.translations.english.types"><img
                  :src="'https://rplus.github.io/Pokemon-CP-list/img/type/type_'+type.toLowerCase()+'.png'"/></span>
              <span class="tag">Type(s)</span>
            </div>
            <div v-if="this.pokemon.heldItem !== 0">
              <span class="img"><img onerror="this.src='https://assets.pokelink.xyz/v2/sprites/items/0.png'"
                                     :src="heldItemImage"/></span>
              <span class="tag">Item</span>
            </div>
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
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite as HTMLImageElement, this.pokemon)
        }
    },
    computed: {
        healthPercent() {
            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current + '%'
        },
        heldItemImage() {
            return clientSettings.itemSpriteTemplate(this.pokemon)
        },
        isMissingno() {
            if (this.pokemon.isEgg) {
                return false
            }

            return this.pokemon.species <= 0
        },
        imageTag() {
            if (this.pokemon.isEgg) {
                return `https://assets.pokelink.xyz/assets/sprites/egg.png`
            }

            let name = this.pokemon.species.toString()

            if (this.pokemon.isShiny) {
                name = (this.pokemon.species + 2000) + '-Shiny'
            }

            let englishFormName = this.pokemon.translations!.english!.formName

            if (englishFormName !== null && englishFormName !== undefined && this.pokemon.form !== 0) {
                // We use the fallback sprite due to pokemonpets having a very inconsistent image naming scheme
                return this.pokemon.fallbackSprite
            }

            let imageTag = name + '-' + this.pokemon.translations!.english!.speciesName
            if (this.pokemon.species === 29) {
                imageTag = name + '-nidoran_F'
            } else if (this.pokemon.species === 32) {
                imageTag = name + '-nidoran'
            }

            return 'https://static.pokemonpets.com/images/monsters-images-300-300/' + imageTag + '.png'
        }
    }
})

