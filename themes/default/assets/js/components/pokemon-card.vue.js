import { defineComponent } from 'vue';
import { clientSettings, htmlColors, isDefined, string2ColHex, V3, V3DataTypes } from 'pokelink';
import heartGauge from '../../../../_shared/components/heartGauge.vue.js';
export default defineComponent({
    template: `
      <div>
        <div class="pokemon__slot" :class="{ 'type_border': isBorderColorType() }" :style="styleBorder(pokemon)"
             v-if="pokemon !== null">
          <div class="pokemon__bar">
            <span class="pokemon__gender pokemon__gender-male" v-if="isMale">♂</span>
            <span class="pokemon__gender pokemon__gender-female" v-if="isFemale">♀</span>
            <span :class="'pokemon__types pokemon__types-' + type.toLowerCase()"
                  v-if="pokemon.translations.english.types.length !== 0 && !pokemon.isEgg"
                  :style="{ 'backgroundColor': getTypeColor(type) }"
                  v-for="(type, index) in pokemon.translations.english.types">{{ pokemon.translations.locale.types[index] }}
            </span><span :class="'pokemon__status pokemon__status-'+ statusImg.toLowerCase()"
                         v-if="!isHealthy"
                         :style="{ 'backgroundColor': (statusImg === 'FNT' ? getStatusColor('Fainted') : getStatusColor(pokemon.translations.english.status)) }">{{ statusImg }}</span>
          </div>
          <div
              :class="{ 'pokemon__image': true, 'pokemon__egg': (pokemon.isEgg), 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img :src="sprite()"/>
          </div>
          <div class="pokemon__info">
            <div class="pokemon__nick">
              <span class="pokemon__nick-shiny" v-if="pokemon.isShiny">★</span>{{
                pokemon.misc?.nickname ||
                pokemon.translations.locale.species
              }}
            </div>
            <div class="pokemon__level-bar" v-if="!pokemon.isEgg">
              <span class="pokemon__level">{{ (pokemon.exp?.level !== 100 ? 'L' + pokemon.exp?.level : '&nbsp;') }}</span>
              <span class="pokemon__hp" style="float: right;" v-if="pokemon.hp.current !== 0">{{ pokemon.hp.current }}/
                {{ pokemon.hp.max }}</span>
              <span class="pokemon__dead-label" style="float: right;" v-else> DEAD </span>
            </div>
            <div class="pokemon__hp-bar" v-if="!pokemon.isEgg">
              <div class="progress" style="height: 15px;">
                <div :class="healthBarClass(pokemon)" v-bind:style="{width: healthBarPercent(pokemon) + '%'}"
                     role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0"
                     :aria-valuemax="pokemon.hp.max"></div>
              </div>
            </div>
            <heart-gauge v-if="!pokemon.isEgg" :pokemon="pokemon"></heart-gauge>
          </div>
        </div>
        <div class="pokemon__slot pokemon__empty" v-else>
          <div class="pokemon__image">
          </div>
        </div>
      </div>`,
    components: {
        'heart-gauge': heartGauge
    },
    props: {
        pokemon: {
            default: null,
            type: Object,
            required: false
        }
    },
    mounted() {
        const vm = this;
        V3.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
    },
    methods: {
        styleBorder(pokemon) {
            const color = clientSettings.params.getString('color', 'route').toLowerCase();
            const routeColor = color === 'route';
            const pokemonColor = color === 'pokemon';
            const typeColor = clientSettings.params.getBool('typeBackground', false);
            let styles = {};
            if (routeColor && isDefined(pokemon.translations?.locale?.locationMet)) {
                styles = { ...styles, 'border-color': this.string2Hex(pokemon.translations.locale.locationMet) };
            }
            if (pokemonColor) {
                styles = { ...styles, 'border-color': htmlColors[pokemon.misc?.color?.toLowerCase() ?? 'red'] };
            }
            if (typeColor) {
                const count = pokemon.translations.english.types.length;
                const type1 = this.getTypeColor(pokemon.translations.english.types[0]);
                if (count === 2) {
                    const type2 = this.getTypeColor(pokemon.translations.english.types[1]);
                    styles = { ...styles,
                        'background': 'linear-gradient(to right, ' + type1 + ' 50%, ' + type2 + ' 50%)',
                    };
                }
                else {
                    styles = { ...styles,
                        'background': type1,
                    };
                }
            }
            return styles;
        },
        healthBarPercent: function (pokemon) {
            if (pokemon.hp.max === pokemon.hp.current) {
                return 100;
            }
            return (100 / pokemon.hp.max) * pokemon.hp.current;
        },
        healthBarClass: function (pokemon) {
            const percent = this.healthBarPercent(pokemon);
            if (percent === 0) {
                return 'progress-bar grey';
            }
            if (percent <= 25) {
                return 'progress-bar red';
            }
            if (percent <= 50) {
                return 'progress-bar yellow';
            }
            return 'progress-bar green';
        },
        isBorderColorType: function () {
            return clientSettings.params.getBool('typeColor', false);
        },
        getTypeColor: function (type) {
            return V3.getTypeColor(type);
        },
        getStatusColor: function (status) {
            return V3.getStatusColor(status);
        },
        string2Hex: function (str) {
            return string2ColHex(str);
        },
        sprite() {
            if (this.pokemon.isEgg) {
                return 'https://assets.pokelink.xyz/assets/sprites/egg.gif';
            }
            return V3.getSprite(this.pokemon);
        }
    },
    computed: {
        isMissingno() {
            if (this.pokemon.isEgg) {
                return false;
            }
            return this.pokemon.species <= 0;
        },
        isMale() {
            return !this.pokemon.isEgg && this.pokemon.gender === V3DataTypes.Gender.male;
        },
        isFemale() {
            return !this.pokemon.isEgg && this.pokemon.gender === V3DataTypes.Gender.female;
        },
        isGenderless() {
            return !this.pokemon.isEgg && this.pokemon.gender === V3DataTypes.Gender.genderless;
        },
        isHealthy() {
            return this.pokemon.status === V3DataTypes.StatusEffect.healthy;
        },
        statusImg() {
            switch (this.pokemon.status) {
                case V3DataTypes.StatusEffect.healthy:
                default:
                    return '';
                case V3DataTypes.StatusEffect.badlyPoisoned:
                case V3DataTypes.StatusEffect.poisoned:
                    return 'PSN';
                case V3DataTypes.StatusEffect.asleep:
                    return 'SLP';
                case V3DataTypes.StatusEffect.paralyzed:
                    return 'PAR';
                case V3DataTypes.StatusEffect.frozen:
                    return 'FRZ';
                case V3DataTypes.StatusEffect.burned:
                    return 'BRN';
            }
        }
    }
});
//# sourceMappingURL=pokemon-card.vue.js.map