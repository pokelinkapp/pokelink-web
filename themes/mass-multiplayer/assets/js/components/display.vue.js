import { defineComponent } from 'vue';
import { deathId, graveyardId, isDefined, partyId, pokemonSubcomponents, reviveId, settingsId, settingsSubcomponents, string2ColHex, V3 } from 'pokelink';
import pokemonCard from './pokemon-card.vue.js';
export default defineComponent({
    template: `
      <div class="flex w-screen h-screen flex-wrap overflow-y-auto">
        <div v-for="(data, user) in users" class="flex">
          <div class="mb-1 mt-1" v-if="getTimeDiff(user) < 300000 && user !== 'Pokelink'">
            <span class="text-6xl" :class="'text-[' + data.color + ']'">{{ user }}</span>
            <transition-group :name="switchSpeed" tag="div" class="flex">
              <pokemon-card v-for="poke in data.party" v-if="poke !== null"
                            :pokemon="poke" :key="poke?.uid ?? poke?.pid"></pokemon-card>
            </transition-group>
            <div class="text-5xl" :class="'text-[' + data.color + ']'">Goals {{ data.goals.filter(x => x.obtained).length }}/{{ data.goals.length }}
            </div>
            <div class="text-5xl" :class="'text-[' + data.color + ']'">Deaths: <span class="text-red-500">{{ data.deaths.length }}</span></div>
          </div>
        </div>
      </div>
    `,
    components: {
        'pokemon-card': pokemonCard
    },
    mounted() {
        const vm = this;
        const components = {};
        components[settingsId] = [
            settingsSubcomponents.spriteTemplate
        ];
        components[partyId] = {
            partySize: V3.getPartySize(),
            fromSlot: V3.getFromSlot(),
            pokemon: [
                pokemonSubcomponents.hp,
                pokemonSubcomponents.shadow
            ]
        };
        components[graveyardId] = null;
        components[deathId] = null;
        components[reviveId] = null;
        V3.initialize(components, { numberOfPlayers: -1 });
        V3.onPartyUpdate(((party, _, username) => {
            this.initializeIfUndefined(username);
            this.users[username].party = party.filter(this.isDefined);
            vm.$forceUpdate();
        }));
        // V3.onGoalUpdate((goals, username) => {
        //     this.initializeIfUndefined(username)
        //
        //     this.users[username].goals = goals
        // })
        V3.onGraveyardUpdate((graveyard, username) => {
            this.initializeIfUndefined(username);
            this.users[username].deaths = graveyard;
        });
        V3.onDeath((pokemon, username) => {
            this.initializeIfUndefined(username);
            this.users[username].deaths.push(pokemon);
        });
        V3.onRevive((graveId, username) => {
            this.initializeIfUndefined(username);
            this.users[username].deaths = this.users[username].deaths.filter((x) => x.id !== graveId);
        });
        setInterval(this.checkUsers, 10000);
    },
    data() {
        return {
            users: {},
            switchSpeed: 'switchMedium'
        };
    },
    methods: {
        initializeIfUndefined(user) {
            if (!isDefined(this.users[user])) {
                this.users[user] = {
                    party: [],
                    goals: [],
                    deaths: [],
                    lastUpdate: new Date(),
                    timedOut: false,
                    color: string2ColHex(user)
                };
            }
            this.users[user].lastUpdate = new Date();
            this.users[user].timedOut = false;
        },
        checkUsers() {
            this.$forceUpdate();
            // for (const user in this.users) {
            //     const timeDiff = new Date().getTime() - this.users[user].lastUpdate.getTime()
            //     if (timeDiff >= 10000 && !this.users[user].timedOut) {
            //         if (clientSettings.debug) {
            //             console.debug(`${user} has been idle for 30 seconds`)
            //         }
            //         this.users[user].timedOut = true
            //     } else if (timeDiff >= 30000) {
            //         if (clientSettings.debug) {
            //             console.debug(`${user} has been removed for being idle for 120 seconds`)
            //         }
            //         delete this.users[user]
            //     }
            // }
        },
        getTimeDiff(user) {
            return new Date().getTime() - this.users[user].lastUpdate.getTime();
        },
        isDefined(obj) {
            return isDefined(obj);
        }
    }
});
//# sourceMappingURL=display.vue.js.map