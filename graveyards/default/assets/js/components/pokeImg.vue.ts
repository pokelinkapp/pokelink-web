import {defineComponent, PropType} from 'vue'
import {V3, Pokemon} from 'pokelink'


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
            return V3.getSprite(this.pokemon)
        },
        useFallback() {
            V3.useFallback(this.$refs.pokeImg as HTMLImageElement, this.pokemon)
        }
    }
})