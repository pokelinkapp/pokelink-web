import { defineComponent } from 'vue';
import { V3, clientSettings, V3DataTypes, string2ColHex } from 'pokelink';
import heartGauge from '../../../../_shared/components/heartGauge.vue.js';
export default defineComponent({
    template: `
      <div>
        <div :class="{ 'pokemon__slot': true, 'type_border': isBorderColorType() }" :style="styleBorder()"
             v-if="isValid">
          <div :class="{ 'pokemon__image': true, 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img ref="pokemonSprite" @error="useFallback" :src="getSprite()">
          </div>
          <div v-if="!pokemon.isEgg">
            <div class="pokemon__nick" v-if="!hideName">
              <span class="pokemon__nick-shiny" v-if="pokemon.isShiny">★</span>
              <span>{{ pokemon.misc?.nickname || pokemon.translations.locale.species }}</span>
              <span class="pokemon__gender pokemon__gender-male"
                    v-if="isMale()">♂</span>
              <span class="pokemon__gender pokemon__gender-female"
                    v-if="isFemale()">♀</span>

            </div>
            <div v-if="!hideHP || !hideLevel">
              <div class="pokemon__level-bar" v-if="pokemon.hp.current !== 0">
                <span class="pokemon__level" v-if="pokemon.exp?.level < 100 && pokemon.exp?.level > 0 && !hideLevel">L{{ pokemon.exp?.level }}</span>
                <span class="pokemon__hp" :style="[!hideLevel ? 'float: right' : '']" v-if="!hideHP">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</span>
              </div>
              <div v-else>
                <div class="pokemon__dead-label"> DEAD</div>
              </div>
              <div class="pokemon__hp-bar" v-if="!hideHP">
                <div class="progress" style="height: 9px;">
                  <div :class="healthBarClass()" v-bind:style="{width: healthBarPercent() + '%'}"
                       role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0"
                       :aria-valuemax="pokemon.hp.max"></div>
                </div>
              </div>
            </div>
            <heart-gauge :pokemon="pokemon"></heart-gauge>
          </div>
        </div>
        <div class="pokemon__slot pokemon__empty" v-else>
          <div class="pokemon__image">
          </div>
        </div>
      </div>
    `,
    components: {
        'heart-gauge': heartGauge
    },
    props: {
        pokemon: {
            type: Object,
            required: true
        },
        settings: Object
    },
    data() {
        return {
            hideHP: true,
            hideLevel: true,
            hideName: true
        };
    },
    mounted() {
        const vm = this;
        V3.onSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
        this.hideHP = clientSettings.params.getBool('hideHP', false);
        this.hideLevel = clientSettings.params.getBool('hideLevel', false);
        this.hideName = clientSettings.params.getBool('hideName', false);
    },
    computed: {
        isValid() {
            return V3.isValidPokemon(this.pokemon);
        }
    },
    methods: {
        useFallback() {
            V3.useFallback(this.$refs.pokemonSprite, this.pokemon);
        },
        getSprite() {
            if (this.pokemon.isEgg) {
                return 'https://assets.pokelink.xyz/V3/sprites/egg.gif';
            }
            return V3.getSprite(this.pokemon);
        },
        styleBorder(pokemon) {
            if (!this.isValid) {
                return { 'border-color': 'black' };
            }
            let color = clientSettings.params.getString('color', undefined);
            const routeColor = color === 'route';
            const pokemonColor = color === 'pokemon';
            const typeColor = color === 'type';
            if (routeColor) {
                return { 'border-color': string2ColHex(pokemon.translations.english.locationMet) };
            }
            if (pokemonColor) {
                return { 'border-color': pokemon.misc?.color };
            }
            if (typeColor) {
                const types = pokemon.translations.english.types;
                const count = types.length;
                const type1 = V3.getTypeColor(types[0]);
                if (count === 2) {
                    const type2 = V3.getTypeColor(types[1]);
                    return {
                        'background': 'linear-gradient(to right, ' + type1 + ' 50%, ' + type2 + ' 50%)',
                        'border-color': 'black'
                    };
                }
                return { 'background': type1, 'border-color': 'black' };
            }
            return { 'border-color': 'black' };
        },
        healthBarPercent: function () {
            if (!this.isValid) {
                return 100;
            }
            if (this.pokemon.hp.max === this.pokemon.hp.current) {
                return 100;
            }
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current;
        },
        healthBarClass: function () {
            const percent = this.healthBarPercent();
            if (percent == 0) {
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
            return clientSettings.params.getString('color', undefined) === 'type';
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
        isMale() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.gender === V3DataTypes.Gender.male;
        },
        isFemale() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.gender === V3DataTypes.Gender.female;
        }
    }
});
//# sourceMappingURL=pokemon-card.vue.js.map