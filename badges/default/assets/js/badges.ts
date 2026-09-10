import {createApp} from 'vue'
import {clientSettings, ComponentConfig, goalsId, isDefined, V3, V3DataTypes} from 'pokelink'

(() => {
    createApp({
        data() {
            return {
                connected: false,
                loaded: false,
                badges: [] as V3DataTypes.Goal[],
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

            this.settings.port = clientSettings.port
            this.settings.showCategories = clientSettings.params.getBool('showCategories', false)
            this.settings.numberOnly = clientSettings.params.getBool('numbersOnly', false)

            const components: ComponentConfig = {}
            components[goalsId] = [
                'sprite',
                'name'
            ]

            if (this.settings.numberOnly) {
                components[goalsId] = null
            } else if (this.settings.showCategories) {
                components[goalsId].push('category')
            }

            V3.initialize(null, components)

            V3.registerComponentListener<V3DataTypes.GoalsMessage>(goalsId, (component) => {
                this.settings.showCategories = clientSettings.params.getBool('showCategories', false)
                if (this.settings.showCategories) {
                    let categories: string[] = []

                    for (let badge of component.goals) {
                        if (!isDefined(badge.translations?.locale?.category)) {
                            continue
                        }
                        if (categories.indexOf(badge.translations!.locale!.category!) === -1) {
                            categories.push(badge.translations!.locale!.category!)
                        }
                    }

                    this.categories = categories

                    if (categories.length === 0) {
                        this.settings.showCategories = false
                    }
                }
                
                for (let goal of component.goals) {
                    if (isDefined(goal.sprite)) {
                        goal.sprite = V3.pokelinkHostToUrl(goal.sprite!)
                    }
                }

                vm.badges = component.goals
                if (clientSettings.debug) {
                    console.debug(vm.badges)
                }
                vm.loaded = true
                vm.$forceUpdate()
            })

            // V2.onBadgeUpdate((badges => {
            //     this.settings.showCategories = clientSettings.params.getBool('showCategories', false)
            //     if (this.settings.showCategories) {
            //         let categories: string[] = []
            //
            //         for (let badge of badges) {
            //             if (!isDefined(badge.localeCategory)) {
            //                 continue;
            //             }
            //             if (categories.indexOf(badge.localeCategory!) === -1) {
            //                 categories.push(badge.localeCategory!)
            //             }
            //         }
            //
            //         this.categories = categories
            //
            //         if (categories.length === 0) {
            //             this.settings.showCategories = false
            //         }
            //     }
            //
            //     this.badges = badges
            //     this.loaded = true
            //     vm.$forceUpdate()
            // }))

            V3.onConnect(() => {
                vm.connected = true
            })
        }
    }).mount('#badges')
})()