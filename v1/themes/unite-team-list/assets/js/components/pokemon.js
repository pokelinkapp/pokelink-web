Vue.component( "Pokemon", {
  template: `
    <div
      :class="{'pokemon': true, 'isEmpty': !pokemonExists, 'isDead': isDead, isDamaged: justTookDamage, isParalyzed: isParalyzed, isPoisoned: isPoisoned, isFrozen: isFrozen, isBurned: isBurned, isSleeping: isSleeping, isSwitching: isSwitching, isActiveInBattle: isActiveInBattle, 'fixedSprite': fixedSprite && activePokemon !== null }"
      :style="activeStyles"
    >
      <div
        style="height: 100%; width: 100%;"
        class="pokemon__container"
      >
        <div class="pokemon__image-container">
          <TrimmedSprite
            :pokemon="activePokemon"
            v-if="pokemonExists"
            @done="fixedSprite = true"
          ></TrimmedSprite>
        </div>
        <div class="pokemon__info">
          <div class="bars">
            <div class="hp" v-if="">
              <div :style="{width:healthPercent}" :class="{ hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15 }"></div>
            </div>

            <div class="exp" v-if="">
              <div :style="{width:experienceRemaining}" class="exp__inner"></div>
            </div>
          </div>
          <div class="pokemon__info__name" :style="nameStyle">
            {{ nickname }}
          </div>
          <div class="pokemon__heldItem" :class="{'hasItem': hasItem}">
            <img :src="pokemon.heldItem.img" v-if="hasItem" />
          </div>
          <div class="pokemon__level">
            Lv. {{ level }}
          </div>
        </div>

        <div class="pokemon__gender" :class="sex">
          <Female v-if="sex === 'female'"></Female>
          <Male v-if="sex === 'male'"></Male>
        </div>
      </div>
    </div>
  `,
  props: {
    pokemon: {},
    key: {},
    loaded: false
  },
  data () {
    return {
      settings: {},
      activePokemon: null,
      justTookDamage: false,
      isSwitching: false,
      fixedSprite: true,
    }
  },
  created () {
    this.settings = window.settings;
    if (this.pokemon) {
      this.isSwitching = true
      setTimeout(() => {this.activateNewPokemon()}, 2000)
    }
  },
  computed: {
    pokemonExists () {
      if (!this.activePokemon || !this.activePokemon.hasOwnProperty('hp')) return false
      return true
    },
    healthPercent() {
      if (!this.pokemonExists) { return '0%' }
      return (100/this.activePokemon.hp.max) * this.activePokemon.hp.current + "%";
    },
    isDead () {
      if (!this.pokemonExists) { return false; }

      return parseFloat(this.healthPercent) === 0
    },
    isActiveInBattle () {
      if (!this.pokemonExists) { return false; }

      return this.activePokemon.is_active_in_battle
    },
    isSleeping () {
      if (!this.pokemonExists) { return false; }

      return !!this.activePokemon.status.slp
    },
    isBurned () {
      if (!this.pokemonExists) { return false; }

      return !!this.activePokemon.status.brn
    },
    isFrozen () {
      if (!this.pokemonExists) { return false; }

      return !!this.activePokemon.status.frz
    },
    isParalyzed () {
      if (!this.pokemonExists) { return false; }

      return !!this.activePokemon.status.par
    },
    isPoisoned () {
      if (!this.pokemonExists) { return false; }

      return !!this.activePokemon.status.psn
    },
    nickname() {
      if (!this.pokemonExists) { return ''; }
      return this.activePokemon.nickname || this.activePokemon.speciesName;
    },
    level() {
      if (!this.pokemonExists) { return ''; }
      return this.activePokemon.level
    },
    ability() {
      if (!this.pokemonExists) { return ''; }
      if (typeof this.activePokemon.ability === 'string') return this.activePokemon.ability
      let ability = getAbilityById(this.activePokemon.ability)
      return ability.name || '';
    },
    sex() {
      if (!this.pokemonExists) { return ''; }
      return (this.activePokemon.isGenderless ? '' : (this.activePokemon.isFemale ? 'female' : 'male'));
    },
    ident() {
      if (!this.pokemonExists) { return null; }
      return this.activePokemon.species;
    },
    opacity() {
      if (!this.pokemonExists) { return '0.4'; }
      return '1';
    },
    hasItem() {
      if (!this.pokemonExists) { return false; }
      if (typeof this.activePokemon.heldItem === "undefined") { return false; }
      return ![0,null].includes(this.activePokemon.heldItem.id);
    },
    sprite () {
      if (!this.pokemonExists) { return ''; }
      if (this.activePokemon.img) {
        return this.activePokemon.img;
      }

      return '';
    },
    experienceRemaining () {
      if (!this.pokemonExists) { return '0%'; }
      const expGroup = exp_groups_table.find(group => this.activePokemon.species === group.id)
      const levelExp = experience_table.filter((expRange) => {
        return expRange.level === this.activePokemon.level+1
            || expRange.level === this.activePokemon.level
      })

      const totalExpForThisRange = levelExp[1][expGroup['levelling_type']] - levelExp[0][expGroup['levelling_type']]
      const expLeftInThisRange = this.activePokemon.exp - levelExp[0][expGroup['levelling_type']]

      return (100/totalExpForThisRange) * expLeftInThisRange + '%'
    },
    moves () {
      if (!this.pokemonExists) { return [] }
      return [this.activePokemon.move1, this.activePokemon.move2, this.activePokemon.move3, this.activePokemon.move4]
        .filter(move => move.hasOwnProperty('type'))
        .map(move => {
          let moveType = movedex.all().find(iteratedMove => iteratedMove.ename.toLowerCase() === move.name.toLowerCase())
          return {
            ...move,
            type: moveType.type.toLowerCase(),
            maxPP: moveType.pp,
            color: this.settings.typeColors[moveType.type.toLowerCase()],
            remaining: Math.ceil(((move.pp / moveType.pp) * 100) / 25)
          }
        })
    },

    activeStyles () {
      if (!this.pokemonExists) { return {} }
      let styles = {}
      // if (this.isActiveInBattle){
      //   let primaryType = this.activePokemon.types[0].label.toLowerCase()
      //   let backgroundColor = hex2rgba(this.settings.typeColors[primaryType], 80)
      //   styles = {...styles, 'background-color': backgroundColor}
      // }

      return styles
    },

    nameStyle () {
      let styles = {
        // 'opacity': this.opacity,
      }

      if (this.pokemonExists) {
        let primaryType = this.activePokemon.types[0].label.toLowerCase()
        let secondaryType = primaryType;
        if (this.activePokemon.types.length < 1) {
          secondaryType = this.activePokemon.types[1].label.toLowerCase()
        }

        styles = {...styles, 'background-image': 'linear-gradient(180deg, ' + this.settings.typeColors[primaryType] + ', ' + this.settings.typeColors[secondaryType]  + ')'}
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
  },
  methods: {
    activateNewPokemon () {
      this.activePokemon = this.pokemon
      this.isSwitching = false
    }
  },
  watch: {
    pokemon (newVal, oldVal) {
      try {
        if (newVal.pid === oldVal.pid) { this.activateNewPokemon() }
        if (newVal.pid !== oldVal.pid || oldVal === null) {
          this.isSwitching = true
          setTimeout(() => {this.activateNewPokemon()}, 2000)
        }

        if (newVal.species !== oldVal.species) return
        if (newVal.hp.current < oldVal.hp.current) {
          this.justTookDamage = true
          setTimeout(() => {
            this.justTookDamage = false
          }, 3000)
        }
      } catch (e) {
        return
      }
    }
  },
});
