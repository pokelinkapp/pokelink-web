Vue.component( "Pokemon", {
  template: `
    <div :class="{ 'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage }">
      <div style="position: relative;">
        <svg height="137" width="135">
          <polyline
            points="100 3, 130 30, 130 70, 100 100"
            stroke="#cccbcb"
            stroke-width="5"
            fill="transparent"
            style="stroke-dasharray: '0'; stroke-linecap: round; stroke: #cccbcb; stroke-dashoffset: 125;"
          >
          </polyline>
          <polyline
            points="100 3, 130 30, 130 70, 100 100"
            stroke="orange"
            stroke-width="5"
            fill="transparent"
            :style="{'stroke-dasharray': '125', 'transition': '1s ease-in-out', 'stroke-linecap': 'round', stroke: healthBarColor, 'stroke-dashoffset': 125-((125/100)*healthPercent) }"
          >
          </polyline>

          <!-- Experience Bars -->
          <polyline
            points="30 3, 3 30, 3 70, 30 100"
            stroke="#cccbcb"
            stroke-width="5"
            fill="transparent"
            :style="{'stroke-dasharray': '125', 'stroke-dashoffset': '0', 'transition': '1s ease-in-out', 'stroke-linecap': 'round', 'stroke': '#cccbcb'}"
          ></polyline>
          <polyline
            points="30 3, 3 30, 3 70, 30 100"
            stroke="blue"
            stroke-width="5"
            fill="transparent"
            :style="{'stroke-dasharray': '125', 'stroke-dashoffset': 125-((125/100)*experienceRemaining), 'transition': '1s ease-in-out', 'stroke-linecap': 'round', 'stroke': '#00b0ff'}"
          ></polyline>
      </svg>

      <div class="pokemon__name" v-if="typeof pokemon == 'object'" >
        {{pokemon.nickname}}
      </div>

      <div class="pokemon__image" v-if="typeof pokemon == 'object'" >
        <img v-if="pokemon.isEgg" class="sprite" :src="pokemon.img" style="transform: scale(0.8); bottom: 0px;" />
        <img v-else class="sprite" :src="pokemon.img" />
      </div>
    </div>
  `,
  props: {
    pokemon: {},
    key: {}
  },
  data () {
    return {
      settings: {},
      justTookDamage: false
    }
  },
  created () {
    this.settings = window.settings;
  },
  computed: {
    healthPercent() {
      if (typeof this.pokemon === "undefined") { return 0; }
      return (100/this.pokemon.hp.max) * this.pokemon.hp.current;
    },
    isDead () {
      if (typeof this.pokemon === "undefined") { return false; }

      return parseFloat(this.healthPercent) === 0
    },
    healthBarColor () {
      if (parseFloat(this.healthPercent) <= 15) {
        return '#f51700'
      }

      if (parseFloat(this.healthPercent) <= 50) {
        return '#f1f500'
      }

      return '#8bf500'
    },
    nickname() {
      return this.pokemon.nickname || this.pokemon.speciesName;
    },
    sex() {
      return (this.pokemon.isGenderless ? '' : (this.pokemon.isFemale ? 'female' : 'male'));
    },
    ident() {
      if (typeof this.pokemon === "undefined") { return null; }
      return this.pokemon.species;
    },
    opacity() {
      if (typeof this.pokemon === "undefined") { return '0.4'; }
      return '1';
    },
    hasItem() {
      if (typeof this.pokemon === "undefined") { return false; }
      if (typeof this.pokemon.heldItem === "undefined") { return false; }
      return this.pokemon.heldItem.id !== 0;
    },
    sprite () {
      console.log(this.pokemon)
      if (typeof this.pokemon === "undefined") { return ''; }
      if (this.pokemon.img) {
        return this.pokemon.img;
      }

      return '';
    },
    experienceRemaining () {
      if (typeof this.pokemon === "undefined") { return 0; }
      try {
        const expGroup = exp_groups_table.find(group => this.pokemon.species === group.id)
        const levelExp = experience_table.filter((expRange) => {
          return expRange.level === this.pokemon.level+1
              || expRange.level === this.pokemon.level
        })

        const totalExpForThisRange = levelExp[1][expGroup['levelling_type']] - levelExp[0][expGroup['levelling_type']]
        const expLeftInThisRange = this.pokemon.exp - levelExp[0][expGroup['levelling_type']]

        return (100/totalExpForThisRange) * expLeftInThisRange;
      } catch (e) {
        return 50
      }
    },
    mainStyle () {
      // let styles = {
      //   'opacity': this.opacity,
      // }

      // if (this.pokemon) {
      //   let primaryType = this.pokemon.types[0].label.toLowerCase()
      //   styles = {...styles, 'background-image': 'linear-gradient(180deg, ' + this.settings.typeColors[primaryType] + ', white)'}
      // }

      // return styles;
    },

    nameStyle () {
      let styles = {
        'opacity': this.opacity,
      }

      if (this.pokemon) {
        let primaryType = this.pokemon.types[0].label.toLowerCase()
        let secondaryType = primaryType;
        if (this.pokemon.types.length < 1) {
          secondaryType = this.pokemon.types[1].label.toLowerCase()
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
  watch: {
    pokemon (newVal, oldVal) {
      try {
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
