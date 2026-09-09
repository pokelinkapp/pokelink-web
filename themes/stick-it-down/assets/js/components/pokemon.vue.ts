import {defineComponent, PropType} from 'vue'
import {clientSettings, Nullable, typeColors, V3, V3DataTypes} from 'pokelink'
import type {Pokemon} from 'pokelink'
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js'
import heartGauge from '../../../../_shared/components/heartGauge.vue.js'

export default defineComponent({
    template: `
      <div :class="[...statusClasses, { 'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage }]">
        <div style="display: flex;">
          <div class="pokemon-image__wrapper" :style="'background-color:' + cellColour">
            <trimmedSprite
                v-if="pokemonExists"
                :key="ident"
                :pokemon="pokemon"
                :getSprite="getSprite"
            ></trimmedSprite>
          </div>

          <div class="pokemon__details">
            <heart-gauge v-if="pokemonExists" :pokemon="pokemon"></heart-gauge>
            <div class="exp" v-if="pokemonExists && !pokemon.isEgg && !pokemon.isShadow">
              <div
                  :style="{width:experienceRemaining}"
                  :class="{ exp__inner: true}"
              ></div>
            </div>
            <div class="pokemon__name" v-if="pokemonExists && !pokemon.isEgg">
              {{ nickname }}
            </div>
            <div class="pokemon__level" v-if="pokemonExists && !pokemon.isEgg">
              <small>Lv. {{ pokemon.exp?.level }}</small>
            </div>
            <div class="hp" v-if="pokemonExists && !pokemon.isEgg">
              <div
                  :style="{width:healthPercent}"
                  :class="{ hp__inner: true, low: healthPercent <= 50, critical: healthPercent <= 15 }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    `,
    components: {
        trimmedSprite: trimmedSprite,
        'heart-gauge': heartGauge
    },
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        },
        slotId: null
    },
    data() {
        return {
            justTookDamage: false
        }
    },
    created() {

    },
    mounted() {
        const vm = this
        V3.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate()
        })
    },
    methods: {
        getSprite(pokemon: Pokemon) {
            if (pokemon.isEgg) {
                return 'https://assets.pokelink.xyz/V3/sprites/egg.png'
            }
            return V3.getSprite(pokemon)
        }
    },
    computed: {
        pokemonExists () {
            return V3.isValidPokemon(this.pokemon)
        },
        healthPercent() {
            if (!this.pokemonExists ) { return 0; }
            return (100/this.pokemon.hp!.max) * this.pokemon.hp!.current + "%";
        },
        isDead () {
            if (!this.pokemonExists ) { return false; }

            return this.pokemon.hp!.current === 0
        },
        isSleeping () {
            if (!this.pokemonExists ) { return false; }

            return this.pokemon.status === V3DataTypes.StatusEffect.asleep
        },
        nickname() {
            return this.pokemon.misc?.nickname || this.pokemon.translations!.locale!.species;
        },
        sex() {
            return (this.pokemon.gender === V3DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V3DataTypes.Gender.female ? 'female' : 'male'));
        },
        ident() {
            if (!this.pokemonExists) { return null; }
            return this.pokemon.species;
        },
        opacity() {
            if (typeof this.pokemon === "undefined") { return '0.4'; }
            return '1';
        },
        hasItem() {
            if (!this.pokemonExists) { return false; }
            return this.pokemon.misc?.heldItem !== 0;
        },
        experienceRemaining () {
            return this.pokemon.exp?.nextLevelPercent + '%'
        },
        statusClasses () {
            if (typeof this.pokemon === "undefined") { return []; }
            let statuses: string[] = []
            if (this.pokemon.status === V3DataTypes.StatusEffect.poisoned || this.pokemon.status === V3DataTypes.StatusEffect.badlyPoisoned) statuses = [...statuses, 'isPoisoned']
            if (this.pokemon.status === V3DataTypes.StatusEffect.paralyzed) statuses = [...statuses, 'isParalyzed']
            if (this.pokemon.status === V3DataTypes.StatusEffect.burned) statuses = [...statuses, 'isBurned']
            if (this.pokemon.status === V3DataTypes.StatusEffect.frozen) statuses = [...statuses, 'isFrozen']

            return statuses
        },
        cellColour () {
            if (!this.pokemonExists || this.pokemon.isEgg) return '#120c2f'
            return V3.getTypeColor(this.pokemon.translations!.english!.types[0])
        },
        selectedPokemon: {
            get: function() {
                return this.nickname
            },
            set: function() {
                this.$emit( "change", this.nickname )
            }
        },
    }
})