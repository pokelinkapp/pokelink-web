import {createApp} from 'vue'
import {clientSettings, isDefined, V2, V2DataTypes} from 'pokelink'

(() => {
    createApp({
        data() {
            return {
                connected: false,
                loaded: false,
                badges: [] as V2DataTypes.Badge[],
                settings: {
                    port: 0,
                    showCategories: false,
                    numberOnly: false
                },
                categories: [] as string[]
            }
        },
        create() {

        },
        mounted() {
            const vm = this

            V2.initialize()

            this.settings.port = clientSettings.port
            this.settings.showCategories = clientSettings.params.getBool('showCategories', false)
            this.settings.numberOnly = clientSettings.params.getBool('numbersOnly', false)

            V2.onBadgeUpdate((badges => {
                this.settings.showCategories = clientSettings.params.getBool('showCategories', false)
                if (this.settings.showCategories) {
                    let categories: string[] = []

                    for (let badge of badges) {
                        if (!isDefined(badge.localeCategory)) {
                            continue;
                        }
                        if (categories.indexOf(badge.localeCategory!) === -1) {
                            categories.push(badge.localeCategory!)
                        }
                    }

                    this.categories = categories

                    if (categories.length === 0) {
                        this.settings.showCategories = false
                    }
                }

                this.badges = badges
                this.loaded = true
                vm.$forceUpdate()
            }))

            V2.onConnect(() => {
                vm.connected = true
            })
        }
    }).mount('#badges')
})()