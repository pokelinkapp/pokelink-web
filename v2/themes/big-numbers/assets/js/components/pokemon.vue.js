import {defineComponent} from 'vue'
import {clientSettings, DataTypes, typeColors, V2} from 'pokelink'
import {pokemonTCGCardSets} from '../party.js'

export default defineComponent({
    template: `
      <div
          :class="{ 'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage, 'closing': isClosing, 'active': isActive}">
        <div class="slot_id">{{ slotId }}</div>
        <div class="pokemon__card-art" :style="{'background-image': 'url(' + customCardArt + ')'}"></div>
        <div class="pokemon__container" :style="typeColorBackgroundStyle">
          <div class="sleeping" v-if="isValid && isSleeping">
            <span>z</span>
            <span>z</span>
            <span>z</span>
          </div>

          <div class="pokemon__row">
            <div class="pokemon__level" v-if="isValid">
              <small>Lv.</small>{{ pokemon.level }}
            </div>
            <div class="pokemon__image" v-if="isValid">
              <img ref="pokemonSprite" @error="useFallback" v-if="pokemon.isEgg" class="sprite" :src="sprite"
                   style="transform: scale(0.8); bottom: 0px;"/>
              <img v-else ref="pokemonSprite" @error="useFallback" class="sprite" :src="sprite"/>
            </div>
          </div>

          <!--<div class="pokemon__name" :style="nameStyle" v-if="pokemonExists">
            {{pokemon.nickname}}
          </div>-->

          <!--<div class="pokemon__heldItem" v-if="hasItem"><img :src="pokemon.heldItem.img" /></div>-->

          <!--<div class="exp" v-if="pokemonExists && !pokemon.isEgg">
            <div :style="{width:experienceRemaining}" class="exp__inner"></div>
          </div>-->
        </div>
      </div>
    `,
    props: {
        pokemon: null,
        slotId: null
    },
    data() {
        return {
            settings: {},
            justTookDamage: false,
            customCardArt: null,
            pokeIsChanging: false,
            isFresh: true,
            newCardArt: null,
            sets: []
        }
    },
    created() {
        this.sets = pokemonTCGCardSets()
    },
    mounted() {
        this.pokeIsChanging = false
        if (this.useCardArtBackground) {
            this.getNewCardArt(this.pokemon)
        }
    },
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite, this.pokemon)
        },
        getNewCardArt(poke) {
            let vm = this
            if (!this.isFresh) {
                this.pokeIsChanging = true
            }
            if (!this.useCardArtBackground) {
                setTimeout(() => {
                    this.pokeIsChanging = false
                }, 1400)
                return false
            }

            let isFresh = this.customCardArt === null && this.isFresh === true
            if (!this.isFresh) {
                this.pokeIsChanging = true
            }
            this.isFresh = false

            fetch('https://api.pokemontcg.io/v1/cards?setCode=' +
                this.sets.join('|') +
                '&supertype=pokemon&nationalPokedexNumber=' +
                poke.species)
                .then(response => response.json())
                .then(cards => {
                    let setOrder = this.sets
                    // try {
                    let cardImages = cards
                        .cards
                        .sort((a, b) => {
                            return setOrder.findIndex(set => set === a.setCode) -
                                setOrder.findIndex(set => set === b.setCode)
                        })

                    cardImages = cardImages.find(card => card.nationalPokedexNumber === poke.species)
                    this.newCardArt = cardImages.imageUrl

                    if (!isFresh) {
                        setTimeout(() => {
                            this.customCardArt = this.newCardArt
                            this.pokeIsChanging = false
                        }, 1400)
                    } else {
                        this.customCardArt = cardImages.imageUrl
                        this.pokeIsChanging = false
                    }
                    // } catch (e) {
                    //   console.log(e)
                    //   // console.log(`unknown image for ${vm.pokemon.speciesName}`)
                    //   // console.info(cards.cards)
                    //
                })
        }
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        },
        sprite() {
            return V2.getSprite(this.pokemon)
        },
        useCardArtBackground() {
            if (this.pokemon === null) {
                return false
            }
            return clientSettings.params.get('useCardArtBackground') === 'true'
        },
        useTypesGradient() {
            if (this.pokemon === null) {
                return false
            }
            return clientSettings.params.get('useTypesGradient') === 'true'
        },
        isActive() {
            if (!this.useCardArtBackground) {
                return !this.pokeIsChanging
            }
            return this.customCardArt && !this.pokeIsChanging
        },
        isClosing() {
            return this.pokeIsChanging === true
        },
        healthPercent() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return '0%'
            }
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + '%'
        },
        isDead() {
            return parseFloat(this.healthPercent) === 0
        },
        isSleeping() {
            return this.pokemon.status === DataTypes.StatusEffect.asleep
        },
        nickname() {
            return this.pokemon.nickname || this.pokemon.translations.locale.speciesName
        },
        sex() {
            return (this.pokemon.isGenderless ? '' : (this.pokemon.isFemale ? 'female' : 'male'))
        },
        ident() {
            return this.pokemon.species
        },
        opacity() {
            return '1'
        },
        hasItem() {
            if (typeof this.pokemon.heldItem === 'undefined') {
                return false
            }
            return this.pokemon.heldItem.id !== 0
        },
        experienceRemaining() {
            if (this.pokemon.expToNextLevel < this.pokemon.exp || !V2.isValidPokemon(this.pokemon)) {
                return '0%'
            }
            const expLeftInThisRange = this.pokemon.exp - this.pokemon.expToNextLevel

            return (100 / this.pokemon.expToNextLevel) * expLeftInThisRange + '%'
        },
        mainStyle() {
            let styles = {
                'opacity': this.opacity
            }

            if (V2.isValidPokemon(this.pokemon)) {
                let primaryType = this.pokemon.types[0].label.toLowerCase()
                styles = {
                    ...styles,
                    'background-image': 'linear-gradient(180deg, ' + typeColors[primaryType] + ', white)'
                }
            }

            // return styles;
        },

        typeColorBackgroundStyle() {
            if (this.useTypesGradient === false) {
                return false
            }
            let styles = {
                'opacity': this.opacity
            }

            if (V2.isValidPokemon(this.pokemon)) {
                let primaryType = this.pokemon.translations.english.types[0] ?? '???'
                let secondaryType = this.pokemon.translations.english.types[1] ?? primaryType
                // if (this.pokemon.types.length > 1) {
                //   secondaryType = this.pokemon.types[1].label.toLowerCase()
                // }

                styles = {
                    ...styles,
                    'background-image': 'linear-gradient(90deg, ' +
                        typeColors[primaryType] +
                        ', ' +
                        typeColors[secondaryType] +
                        ')'
                }
            }

            return styles
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
                if ((!oldVal.hasOwnProperty('hp') && newVal.hasOwnProperty('hp')) ||
                    newVal.species !==
                    oldVal.species) {
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