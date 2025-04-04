import {defineComponent} from 'vue'

export default defineComponent({
    template: `
      <div class="pokemon__image" ref="container">
        <img ref="pokemonSprite" style="visibility: hidden" :src="this.sprite" @error="this.$refs.pokemonSprite.src = this.pokemon.fallbackSprite"/>
        <img
            v-if="!isGif && pokemon.isEgg && !fixedSprite"
            :src="pokemon.img"
            @load="trim"
            class="sprite"
            style="transform: scale(0.8); bottom: 0px; visibility: hidden"
        />
        <img
            v-if="!isGif && !pokemon.isEgg && !fixedSprite"
            :src="pokemon.img"
            class="sprite"
            @load="trim"
            style="visibility: hidden"
        />
        <canvas
            v-if="!isGif"
            ref="canvas"
            width="2000"
            height="2000"
            :class="{sprite: fixedSprite}"
            :style="{'opacity': (fixedSprite ? '1' : '0')}"
        ></canvas>
        <img
            v-if="isGif"
            :class="['sprite', {'sprite--gif': isGif}]"
            :src="pokemon.img"
            :style="{'opacity': (fixedSprite || isGif ? '1' : '0')}"
            :key="'gif-' + pokemon.img"
        >
      </div>`,
    props: {
        pokemon: {
            required: true
        },
        getSprite: {
            type: Function,
            required: true
        }
    },
    data () {
        return {
            fixedSprite: false,
            defaultHeight: 2000,
            defaultWidth: 2000
        }
    },
    computed: {
        isGif () {
            return this.$refs.pokemonSprite?.src.split('.').pop().toLowerCase() ?? this.sprite === 'gif'
        },
        sprite() {
            return this.getSprite(this.pokemon)
        }
    },
    methods: {
        trim () {
            if (this.oldImage === this.sprite) return false
            this.oldImage = this.sprite
            let vm = this
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                var canvas = vm.$refs.canvas;
                var ctx = canvas.getContext('2d');
                canvas.width = vm.defaultWidth
                canvas.height = vm.defaultHeight
                ctx.clearRect(0, 0, vm.defaultWidth, vm.defaultHeight)
                ctx.drawImage(img, 0, 0);
                let trimmed = trimCanvas(canvas)
                canvas.width = trimmed.width
                canvas.height = trimmed.height
                var newImage = new Image()
                newImage.onload = () => {
                    ctx.drawImage(newImage, 0, 0);
                    vm.fixedSprite = true
                    vm.$emit('done')
                }
                newImage.src = trimmed.toDataURL()
            }
            img.src = this.sprite
        }
    },
    watch: {
        pokemon: {
            deep: true,
            handler (newVal, oldVal) {
                const spriteHasChanged = this.oldImage !== newVal.img
                if (spriteHasChanged) {
                    this.fixedSprite = false
                }
                if (spriteHasChanged && this.isGif) {
                    this.fixedSprite = true
                    this.oldImage = newVal.img
                }
            }
        }
    }
})