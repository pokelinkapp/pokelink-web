import { defineComponent } from 'vue';
import { V3 } from 'pokelink';
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
            return V3.getSprite(this.pokemon);
        },
        useFallback() {
            V3.useFallback(this.$refs.pokeImg, this.pokemon);
        }
    }
});
//# sourceMappingURL=pokeImg.vue.js.map