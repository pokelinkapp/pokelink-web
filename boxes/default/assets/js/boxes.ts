import {createApp} from 'vue'
import {
    clientSettings,
    ComponentConfig,
    settingsId,
    settingsSubcomponents,
    pcBoxId,
    V3,
    PCBox, isDefined, Nullable
} from 'pokelink'

(() => {
    createApp({
        template: `
            <div v-if="connected">
                <div v-if="isDefined(box?.name)">
                    <div class="font-bold text-5xl">{{ box.name }}</div>
                </div>
                <div v-if="isDefined(box?.stored)">
                    <div class="font-bold text-5xl">
                        Storing: {{ box.stored }} / {{ box.storage.length }}
                    </div>
                </div>
                <div :class="'grid w-96 gap-0 grid-cols-' + box.columns" v-if="isDefined(box?.storage)">
                    <div v-for="pokemon in box.storage" class="h-16 w-16 border-solid border-2">
                        <img :src="getSprite(pokemon)" @error="V3.usePartyFallback(this, pokemon)"
                             v-if="isDefined(pokemon)"/>
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
                box: null as Nullable<PCBox>,
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
            components[settingsId] = [
                settingsSubcomponents.spriteTemplate
            ]
            components[pcBoxId] = {
                box: 0,
                pokemon: []
            }
            
            let box = 0

            V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/pkhex/party/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}.png')

            V3.onSpriteSetReset(() => {
                V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/pkhex/party/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}{{ifElse (isDefined translations.english.form) (concat "-" (toLower (noSpaces translations.english.form))) ""}}.png')
            })

            V3.initialize(components)

            V3.onPCBoxUpdate((pcBox, username) => {
                vm.box = pcBox
            })

            V3.onConnect(() => {
                vm.connected = true
                console.log('Connected')
                box = 0
            })

            setInterval(() => {
                box++
                if (box >= 14) {
                    box = 0
                }
                components[pcBoxId] = {
                    box: box,
                    pokemon: []
                }
                V3.updateComponentsConfig(components)
            }, 1000)
        },
        methods: {
            isDefined: isDefined,
            pokelinkHostToUrl: V3.pokelinkHostToUrl,
            getSprite: V3.getPartySprite
        }
    }).mount('#boxes')
})()