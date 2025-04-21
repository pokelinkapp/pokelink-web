import { defineComponent } from 'vue';
import { V2, clientSettings, V2DataTypes, string2ColHex } from 'pokelink';
export default defineComponent({
    template: `
      <div>
        <div :class="{ 'pokemon__slot': true, 'type_border': isBorderColorType() }" :style="styleBorder(pokemon)"
             v-if="pokemon !== null">
          <div :class="{ 'pokemon__image': true, 'pokemon__dead': (pokemon.hp.current === 0)}">
            <img ref="pokemonSprite" @error="useFallback" :src="getSprite()">
          </div>
          <div class="pokemon__nick">
            <span class="pokemon__nick-shiny" v-if="pokemon.isShiny">★</span>
            <span>{{ pokemon.nickname || pokemon.translations.locale.speciesName }}</span>
            <span class="pokemon__gender pokemon__gender-male"
                  v-if="isMale()">♂</span>
            <span class="pokemon__gender pokemon__gender-female"
                  v-if="isFemale">♀</span>

          </div>
          <div v-if="pokemon.hp.current !== 0">
            <div class="pokemon__level-bar" v-if="pokemon.level !== 100 && pokemon.level > 0">
              <span class="pokemon__level">L{{ pokemon.level }}</span>
              <span class="pokemon__hp" style="float: right;">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</span>
            </div>
            <div class="pokemon__level-bar" v-else>
              <div class="pokemon__hp">{{ pokemon.hp.current }}/{{ pokemon.hp.max }}</div>
            </div>
          </div>
          <div v-else>
            <div class="pokemon__dead-label"> DEAD</div>
          </div>
          <div class="pokemon__hp-bar">
            <div class="progress" style="height: 9px;">
              <div :class="healthBarClass(pokemon)" v-bind:style="{width: healthBarPercent(pokemon) + '%'}"
                   role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0"
                   :aria-valuemax="pokemon.hp.max"></div>
            </div>
          </div>
        </div>
        <div class="pokemon__slot pokemon__empty" v-else>
          <div class="pokemon__image">
          </div>
        </div>
      </div>
    `,
    props: {
        pokemon: {
            type: Object,
            required: true
        },
        settings: Object
    },
    methods: {
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite, this.pokemon);
        },
        getSprite() {
            return V2.getSprite(this.pokemon);
        },
        styleBorder(pokemon) {
            let color = clientSettings.params.getString('color', undefined);
            const routeColor = color === 'route';
            const pokemonColor = color === 'pokemon';
            const typeColor = color === 'type';
            if (routeColor) {
                return { 'border-color': string2ColHex(pokemon.translations.english.locationMetName) };
            }
            if (pokemonColor) {
                return { 'border-color': pokemon.color };
            }
            if (typeColor) {
                const types = pokemon.translations.english.types;
                const count = types.length;
                const type1 = V2.getTypeColor(types[0]);
                if (count === 2) {
                    const type2 = V2.getTypeColor(types[1]);
                    return {
                        'background': 'linear-gradient(to right, ' + type1 + ' 50%, ' + type2 + ' 50%)',
                        'border-color': 'black'
                    };
                }
                return { 'background': type1, 'border-color': 'black' };
            }
            return { 'border-color': 'black' };
        },
        healthBarPercent: function (pokemon) {
            if (pokemon.hp.max === pokemon.hp.current) {
                return 100;
            }
            return (100 / pokemon.hp.max) * pokemon.hp.current;
        },
        healthBarClass: function (pokemon) {
            const percent = this.healthBarPercent(pokemon);
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
            return V2.getTypeColor(type);
        },
        getStatusColor: function (status) {
            return V2.getStatusColor(status);
        },
        string2Hex: function (str) {
            return string2ColHex(str);
        },
        isMale() {
            return this.pokemon.gender === V2DataTypes.Gender.male;
        },
        isFemale() {
            return this.pokemon.gender === V2DataTypes.Gender.female;
        }
    },
    computed: {}
});
//# sourceMappingURL=pokemon-card.vue.js.map