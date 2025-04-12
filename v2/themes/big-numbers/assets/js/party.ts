import {createApp} from 'vue'
import {V2, clientSettings, isDefined} from 'pokelink'
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
            V2.initialize({listenForSpriteUpdates: false})

            V2.updateSpriteTemplate('https://assets.pokelink.xyz/assets/sprites/pokemon/heartgold-soulsilver/' +
                '{{ifElse isShiny "shiny" "normal"}}' +
                '/{{toLower (noSpaces (nidoranGender translations.english.speciesName "" "-f"))}}' +
                '{{ifElse (isDefined translations.english.formName) (concat "-" (toLower (noSpaces translations.english.formName))) ""}}' +
                '{{addFemaleTag this "-f"}}.png')

            V2.onConnect(() => {
                vm.connected = true
                this.loaded = true
            })
            this.settings = clientSettings
        },
        mounted: function () {
        }
    }).mount('#party')
})()