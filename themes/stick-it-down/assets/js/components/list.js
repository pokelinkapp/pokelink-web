Vue.component( "List", {
  template: `
  <div style="display: none" :class="{ 'browser-connected' : true, 'darkMode': settings.theme.darkMode }" class="pokes">
    <transition-group :name="switchSpeed" tag="div" :class="['pokemon__list', {'flipped': flipped === true}]" v-if="loaded">
      <Pokemon v-for="( poke, idx ) in pokemonToShow" v-if="typeof poke == 'object'" :key="poke.pid" :pokemon="poke">
      </Pokemon>
    </transition-group>
    <div class="no-connection" v-if="!connected">
      <p>Waiting for successful connection to Pokélink...</p>
      <p>Attempting to connect on port {{settings.port}}</p>
    </div>
  </div>
`,
  data() {
    return {
      connected: false,
      loaded: false,
      settings: {},
      party: [],
      players: {},
      party_count: 0,
      switchSpeed: 'switchMedium',
      flipped: false
    }
  },
  created: function () {
    this.loaded = true
    this.settings = window.settings;
    this.flipped = !!params.get('flipped')
  },
  mounted: function () {
    var vm = this;
    client.setup(settings.port, settings.currentUser+'-browser', settings.server, (username, party) => {
        vm.connected = true;
        vm.players[username] = party.map(function (pokemonWrapper) {
            let mon = pokemonWrapper.pokemon;
            if (mon == null) {
                return false;
            }

            return transformPokemon(mon);
        });

        if (username == client.currentUser) {
            vm.party = vm.players[username];
            vm.party_count = vm.party.filter(function(value) { return typeof value == "object" }).length;
        }
    })
    .on('player:trainer:updated', (payload) => { this.updateTrainerStuffs(payload)})
    ;
  },
  methods: {
    updateTrainerStuffs (payload) {
      if (window.settings.debug) {
        console.log(`Trainer Update recieved for ${payload.username}`)
        console.log(payload, window.settings)
      }
      if (payload.username !== settings.currentUser) return;

    },

    update( val ) {
    },
  },
  computed: {
    singleSlot () {
      let params = new URLSearchParams(document.location.search.substring(1));
      if (params.has('slot')) {
        return true
      }
      return false
    },
    slotId () {
      let availableSlots = [1,2,3,4,5,6]
      let params = new URLSearchParams(document.location.search.substring(1));
      if (params.has('slot') && availableSlots.includes(parseInt(params.get('slot')))) {
        return params.get('slot') - 1
      }
      return 0
    },
    pokemonToShow () {
      let params = new URLSearchParams(document.location.search.substring(1));

      if (this.singleSlot === true) {
        return [this.party[this.slotId]]
      }

      if (params.has('fromSlot') && params.has('slots')) {
        return this.party.slice(
          parseInt(params.get('fromSlot')) - 1,
          parseInt(params.get('fromSlot')) - 1 + parseInt(params.get('slots'))
        )
      }

      return this.party
    },
    showEmptySlots() {

      if (this.singleSlot === true) {
        return false;
      }

      if (params.has('fromSlot') && params.has('slots')) {
        if (this.pokemonToShow.includes(false)) {
          return true;
        }
        return false;
      }

      if (this.party_count !== 6) {
        return true;
      }

      return true;
    }
  }
});
