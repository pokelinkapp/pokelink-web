import { defineComponent } from 'vue';
import { clientSettings, V2, V2DataTypes } from 'pokelink';
import female from './female.vue.js';
import male from './male.vue.js';
import pokeball from './pokeball.vue.js';
export default defineComponent({
    template: `
      <div :class="{ 'pokemon': true, 'opaque': !fixedSprite}" :style="{'opacity': opacity }"
           v-if="!isUndefined(pokemon)">

        <div class="details" v-if="typeof pokemon == 'object'">
          <h2 class="name">
            {{ pokemon.nickname ?? pokemon.translations.locale.speciesName }}
            <span class="sex" :class="sex" v-if="!hideGender && sex !== ''">
            <female v-if="sex === 'female'"></female>
            <male v-if="sex === 'male'"></male>
          </span>
            <span class="lvl" v-if="!hideLevel">Lv. {{ pokemon.level }}</span>
          </h2>
          <div class="hp">
            <h5>HP: </h5>
            <div class="bar">
              <div class="health" :style="{ width: healthPercent }"
                   :class="{ low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
            </div>

          </div>
          <div class="hp__text-and-exp">
            <span class="text">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</span>

            <div class="exp" v-if="pokemonExists && !pokemon.isEgg && !hideLevel">
              <div
                  :style="{width:experienceRemaining}"
                  :class="{ exp__inner: true}"
              ></div>
            </div>
          </div>
        </div>
        <div v-else></div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object,
            required: true
        },
        key: {}
    },
    data() {
        return {
            fixedSprite: true
        };
    },
    components: {
        'female': female,
        'male': male,
        'pokeball': pokeball
    },
    mounted() {
    },
    computed: {
        pokemonExists() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return false;
            }
            return true;
        },
        partner() {
            return false;
        },
        healthPercent() {
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + '%';
        },
        nickname() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return null;
            }
            return this.pokemon.nickname || this.pokemon.translations.english.speciesName;
        },
        sex() {
            switch (this.pokemon.gender) {
                case V2DataTypes.Gender.male:
                    return 'male';
                case V2DataTypes.Gender.female:
                    return 'female';
            }
            return '';
        },
        ident() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return null;
            }
            return this.pokemon.species;
        },
        opacity() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return '1';
            }
            if (this.fixedSprite) {
                return '';
            }
            return '';
        },
        hasItem() {
            if (!V2.isValidPokemon(this.pokemon)) {
                return false;
            }
            if (typeof this.pokemon.heldItem === 'undefined') {
                return false;
            }
            return this.pokemon.heldItem !== 0;
        },
        selectedPokemon: {
            get: function () {
                return this.nickname;
            },
            set: function () {
                this.$emit('change', this.nickname);
            }
        },
        hideGender() {
            return clientSettings.params.getBool('hideGender', false);
        },
        hideLevel() {
            return clientSettings.params.getBool('hideLevel', false);
        },
        experienceRemaining() {
            if (this.pokemon.expToNextLevel < this.pokemon.exp) {
                return '0%';
            }
            const expLeftInThisRange = this.pokemon.exp - this.pokemon.expToNextLevel;
            return (100 / this.pokemon.expToNextLevel) * expLeftInThisRange + '%';
        }
    },
    methods: {
        isUndefined(pokemon) {
            return !V2.isValidPokemon(pokemon);
        },
        getSprite(pokemon) {
            return V2.getSprite(pokemon);
        },
        getPokeballTopColor: function () {
            // if (!V2.isValidPokemon(this.pokemon)) { return '#C3C4C6'; }
            //
            // if (settings.pokeImg.pokemonColor === true) {
            //     return this.pokemon.color;
            // }
            //
            // if (settings.pokeImg.routeColor === true) {
            //     return string2Hex(this.pokemon.locationMet.toString());
            // }
            //
            // if (settings.pokeImg.typeColor === true) {
            //     return getTypeColor(this.pokemon.types[0].label);
            // }
            //
            // if (settings.pokeImg.staticColor !== false) {
            //     return normalizeColor(settings.pokeImg.staticColor, 100);
            // }
            return 'white';
        },
        getPokeballBottomColor: function () {
            // if (settings.champion.colorPokeball !== true) { return '#C3C4C6'; }
            // if (!V2.isValidPokemon(this.pokemon)) { return '#C3C4C6'; }
            //
            // if (settings.pokeImg.pokemonColor === true) {
            //     if (settings.champion.colorBothSidesPokeball !== true) { return '#C3C4C6'; }
            //     return this.pokemon.color;
            // }
            //
            // if (settings.pokeImg.routeColor === true) {
            //     if (settings.champion.colorBothSidesPokeball !== true) { return 'C3C4C6'; }
            //     return string2Hex(this.pokemon.locationMet.toString());
            // }
            //
            // if (settings.pokeImg.typeColor === true) {
            //     if (this.pokemon.types.length === 2) {
            //         return getTypeColor(this.pokemon.types[1].label);
            //     }
            //     return getTypeColor(this.pokemon.types[0].label);
            // }
            //
            // if (settings.pokeImg.staticColor !== false) {
            //     if (settings.champion.colorBothSidesPokeball !== true) { return 'C3C4C6'; }
            //     return settings.pokeImg.staticColor;
            // }
            return 'white';
        }
    }
});
//# sourceMappingURL=pokemon.vue.js.map