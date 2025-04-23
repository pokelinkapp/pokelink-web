import { defineComponent } from 'vue';
import { isDefined, V2, V2DataTypes } from 'pokelink';
export default defineComponent({
    template: `
    <div :class="{ 'pokemon': true, 'isDead': isDead}" :style="{'opacity': opacity }">
      <div v-if="isValid">

        <div class="exp" v-if="!pokemon.isEgg">
          <div :style="{width:experienceRemaining}" class="exp__inner"></div>
        </div>

        <div class="pokemon__image">
          <img v-if="pokemon.isEgg" ref="pokemonImg" @error="useFallback" class="sprite" :src="getSprite()" style="max-height: 80%;" />
          <img v-else ref="pokemonImg" @error="useFallback" class="sprite" :src="getSprite()" />
        </div>

        <div class="pokemon__name">
          {{ nickname }}
          <span
            class="pokemon__gender-icon pokemon__gender-icon--male"
            v-if="isMale"
          >
            ♂
          </span>
          <span
            class="pokemon__gender-icon pokemon__gender-icon--female"
            v-if="isFemale"
          >
            ♀
          </span>
        </div>

        <div class="pokemon__level">
          <small>Lv</small>{{pokemon.level}}
        </div>

        <div class="pokemon_bg"></div>

        <div class="hp__text-values">{{pokemon.hp.current}} / {{pokemon.hp.max}}</div>
        <div class="hp__text-label">HP:</div>
        <div class="pokemon__hp">
          <div :class="{hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }" :style="{width: healthPercent}"></div>
        </div>

        <div class="moves">
          <div v-for="move in pokemon.moves" class="move">
            <div class="move__icon"></div>
            <div class="move__name">
              <svg>
                <text x="50%" y="28" fill="white" text-anchor="middle">{{ move.locale.name }} {{ move.pp }}</text>
              </svg>
            </div>
            <div class="move__pp">{{move.pp}}</div>
          </div>
        </div>

        <div class="pokemon__heldItem" v-if="hasItem">
          <img :src="heldItemImage" onerror="this.src='https://assets.pokelink.xyz/assets/sprites/items/gen7/0.png'">
        </div>
      </div>
    </div>
  `,
    props: {
        pokemon: {
            type: Object,
            required: true
        },
        key: {}
    },
    mounted() {
        const vm = this;
        V2.handleSpriteTemplateUpdate(() => {
            vm.$forceUpdate();
        });
    },
    methods: {
        getViewBox(moveName) {
            let wordLength = 0;
            if (moveName)
                wordLength = moveName.length;
            let width = wordLength * 35;
            if (width < 70)
                width = 120;
            return `0 0 ${width} 30`;
        },
        isValidMoveName(moveName) {
            return /[0-9a-zA-Z]+$/.test(moveName);
        },
        getSprite() {
            return V2.getSprite(this.pokemon);
        },
        useFallback() {
            V2.useFallback(this.$refs.pokemonImg, this.pokemon);
        },
        isDefined(object) {
            return isDefined(object);
        }
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon);
        },
        isMale() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.gender === V2DataTypes.Gender.male;
        },
        isFemale() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.gender === V2DataTypes.Gender.female;
        },
        healthPercent() {
            if (!this.isValid) {
                return '0%';
            }
            return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + "%";
        },
        isDead() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.hp.current === 0;
        },
        nickname() {
            return this.pokemon.nickname || this.pokemon.translations.locale.speciesName;
        },
        ident() {
            if (!this.isValid) {
                return null;
            }
            return this.pokemon.species;
        },
        opacity() {
            if (!this.isValid) {
                return '0.4';
            }
            return '1';
        },
        hasItem() {
            if (!this.isValid) {
                return false;
            }
            return this.pokemon.heldItem !== 0;
        },
        heldItemImage() {
            return `https://assets.pokelink.xyz/assets/sprites/items/gen7/${this.pokemon.heldItem}.png`;
        },
        experienceRemaining() {
            if (!this.isValid) {
                return '0%';
            }
            return this.pokemon.expPercentage + '%';
        },
        selectedPokemon: {
            get: function () {
                return this.nickname;
            },
            set: function () {
                this.$emit("change", this.nickname);
            }
        }
    }
});
//# sourceMappingURL=pokemon.vue.js.map