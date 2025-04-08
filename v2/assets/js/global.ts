import Handlebars from 'handlebars'
import ColorHash from 'color-hash'

export type Nullable<T> = T | undefined | null

export function isDefined(value: Nullable<any>) {
    return value !== undefined && value !== null
}

Handlebars.registerHelper('isDefined', function (value) {
    return isDefined(value)
})

Handlebars.registerHelper('ifElse', function (input: boolean, ifTrue: string, ifFalse: string) {
    return input ? ifTrue : ifFalse
})

Handlebars.registerHelper('concat', function (string1: string, string2: string) {
    return string1 + string2
})

Handlebars.registerHelper('toLower', function (str: string) {
    return str?.toLowerCase()
})

Handlebars.registerHelper('noSpaces', function (str: string) {
    return str?.replace(' ', '')
})

Handlebars.registerHelper('nidoranGender', function (str: string, maleTag?: string, femaleTag?: string) {
    if (str?.toLowerCase().startsWith('nidoran') === true) {
        let text = str.substring(0, 7)
        let check = str.substring(0, 10)

        if ((check.indexOf('♀') !== -1|| check.toLowerCase().endsWith('-f')) && isDefined(femaleTag)) {
            text += femaleTag
        }

        if ((check.indexOf('♂') !== -1 || check.toLowerCase().endsWith('-m')) && isDefined(maleTag)) {
            text += maleTag
        }

        return text
    }

    return str
})

export class EventEmitter {
    private events: { [key: string]: Array<(...parameters: any[]) => void> } = {}

    public hasEvents(event: string) {
        if (this.events[event] === undefined || this.events[event] === null) {
            return false
        }

        return this.events[event].length > 0
    }

    public on(event: string, listener: (...parameters: any[]) => void) {
        if (typeof (this.events[event]) !== 'object') {
            this.events[event] = []
        }

        this.events[event].push(listener)
        return this
    }

    public removeListener(event: string, listener: (...parameters: any[]) => void) {
        let idx

        if (typeof this.events[event] === 'object') {
            idx = indexOf(this.events[event], listener)

            if (idx > -1) {
                this.events[event].splice(idx, 1)
            }
        }
    }

    public emit(event: string, ...parameters: any[]) {
        let i, listeners, length, args = [].slice.call(parameters)

        if (typeof this.events[event] === 'object') {
            listeners = this.events[event].slice()
            length = listeners.length

            for (i = 0; i < length; i++) {
                listeners[i].apply(this, args)
            }
        }
    }

    public once(event: string, listener: (...parameters: any[]) => void) {
        let eventHandler = this
        eventHandler.on(event, function g() {
            eventHandler.removeListener(event, g)
            listener.apply(eventHandler, [].slice.call(arguments, 1))
        })
    }
}

export function isNumeric(str: string) {
    return !isNaN(str as unknown as number) && !isNaN(parseFloat(str))
}

export class ParamsManager {
    private params: URLSearchParams

    constructor() {
        this.params = new URLSearchParams(window.location.search)
    }

    public hasKey(key: string) {
        return this.params.has(key)
    }

    public getString(key: string, _default?: string): string | undefined {
        if (!this.hasKey(key)) {
            return _default
        }

        return this.params.get(key)!
    }

    public getBool(key: string, _default: boolean = false) {
        if (!this.hasKey(key)) {
            return _default
        }

        return this.params.get(key)!.toLowerCase() === 'true'
    }

    public getNumber(key: string, _default: number = 1): number {
        if (!this.hasKey(key)) {
            return _default
        }

        let value = this.params.get(key)!

        if (!isNumeric(value)) {
            return _default
        }

        return Number(value)
    }
}

export interface ClientSettings {
    debug: boolean,
    params: ParamsManager,
    host: string,
    port: number,
    users: string[],
    useFallbackSprites: boolean,
    spriteTemplate: HandlebarsTemplateDelegate
}

export let indexOf: (haystack: Array<any>, needle: any) => number

if (typeof Array.prototype.indexOf === 'function') {
    indexOf = function (haystack, needle) {
        return haystack.indexOf(needle)
    }
} else {
    indexOf = function (haystack, needle) {
        let i = 0, length = haystack.length, idx = -1, found = false

        while (i < length && !found) {
            if (haystack[i] === needle) {
                idx = i
                found = true
            }

            i++
        }

        return idx
    }
}

const colorHash = new ColorHash({lightness: 0.5})

export function string2ColHex(input: string) {
    return colorHash.hex(input)
}

export const typeColors: { [key: string]: string } = {
    'Bug': '#a8b820', 'Dark': '#c02020', 'Dragon': '#7038f8',
    'Electric': '#f8d030', 'Fairy': '#ee99ac', 'Fighting': '#c03028',
    'Fire': '#f08030', 'Flying': '#a890f0', 'Ghost': '#705898',
    'Grass': '#78c850', 'Ground': '#e0c068', 'Ice': '#98d8d8',
    'Normal': '#a8a878', 'Poison': '#a040a0', 'Psychic': '#f85888',
    'Rock': '#b8a038', 'Steel': '#b8b8d0', '???': '#68a090', 'Water': '#6890f0'
}

export const statusColors: { [key: string]: string } = {
    'Poisoned': '#c060c0', 'Paralyzed': '#b8b818', 'Asleep': '#a0a088',
    'Frozen': '#88b0e0', 'Burned': '#e07050',
    'Fainted': '#e85038'
}

export const htmlColors: { [key: string]: string } = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred ': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgrey': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370d8',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#d87093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#663399',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
}