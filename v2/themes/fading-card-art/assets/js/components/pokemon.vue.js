import {defineComponent} from 'vue'
import {V2, clientSettings} from 'pokelink'
import {pokemonTCGCardSets} from '../party.js'

export default defineComponent({
    template: `
      <div :class="{ 'pokemon': true, 'card': true,'isDead': isDead, 'flat': flat }" :style="mainStyle">
        <div class="heldItem">
          <img v-if="pokemon.heldItem !== 0" :src="heldItemImage">
        </div>
        <div class="pokemon__name">{{nickname}}</div>

        <div class="pokemon" :style="innerMonStyle">
          <label v-if="isValid">
            <div class="hp" v-if="!pokemon.isEgg && hideHPBar">
              <div :style="{height:healthPercent}" :class="{ hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
            </div>
          </label>
          <label v-else></label>
        </div>
      </div>
    `,
    props: {
        pokemon: {},
        key: {},
        art: null
    },
    data () {
        return {
            selectedSet: 'base1',
            sets: [
                'base5',
                'xy7',
                'swsh1',
                'base2',
                'ex15'
            ],
            customCardArt: null,
            pokeIsChanging: false,
            isFresh: true,
            newCardArt: null,
        }
    },
    created () {
        this.sets = pokemonTCGCardSets()
    },
    mounted() {

    },
    methods: {
    },
    computed: {
        flat() {
            return (clientSettings.params.get('flat') ?? 'false') === 'true'
        },
        hideHPBar() {
            return (clientSettings.params.get('hideHPBar') ?? 'false') === 'true'
        },
        isValid() {
            return V2.isValidPokemon(this.pokemon)
        },
        heldItemImage() {
            return `https://assets.pokelink.xyz/assets/sprites/items/gen7/${this.pokemon.heldItem}.png`
        },
        useCardArtBackground() {
            return this.isValid
        },
        // (100/194) * 194
        healthPercent() {
            if (!this.isValid) {
                return 100 + '%'
            }
            return (100/this.pokemon.hp.max) * this.pokemon.hp.current + "%";
        },
        isDead () {
            if (!this.isValid) { return false; }

            return parseFloat(this.healthPercent) === 0
        },
        sex() {
            return (this.pokemon.isGenderless ? '' : (this.pokemon.isFemale ? 'female' : 'male'));
        },
        ident() {
            if (!this.isValid) { return null; }
            return this.pokemon.species;
        },
        opacity() {
            if (!this.isValid) { return '0.4'; }
            return '1';
        },
        hasItem() {
            if (!this.isValid) { return false; }
            return this.pokemon.heldItem.id !== 0;
        },
        nickname () {
            return this.pokemon.nickname ?? this.pokemon?.translations?.locale.speciesName
        },
        mainStyle () {
            let styles = {
                'opacity': 1,
            }

            if (this.isValid) {
                styles = {...styles, 'background-image': 'url(' + this.art + ')'}
            }

            return styles;
        },
        innerMonStyle () {
            let styles = {}

            if (this.isValid) {
                let hp = 100 - (100/this.pokemon.hp.max) * this.pokemon.hp.current
                if (hp < 0) hp = 0

                styles = {
                    'background-image': 'url(' + this.art + ')',
                    'height': hp + '%',
                    'filter': 'grayscale(1)',
                    'transition': 'all 0.8s'
                }
            }

            return styles;
        },

        selectedPokemon: {
            get: function() {
                return this.nickname
            },
            set: function() {
                this.$emit( "change", this.nickname )
            }
        }
    }
});
