import {defineComponent, PropType} from 'vue'
import {clientSettings, isDefined, Nullable, string2ColHex, V2} from 'pokelink'
import {Badge, Pokemon} from 'v2Proto'
import pokemonCard from './pokemon-card.vue.js'

interface UserData {
    party: Nullable<Pokemon>[]
    badges: Badge[],
    deaths: Pokemon[]
    lastUpdate: Date,
    timedOut: boolean,
    color: string
}

export default defineComponent({
    template: `
      <div class="flex w-screen h-screen flex-wrap overflow-y-auto">
        <div v-for="(data, user) in users" class="flex-1">
          <div class="mb-4 mt-4">
            <span class="text-6xl" :class="'text-[' + data.color + ']'">{{ user }}</span>
            <transition-group :name="switchSpeed" tag="div" class="flex">
              <pokemon-card v-for="poke in data.party" v-if="poke !== null"
                            :pokemon="poke" :key="poke?.pid"></pokemon-card>
            </transition-group>
            <div class="text-5xl" :class="'text-[' + data.color + ']'">Badges {{ data.badges.filter(x => x.obtained).length }}/{{ data.badges.length }}
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
        const vm = this

        V2.initialize({listenForSpriteUpdates: false, numberOfPlayers: -1})

        V2.handlePartyUpdates(((party, username) => {
            this.initializeIfUndefined(username)

            this.users[username].party = party
            vm.$forceUpdate()
        }))

        V2.handleBadgeUpdates((badges, username) => {
            this.initializeIfUndefined(username)

            this.users[username].badges = badges
        })

        V2.handleDeath((pokemon, username) => {
            this.initializeIfUndefined(username)

            this.users[username].deaths.push(pokemon)
        })

        V2.handleRevive((graveId, username) => {
            this.initializeIfUndefined(username)

            this.users[username].deaths = this.users[username].deaths.filter((x: Pokemon) => x.graveyardMeta?.id !== graveId)
        })

        setInterval(this.checkUsers, 1000)
    },
    data() {
        return {
            users: {} as { [key: string]: UserData },
            switchSpeed: 'switchMedium'
        }
    },
    methods: {
        initializeIfUndefined(user: string) {
            if (!isDefined(this.users[user])) {
                this.users[user] = {
                    party: [],
                    badges: [],
                    deaths: [],
                    lastUpdate: new Date(),
                    timedOut: false,
                    color: string2ColHex(user)
                }
            }

            this.users[user].lastUpdate = new Date()
            this.users[user].timedOut = false
        },
        checkUsers() {
            for (const user in this.users) {
                const timeDiff = new Date().getTime() - this.users[user].lastUpdate.getTime()
                if (timeDiff >= 10000 && !this.users[user].timedOut) {
                    if (clientSettings.debug) {
                        console.debug(`${user} has been idle for 30 seconds`)
                    }
                    this.users[user].timedOut = true
                } else if (timeDiff >= 30000) {
                    if (clientSettings.debug) {
                        console.debug(`${user} has been removed for being idle for 120 seconds`)
                    }
                    delete this.users[user]
                }
            }
        }
    }
})