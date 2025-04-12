import {defineComponent, PropType} from 'vue'
import {V2} from 'pokelink'
import type {Pokemon} from 'v2Proto'

export default defineComponent({
    template: `
      <div class="pokemon__image" ref="container">
        <img
            v-if="!isGif && pokemon.isEgg && !fixedsprite"
            :src="sprite()"
            @load="trim"
            class="sprite"
            style="transform: scale(0.8); bottom: 0px; visibility: hidden"
            ref="spriteImg"
            @error="handleFallback"
        />
        <img
            v-if="!isGif && !pokemon.isEgg && !fixedsprite"
            :src="sprite()"
            class="sprite"
            @load="trim"
            style="visibility: hidden"
            ref="spriteImg"
            @error="handleFallback"
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
            :src="sprite()"
            :style="{'opacity': (fixedSprite || isGif ? '1' : '0')}"
            :key="'gif-' + sprite()"
            ref="spriteImg"
            @error="handleFallback"
        >
      </div>`,
    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        },
        getSprite: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            fixedSprite: false,
            defaultHeight: 2000,
            defaultWidth: 2000,
            oldImage: ''
        }
    },
    computed: {
        isGif() {
            return ((this.$refs.pokemonSprite as HTMLImageElement | undefined)?.src ?? this.sprite()).split('.').pop().toLowerCase() === 'gif'
        }
    },
    methods: {
        sprite() {
            return this.getSprite(this.pokemon)
        },
        handleFallback() {
            V2.useFallback(this.$refs.spriteImg as HTMLImageElement, this.pokemon)
        },
        trim() {
            if (this.oldImage === this.sprite()) {
                this.fixedSprite = true
                return true
            }
            this.oldImage = this.sprite()
            let vm = this
            const img = new Image()
            img.crossOrigin = 'Anonymous'
            img.onerror = () => {
                V2.useFallback(img, this.pokemon)
            }
            img.onload = () => {
                const canvas = vm.$refs.canvas as HTMLCanvasElement
                const ctx = canvas.getContext('2d', {
                    willReadFrequently: true
                })!
                canvas.width = vm.defaultWidth
                canvas.height = vm.defaultHeight
                ctx.clearRect(0, 0, vm.defaultWidth, vm.defaultHeight)
                ctx.drawImage(img, 0, 0)
                let trimmed = this.trimCanvas(canvas)
                canvas.width = trimmed.width
                canvas.height = trimmed.height
                const newImage = new Image()
                newImage.onload = () => {
                    ctx.drawImage(newImage, 0, 0)
                    vm.fixedSprite = true
                    vm.$emit('done')
                }
                newImage.src = trimmed.toDataURL()
            }
            img.src = this.sprite()
        },
        trimCanvas(c: HTMLCanvasElement) {
            const ctx = c.getContext('2d')!,
                copy = document.createElement('canvas').getContext('2d')!,
                pixels = ctx.getImageData(0, 0, c.width, c.height),
                l = pixels.data.length
            let i
            const bound: { [key: string]: number | null } = {
                top: null,
                left: null,
                right: null,
                bottom: null
            }
            let x, y

            // Iterate over every pixel to find the highest
            // and where it ends on every axis ()
            for (i = 0; i < l; i += 4) {
                if (pixels.data[i + 3] !== 0) {
                    x = (i / 4) % c.width
                    y = ~~((i / 4) / c.width)

                    if (bound.top === null) {
                        bound.top = y
                    }

                    if (bound.left === null) {
                        bound.left = x
                    } else if (x < bound.left) {
                        bound.left = x
                    }

                    if (bound.right === null) {
                        bound.right = x
                    } else if (bound.right < x) {
                        bound.right = x
                    }

                    if (bound.bottom === null) {
                        bound.bottom = y
                    } else if (bound.bottom < y) {
                        bound.bottom = y
                    }
                }
            }

            // Calculate the height and width of the content
            const trimHeight = bound.bottom! - bound.top!,
                trimWidth = bound.right! - bound.left!,
                trimmed = ctx.getImageData(bound.left!, bound.top!, trimWidth, trimHeight)

            copy.canvas.width = trimWidth
            copy.canvas.height = trimHeight
            copy.putImageData(trimmed, 0, 0)

            // Return trimmed canvas
            return copy.canvas
        }
    },
    watch: {
        pokemon: {
            deep: false,
            handler(newVal, oldVal) {
                const spriteHasChanged = this.oldImage !== V2.getSprite(newVal)
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