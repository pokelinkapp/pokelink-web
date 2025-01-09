new Vue({
  el: '#badges',
  data: function () {
    return {
      connected: false,
      loaded: false,
      settings: {},
      badges: [],
      game: {}
    };
  },
  created: function () {
    this.loaded = true
    this.settings = window.settings;
  },
  mounted: function () {
    var vm = this;
    let badgesClient = client.setup(settings.port, 'badges-'+settings.currentUser+'-browser', settings.server, (data) => {
      vm.connected = true;
    })
      .on('player:trainer:updated', (payload) => { this.updateBadges(payload)})
      .on('client:players:list', (users) => {
        users.forEach(user => {
          this.updateBadges(user)
        });
      })

  },
  updated: function( ){
    var vm = this;
  },
  methods: {
    updateBadges (payload) {
      //console.log(`Trainer Update recieved for ${payload.username}`)
      //console.log(payload.username, window.settings)
      if (payload.username !== settings.currentUser) return;

      badgeFolder = collect(badges).filter((badgeCollection) => {
        return badgeCollection.id === settings.game.id
          || badgeCollection.id === payload.trainer.game.id
      }).first().folder;

      this.game = payload.trainer.game
      this.badges = payload.trainer.badges
        .map(function(badge) {
          var badgeObj = {};
          badgeObj.img = window.settings.imgPaths.badges+badgeFolder+'/'+badge.name.toLowerCase()+'.png';
          badgeObj.label = badge.name+' Badge';
          badgeObj.active = badge.value
          return badgeObj;
        });

    }
  },
  computed: {
    hasGroupedBadges () {
      return this.groupedBadges.length
    },
    groupedBadges () {
      if (!this.connected) return []
      let rawBadges = badges.find(game => game.id === this.settings.game.id)
      this.badgeFolder = rawBadges.folder
      let groups = []
      if (!rawBadges.hasOwnProperty('groups')) return []

      groups = rawBadges.groups
        .map(({ translationKey, key }) => {
          return {
            title: translationKey,
            badges: this.badges
              .filter(badge => badge.label.startsWith(key))
              .map(badge => {
                return {...badge, name: badge.label, value: badge.value}
              })
          }
        })

      return groups
    }
  }
});
