import {createApp} from 'vue'
import {
    clientSettings, ComponentConfig, goalsId, isDefined, trainerTrackerId,
    trainerTrackerSubcomponents, V3, V3DataTypes
} from 'pokelink'

(() => {
    createApp({
        data() {
            return {
                connected: false,
                loaded: false,
                trainers: [] as V3DataTypes.Goal[],
                settings: {
                    port: 0,
                }
            }
        },
        create() {

        },
        mounted() {
            const vm = this

            this.settings.port = clientSettings.port

            const components: ComponentConfig = {}
            components[trainerTrackerId] = {
                max: 5,
                list: 'bosses', // valid values: bosses, gyms. Anything else will list all trainers
                levelCap: null,
                trainersDefeated: null,
                trainerCount: null,
                trainers: null
            }

            V3.initialize(components)
            
            V3.onTrainerTrackerUpdate(() => {})

            V3.onConnect(() => {
                vm.connected = true
            })
        }
    }).mount('#trainers')
})()