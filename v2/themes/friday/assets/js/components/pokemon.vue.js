import { defineComponent } from 'vue';
import { V2, V2DataTypes } from 'pokelink';
export default defineComponent({
    template: `
      <div :class="[statusClass, { 'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage }]">
        <div v-if="isValid" style="display: flex;">

          <div class="pokemon__details">
            <div class="pokemon__level">
              <small>Lv. {{ pokemon.level }}</small>
            </div>
            <div class="pokemon__name">
              {{ nickname }}
            </div>
          </div>

          <div class="pokemon__image">
            <img v-if="pokemon.isEgg" @error="useFallback" ref="pokemonImg" class="sprite" :src="sprite" style="transform: scale(0.8); bottom: 0px;"/>
            <img v-else class="sprite" @error="useFallback" ref="pokemonImg" :src="sprite"/>
          </div>
          <div class="hp" v-if="!pokemon.isEgg">
            <div
                :style="{height:healthPercent}"
                :class="{ hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"
            ></div>
          </div>
        </div>
        <div v-else></div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            justTookDamage: false
        };
    },
    created() {
    },
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonImg, this.pokemon);
        }
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon);
        },
        healthPercent() {
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + '%';
        },
        isDead() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return false;
            }
            return this.pokemon.hp.current === 0;
        },
        isSleeping() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return false;
            }
            return this.pokemon.status === V2DataTypes.StatusEffect.asleep;
        },
        nickname() {
            return this.pokemon.nickname || this.pokemon.translations.english.speciesName;
        },
        sex() {
            return (this.pokemon.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V2DataTypes.Gender.female ? 'female' : 'male'));
        },
        ident() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return null;
            }
            return this.pokemon.species;
        },
        opacity() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return '0.4';
            }
            return '1';
        },
        hasItem() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return false;
            }
            return this.pokemon.heldItem !== 0;
        },
        sprite() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return '';
            }
            return V2.getSprite(this.pokemon);
        },
        experienceRemaining() {
            const expLeftInThisRange = this.pokemon.exp - this.pokemon.expToNextLevel;
            return (100 / this.pokemon.expToNextLevel) * expLeftInThisRange + '%';
        },
        statusClass() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return '';
            }
            switch (this.pokemon.status) {
                case V2DataTypes.StatusEffect.poisoned:
                    return 'isPoisoned';
                case V2DataTypes.StatusEffect.paralyzed:
                    return 'isParalyzed';
                case V2DataTypes.StatusEffect.burned:
                    return 'isBurned';
                case V2DataTypes.StatusEffect.frozen:
                    return 'isFrozen';
            }
            return '';
        },
        selectedPokemon: {
            get: function () {
                return this.nickname;
            },
            set: function () {
                this.$emit('change', this.nickname);
            }
        }
    },
    watch: {
        pokemon(newVal, oldVal) {
            try {
                if (newVal.hp.current < oldVal.hp.current) {
                    this.justTookDamage = true;
                    setTimeout(() => {
                        this.justTookDamage = false;
                    }, 3000);
                }
            }
            catch (e) {
                return;
            }
        }
    }
});
//# sourceMappingURL=pokemon.vue.js.map