import { createApp } from 'vue';
import { clientSettings, settingsId, settingsSubcomponents, trainerTrackerId, V3, isDefined } from 'pokelink';
(() => {
    createApp({
        template: `
            <div v-if="connected">
                <div v-if="isDefined(trainerTracker?.levelCap)">
                    <div class="font-bold text-5xl">Lv Cap {{ trainerTracker.levelCap }}</div>
                </div>
                <div v-if="isDefined(trainerTracker?.trainersDefeated) && isDefined(trainerTracker?.trainerCount)">
                    <div class="font-bold text-5xl">
                        Defeated: {{ trainerTracker.trainersDefeated }} / {{ trainerTracker.trainerCount }}
                    </div>
                </div>
                <div v-if="isDefined(trainerTracker?.trainers) && trainerTracker.trainers.length > 0">
                    <div class="flex flex-col w-full h-screen">
                        <div class="flex flex-row w-full h-full" v-for="trainer in trainerTracker.trainers">
                            <div class="w-1/7 flex flex-row h-full items-center justify-center">
                                <div>
                                    <img :src="trainer.trainerSprite" width="128" height="128"/>
                                </div>
                                <div>
                                    <p>
                                        {{ trainer.translations.locale.trainerClass }}
                                    </p>
                                    <p>
                                        {{ trainer.translations.locale.name }}
                                    </p>
                                    <p>
                                        Highest: Lv {{ trainer.highestLevel }}
                                    </p>
                                </div>
                            </div>
                            <div class="w-6/8 flex flex-col">
                                <div class="flex flex-row" v-for="party in trainer.parties.parties">
                                    <div class="w-1/6 flex flex-col" v-for="pokemon in party.pokemon">
                                        <img :src="getSprite(pokemon)" width="64" height="64"/>
                                        <div>{{ pokemon.translations.locale.species }} Lv {{ pokemon.level }}</div>
                                        <div>{{ pokemon.translations.locale.types.join('/') }}</div>
                                        <div
                                            v-if="trainerTracker.hasAbilities && isDefined(pokemon.translations.locale.ability)">
                                            {{ pokemon.translations.locale.ability }}
                                        </div>
                                        <div
                                            v-if="trainerTracker.hasItems && isDefined(pokemon.translations.locale.item)">
                                            {{ pokemon.translations.locale.item }}
                                        </div>
                                        <div v-for="move in pokemon.translations.locale.moves">
                                            {{ move }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="no-connection" v-if="!connected">
                <p>Waiting for successful connection to Pokélink...</p>
                <p>Attempting to connect on port {{ settings.port }}</p>
            </div>
        `,
        data() {
            return {
                connected: false,
                loaded: false,
                trainerTracker: null,
                settings: {
                    port: 0,
                }
            };
        },
        create() {
        },
        mounted() {
            const vm = this;
            this.settings.port = clientSettings.port;
            const components = {};
            components[settingsId] = [
                settingsSubcomponents.spriteTemplate
            ];
            components[trainerTrackerId] = {
                max: 5,
                list: 'bosses', // valid values: bosses, gyms. Anything else will list all trainers
                levelCap: null,
                trainersDefeated: null,
                trainerCount: null,
                trainers: null
            };
            V3.initialize(components);
            V3.onTrainerTrackerUpdate((trainerTracker, username) => {
                if (isDefined(vm.trainerTracker?.trainers)) {
                    if (vm.trainerTracker.trainers.length !== 0) {
                        return;
                    }
                }
                vm.trainerTracker = trainerTracker;
                vm.$forceUpdate();
            });
            V3.onConnect(() => {
                vm.connected = true;
            });
        },
        methods: {
            isDefined: isDefined,
            pokelinkHostToUrl: V3.pokelinkHostToUrl,
            getSprite: V3.getSprite
        }
    }).mount('#trainers');
})();
//# sourceMappingURL=trainers.js.map