import {defineComponent, PropType} from 'vue'
import type {Pokemon} from 'v2Proto'
import {V2} from 'pokelink'


export default defineComponent({
    template: `
        <img ref="pokeImg" @error="useFallback" :src="getSprite()"/>
    `,
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        }
    },
    methods: {
        getSprite() {
            return V2.getSprite(this.pokemon)
        },
        useFallback() {
            V2.useFallback(this.$refs.pokeImg as HTMLImageElement, this.pokemon)
        }
    }
})