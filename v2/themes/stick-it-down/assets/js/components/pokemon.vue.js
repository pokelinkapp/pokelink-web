import { defineComponent } from 'vue';
import { V2, V2DataTypes } from 'pokelink';
import trimmedSprite from '../../../../_shared/components/trimmedSprite.vue.js';
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
            <div class="exp" v-if="pokemonExists && !pokemon.isEgg">
              <div
                  :style="{width:experienceRemaining}"
                  :class="{ exp__inner: true}"
              ></div>
            </div>
            <div class="pokemon__name" v-if="pokemonExists">
              {{ nickname }}
            </div>
            <div class="pokemon__level" v-if="pokemonExists">
              <small>Lv. {{ pokemon.level }}</small>
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
        trimmedSprite: trimmedSprite
    },
    props: {
        pokemon: {
            type: Object,
            required: true
        },
        slotId: null
    },
    data() {
        return {
            justTookDamage: false
        };
    },
    created() {
    },
    mounted() {
        const vm = this;
        V2.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
    },
    methods: {
        getSprite(pokemon) {
            return V2.getSprite(pokemon);
        }
    },
    computed: {
        pokemonExists() {
            return V2.isValidPokemon(this.pokemon);
        },
        healthPercent() {
            if (!this.pokemonExists) {
                return 0;
            }
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + "%";
        },
        isDead() {
            if (!this.pokemonExists) {
                return false;
            }
            return this.pokemon.hp.current === 0;
        },
        isSleeping() {
            if (!this.pokemonExists) {
                return false;
            }
            return this.pokemon.status === V2DataTypes.StatusEffect.asleep;
        },
        nickname() {
            return this.pokemon.nickname || this.pokemon.translations.locale.speciesName;
        },
        sex() {
            return (this.pokemon.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V2DataTypes.Gender.female ? 'female' : 'male'));
        },
        ident() {
            if (!this.pokemonExists) {
                return null;
            }
            return this.pokemon.species;
        },
        opacity() {
            if (typeof this.pokemon === "undefined") {
                return '0.4';
            }
            return '1';
        },
        hasItem() {
            if (!this.pokemonExists) {
                return false;
            }
            return this.pokemon.heldItem !== 0;
        },
        experienceRemaining() {
            return this.pokemon.expPercentage + '%';
        },
        statusClasses() {
            if (typeof this.pokemon === "undefined") {
                return [];
            }
            let statuses = [];
            if (this.pokemon.status === V2DataTypes.StatusEffect.poisoned)
                statuses = [...statuses, 'isPoisoned'];
            if (this.pokemon.status === V2DataTypes.StatusEffect.paralyzed)
                statuses = [...statuses, 'isParalyzed'];
            if (this.pokemon.status === V2DataTypes.StatusEffect.burned)
                statuses = [...statuses, 'isBurned'];
            if (this.pokemon.status === V2DataTypes.StatusEffect.frozen)
                statuses = [...statuses, 'isFrozen'];
            return statuses;
        },
        cellColour() {
            if (!this.pokemonExists)
                return '#120c2f';
            return V2.getTypeColor(this.pokemon.translations.english.types[0]);
        },
        selectedPokemon: {
            get: function () {
                return this.nickname;
            },
            set: function () {
                this.$emit("change", this.nickname);
            }
        },
    }
});
//# sourceMappingURL=pokemon.vue.js.map