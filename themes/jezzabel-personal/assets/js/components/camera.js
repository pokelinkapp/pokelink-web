Vue.component( "Camera", {
  template: `
  <div style="display: none" :class="{ 'browser-connected' : true, 'darkMode': settings.theme.darkMode }" class="pokes">
    <div class="wrapper" :class="{'justTookDamage': justTookDamage, 'inPosition': inPosition}">
      <div class="gradient-border" id="box" v-if="!inPosition">
        Your<br>Camera<br>Here<br>
        <br>
        <br>
        Damage<br>Pulse
      </div>
      <div class="noBG gradient-border" id="box" v-else>
      </div>
    </div>
  </div>
`,
  data() {
    return {
      connected: false,
      loaded: false,
      settings: {},
      party: [],
      hpSet: [],
      players: {},
      party_count: 0,
      switchSpeed: 'switchMedium',
      flipped: false,
      justTookDamage: false
    }
  },
  created: function () {
    this.loaded = true
    this.settings = window.settings;
    this.flipped = !!params.get('flipped');
    this.width = params.get('width');
    this.height = params.get('height');
    this.inPosition = params.has('inPosition');
    document.querySelector(':root').style.setProperty('--customWidth', this.width + 'px');
    document.querySelector(':root').style.setProperty('--customHeight', this.height + 'px');
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
            // vm.hpSet = [...vm.party.map(function(poke) { return poke.hp.curent;})];
            vm.party_count = vm.party.filter(function(value) { return typeof value == "object" }).length;
        }
    })
    .on('player:trainer:updated', (payload) => { this.updateTrainerStuffs(payload)})
    ;
  },
  computed: {
    customStyles () {
      let styles = {
        '--customWidth': this.width + 'px',
        '--customHeight': this.height + 'px'
      }
      console.log(styles)
      document.querySelector(':root').style.setProperty('--customWidth', this.width + 'px')
      document.querySelector(':root').style.setProperty('--customHeight', this.height + 'px')
      return styles
    }
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

  watch: {
    party: {
      deep: true,
      handler (newVal, oldVal) {
        let vm = this
        if (Array.isArray(oldVal) && oldVal.length <= 0) return;
        let damageTaken = false;
        console.log(newVal)
        newVal.filter(val => !!val).forEach((poke, index) => {
          try {
            let damageAmount = oldVal[index].hp.current - newVal[index].hp.current
            let damagePercent = (100/newVal[index].hp.max) * damageAmount
            console.log(damagePercent)
            if (newVal[index].hp.current < oldVal[index].hp.current/*  && damagePercent > 25 && newVal[index].pid === oldVal[index].pid */) {
              vm.justTookDamage = true
              setTimeout(() => {
                vm.justTookDamage = false
              }, 3000)
            }
          } catch (e) {
            console.info({
              new: newVal[index],
              old: oldVal[index]
            })
          }
        })
      }
    },
  }
});
