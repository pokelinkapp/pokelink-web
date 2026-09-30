import {createApp} from 'vue'
import {clientSettings, ComponentConfig, goalsId, isDefined, trainerTrackerId, V3, V3DataTypes} from 'pokelink'

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
            components[trainerTrackerId] = [
                'levelCap'
            ]

            V3.initialize(components)
            
            V3.onTrainerTrackerUpdate(() => {})

            V3.onConnect(() => {
                vm.connected = true
            })
        }
    }).mount('#trainers')
})()