import { defineComponent } from 'vue';
import { V2, V2DataTypes } from 'pokelink';
import male from './male.vue.js';
import female from './female.vue.js';
export default defineComponent({
    template: `
      <div :class="{ 'pokemon': true, 'isDead': isDead }" :style="mainStyle">
        <img v-if="isValid" :src="getSprite()"
             style="visibility: hidden; position: absolute;" ref="pokemonSprite" @error="useFallback" @load="spriteLoaded">
        <div ref="pokeSprite" style="position: relative;"
             v-if="isValid">
          <!-- <img v-if="pokemon.isEgg" class="sprite" :src="pokemon.image" />
           <img v-else class="sprite" :src="pokemon.img" />-->

          <span class="sex" :class="sex" v-if="sex !== ''">
          <female v-if="sex === 'female'"></female>
          <female v-if="sex === 'female'" color="#000000"></female>
          <male v-if="sex === 'male'"></male>
          <male v-if="sex === 'male'" color="#000000"></male>
        </span>
        </div>
        <label v-else></label>
      </div>
    `,
    components: {
        'female': female,
        'male': male
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
            image: null
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
        useFallback() {
            V2.useFallback(this.$refs.pokemonSprite, this.pokemon);
            this.$refs.pokeSprite.style.backgroundImage = `url('${this.$refs.pokemonSprite.src}')`;
        },
        getSprite() {
            return V2.getSprite(this.pokemon);
        },
        spriteLoaded() {
            console.log('test');
            this.$refs.pokeSprite.style.backgroundImage = `url('${this.$refs.pokemonSprite.src}')`;
        }
    },
    computed: {
        isValid() {
            return V2.isValidPokemon(this.pokemon);
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
        sex() {
            return (this.pokemon.gender === V2DataTypes.Gender.genderless ? '' : (this.pokemon.gender === V2DataTypes.Gender.female ? 'female' : 'male'));
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
            if (typeof this.pokemon.heldItem === 'undefined') {
                return false;
            }
            return this.pokemon.heldItem !== 0;
        },
        mainStyle() {
            let styles = {
                'opacity': this.opacity
            };
            // if (this.pokemon) {
            //   let primaryType = this.pokemon.types[0].label.toLowerCase()
            //   styles = {...styles, 'background-image': 'linear-gradient(180deg, ' + this.settings.typeColors[primaryType] + ', white)'}
            // }
            return styles;
        },
        selectedPokemon: {
            get: function () {
                return this.nickname;
            },
            set: function () {
                this.$emit('change', this.nickname);
            }
        }
    }
});
//# sourceMappingURL=pokemon.vue.js.map