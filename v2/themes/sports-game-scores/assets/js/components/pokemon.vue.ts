import {defineComponent, PropType} from 'vue'
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js'
import {Pokemon} from 'v2Proto'
import {pokemonTCGCardSets} from '../party.js'
import {clientSettings, hex2rgba, V2, V2DataTypes} from 'pokelink'
import getTypeColor = V2.getTypeColor

export default defineComponent({
    template: `
      <div :class="{ 'pokemon': true, 'isDead': isDead,  'opaque': !fixedSprite}" :style="backgroundGradientStyle"
           v-if="pokemonExists">
        <div
            class="pokemon__card-art"
            :style="{'background-image': 'url(' + customCardArt + ')'}"
        ></div>
        <div
            class="pokemon__sprite"
            v-if="pokemonExists"
        >
          <trimmedSprite
              :pokemon="pokemon"
              :maxBoundingBoxHeight="150"
              v-if="pokemonExists"
              @done="actionOnImageLoaded"
              :getSprite="getSprite"
          ></trimmedSprite>
        </div>
        <div class="pokemon__details" v-if="pokemonExists">
          <div class="pokemon__hp">
            <div v-if="!hideLevel"><small>Lv.</small>{{ pokemon.level }}</div>
            <div>{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</div>
          </div>
          <div class="pokemon__nickname">{{ pokemon.nickname || pokemon.translations.locale.speciesName }}</div>
          <div class="pokemon__extra-deets">
            {{ statusEffectsSlide }}
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
        key: {}
    },
    data() {
        return {
            fixedSprite: false,
            settings: {
                useCardArtBackground: clientSettings.params.getBool('useCardArtBackground', true)
            },
            customCardArt: null,
            pokeIsChanging: false,
            isFresh: true,
            newCardArt: null,
            sets: [] as string[],
            justTookDamage: false
        }
    },
    created() {
        this.sets = pokemonTCGCardSets()
    },
    mounted() {
        const vm = this
        V2.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate()
        })
        this.pokeIsChanging = false
        if (this.pokemonExists && this.settings.useCardArtBackground) this.getNewCardArt(this.pokemon)
        if (!this.pokemonExists) this.actionOnImageLoaded()
    },
    computed: {
        isDead() {
            if (!this.pokemonExists) {
                return false
            }

            return parseFloat(this.healthPercent) === 0
        },
        pokemonExists() {
            return V2.isValidPokemon(this.pokemon)
        },
        healthPercent() {
            if (!this.pokemonExists) {
                return '0%'
            }
            return (100 / this.pokemon.hp!.max) * this.pokemon.hp!.current + '%'
        },
        sex() {
            if (!this.pokemonExists) {
                return null
            }
            return (this.pokemon.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V2DataTypes.Gender.female ? 'female' : 'male'))
        },
        ident() {
            if (!this.pokemonExists) {
                return null
            }
            return this.pokemon.species
        },
        opacity() {
            if (!this.pokemonExists) {
                return '1'
            }
            if (!this.fixedSprite) {
                return ''
            }
            return ''
        },
        hasItem() {
            if (!this.pokemonExists) {
                return false
            }
            if (typeof this.pokemon.heldItem === 'undefined') {
                return false
            }
            return this.pokemon.heldItem !== 0
        },

        type1() {
            if (!this.pokemonExists) {
                return 'rgba(255,255,255,.2)'
            }

            return hex2rgba(getTypeColor(this.pokemon.translations!.english!.types[0]), 50)
        },
        type2() {
            if (!this.pokemonExists) {
                return 'rgba(255,255,255,.2)'
            }

            if (this.pokemon.translations!.english!.types.length >= 2) {
                return hex2rgba(getTypeColor(this.pokemon.translations!.english!.types[1]), 50)
            }
            return hex2rgba(getTypeColor(this.pokemon.translations!.english!.types[0]), 50)
        },
        backgroundGradientStyle() {
            if (!this.pokemonExists) {
                return false
            }
            // let styles = {
            //   'opacity': this.opacity,
            // }

            let primaryType = this.pokemon.translations!.english!.types[0]
            return {'background-image': 'linear-gradient(180deg, ' + getTypeColor(primaryType) + ', black)'}
        },

        statusEffectsSlide() {
            // const titles = {'psn': 'Poisoned', 'slp': 'Sleeping', 'par': 'Paralyzed', 'fzn': 'Frozen', 'brn': 'Burned'}
            // let activeEffects = ['psn', 'slp', 'par', 'frz', 'brn']
            //   .filter(effect => this.pokemon.status[effect] === 1)

            if (this.isDead) return 'DEAD'

            if (this.pokemon.ability && this.pokemon.ability !== 0) {
                return this.pokemon.translations!.locale!.abilityName
            }

            if (this.pokemon.nature) {
                return this.pokemon.translations!.locale!.natureName
            }

            return ``
        },
        hideLevel() {
            return clientSettings.params.getBool('hideLevels', false)
        }
    },
    methods: {
        getSprite(pokemon: Pokemon){
            return V2.getSprite(pokemon)
        },
        getNewCardArt(poke: Pokemon) {
            let vm = this
            if (!this.isFresh) {
                this.pokeIsChanging = true
            }
            if (!this.settings.useCardArtBackground) {
                setTimeout(() => {
                    this.pokeIsChanging = false
                    this.actionOnImageLoaded()
                }, 1400)
                return false
            }

            let isFresh = this.customCardArt === null && this.isFresh
            if (!this.isFresh) {
                this.pokeIsChanging = true
            }
            this.isFresh = false

            if (!this.pokemonExists) {
                this.customCardArt = null
                this.pokeIsChanging = false
                this.actionOnImageLoaded()
                this.newCardArt = null
            }

            fetch('https://api.pokemontcg.io/v1/cards?setCode=' + this.sets.join('|') + '&supertype=pokemon&nationalPokedexNumber=' + poke.species)
                .then(response => response.json())
                .then(cards => {
                    let setOrder = this.sets
                    // try {
                    let cardImages = cards
                        .cards
                        .sort((a: any, b: any) => {
                            return setOrder.findIndex(set => set === a.setCode) - setOrder.findIndex(set => set === b.setCode)
                        })

                    cardImages = cardImages.find((card: any) => card.nationalPokedexNumber === poke.species)
                    this.newCardArt = cardImages.imageUrl

                    if (!isFresh) {
                        setTimeout(() => {
                            this.customCardArt = this.newCardArt
                            this.pokeIsChanging = false
                            this.actionOnImageLoaded()
                        }, 1400)
                    } else {
                        this.customCardArt = cardImages.imageUrl
                        this.pokeIsChanging = false
                        this.actionOnImageLoaded()
                    }
                    // } catch (e) {
                    //   console.log(e)
                    //   // console.log(`unknown image for ${vm.pokemon.speciesName}`)
                    //   // console.info(cards.cards)
                    //
                })
        },
        actionOnImageLoaded() {
            this.fixedSprite = true
            this.$emit('loaded')
        }
    },
    watch: {
        pokemon(newVal, oldVal) {
            try {
                if (newVal.species !== oldVal.species) {
                    this.getNewCardArt(newVal)
                }

                if (!newVal.hasOwnProperty('hp')) {
                    this.customCardArt = null
                }

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
