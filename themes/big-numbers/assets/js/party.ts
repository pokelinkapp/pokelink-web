import {createApp} from 'vue'
import {
    V3, clientSettings, isDefined, ComponentConfig, settingsId, settingsSubcomponents, partyId,
    pokemonSubcomponents
} from 'pokelink'
import list from './components/list.vue.js'

export function pokemonTCGCardSets() {
    let userDefinedSets = clientSettings.params.getString('sets', '')

    if (isDefined(userDefinedSets) && userDefinedSets!.length > 0) {
        return userDefinedSets!.split('|')
    }

    return [
        'base1',
        'base2',
        'basep',
        'ex3',
        'pop5',
        'pop1',
        'pop3',
        'xyp',
        'col1',
        'dp1',
        'dp2',
        'dp3',
        'dp4',
        'swsh1',
        'swsh2',
        'ex15',
        'ex12',
        'dp6',
        'pl2',
        'bw11',
        'bw10',
        'bw9',
        'bw8',
        'bw7',
        'bw6',
        'bw5',
        'bw4',
        'bw4',
        'bw3',
        'bw2',
        'bw1',
        'xy1',
        'xy2',
        'xy3',
        'xy4',
        'xy5',
        'xy6',
        'xy7',
        'xy8'
    ]
}

(() => {
    createApp({
        components: {
            'list': list
        },
        data() {
            return {
                connected: false,
                loaded: false,
                settings: {}
            }
        },
        created: function () {
            const vm = this

            this.resetSpriteSet()

            V3.onSpriteSetReset(this.resetSpriteSet)
            
            const components: ComponentConfig = {}
            components[settingsId] = [
                settingsSubcomponents.spriteTemplate
            ]
            components[partyId] = [
                pokemonSubcomponents.misc,
                pokemonSubcomponents.exp,
                pokemonSubcomponents.stats,
                pokemonSubcomponents.hp,
                pokemonSubcomponents.status,
                pokemonSubcomponents.shadow
            ]

            V3.initialize(components)

            V3.onConnect(() => {
                vm.connected = true
                this.loaded = true
            })
            this.settings = clientSettings
        },
        mounted: function () {
        },
        methods: {
            resetSpriteSet() {
                V3.updateSpriteTemplate('https://assets.pokelink.xyz/v2/sprites/pokemon/heartgold-soulsilver/' +
                    '{{ifElse isShiny "shiny" "normal"}}' +
                    '/{{toLower (noSpaces (nidoranGender translations.english.species "" "-f"))}}' +
                    '{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}' +
                    '{{addFemaleTag this "-f"}}.png')
            }
        }
    }).mount('#party')
})()