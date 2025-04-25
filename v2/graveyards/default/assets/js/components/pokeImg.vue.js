import { defineComponent } from 'vue';
import { V2 } from 'pokelink';
export default defineComponent({
    template: `
        <img ref="pokeImg" @error="useFallback" :src="getSprite()"/>
    `,
    props: {
        pokemon: {
            type: Object,
            required: true
        }
    },
    methods: {
        getSprite() {
            return V2.getSprite(this.pokemon);
        },
        useFallback() {
            V2.useFallback(this.$refs.pokeImg, this.pokemon);
        }
    }
});
//# sourceMappingURL=pokeImg.vue.js.map