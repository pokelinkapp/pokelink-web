import { createApp } from 'vue';
import { homeSpriteTemplate, Handlebars, clientSettings, spriteTestInitialize, isDefined, resolveIllegalCharacters } from 'pokelink';
(() => {
    spriteTestInitialize();
    createApp({
        template: `
          <div class="h-screen flex-col flex">
            <div>
              <div class="flex items-center mb-2 w-screen">
                <label for="templateText" class="mr-1">Sprite set Template Text</label>
                <input id="templateText"
                       :class="{'border border-red-500 text-red-500': templateError, 'text-black': !templateError, 'cursor-not-allowed': !hasFinished}"
                       type="text" :readonly="!hasFinished" v-model="templateText" class="flex bg-white text-sm rounded-lg p-2.5 w-2/3"/>
                <label class="inline-flex items-center cursor-pointer ml-2 mr-2">
                  <input type="checkbox" v-model="enableShiny" class="sr-only peer">
                  <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable Shiny Sprites</span>
                </label>
                <button v-if="!templateError" @click="getSpriteDex"
                        class="rounded p-3 shadow-lg bg-green-500 hover:bg-green-700 text-white dark:text-white hover:cursor-pointer">
                  Test Sprites
                </button>
                <button v-else
                        class="rounded p-3 shadow-lg  bg-gray-500 hover:bg-gray-500 cursor-not-allowed text-white dark:text-white">
                  Test Sprites
                </button>
              </div>
              <div class="flex items-center justify-center mb-10">
                <div :class="{'flex md:w-1/3': templateError || hasError}">
                  <div v-if="!templateError && !hasError">{{ exampleOutput() }}</div>
                  <textarea v-else
                            class="w-full h-[200px] min-h-[100px] monospace resize-none border-red-500 border text-red-500"
                            readonly>{{ error }}</textarea>
                </div>
              </div>
              <div class="flex flex-col items-start">
                <div class="text-2xl cursor-pointer" @click="show = null">Testing ({{ entries.length - results.filter(x => hasValue(x)).length }})</div>
                <div class="text-2xl cursor-pointer text-green-500" @click="show = 2">Success ({{ results.filter(x => x === 2).length }})</div>
                <div class="text-2xl cursor-pointer text-yellow-500" @click="show = 1">Fallback ({{ results.filter(x => x === 1).length }})</div>
                <div class="text-2xl cursor-pointer text-red-500" @click="show = 0">Failed ({{ results.filter(x => x === 0).length }})</div>
                <hr class="mb-3 w-full"/>
              </div>
            </div>
            <div id="entries" class="overflow-y-auto overflow-x-hidden flex-1">
              <div class="flex w-screen flex-wrap">
                <div v-for="(entry, idx) in entries">
                  <div class="flex-col text-center"
                       :class="{'text-red-500': results[idx] === 0, 'text-yellow-500': results[idx] === 1, 'text-green-500': results[idx] === 2}"
                       style="width: 200px; height: 200px" v-if="canShow(idx)">
                    <div class="flex justify-center">
                      <img :title="'Expected: ' + resolve(template(entry))"
                           :class="{'border-red-500': results[idx] === 0, 'border-yellow-500': results[idx] === 1, 'border-green-500': results[idx] === 2}"
                           class="border" style="height: 100px; width: 100px;" :src="hasValue(results[idx]) && results[idx] !== 2 ? entries[idx].fallbackSprite : resolve(template(entry))"
                           @load="() => handleSuccess(idx)" :key="idx" @error="() => handleError(idx, this)"/>
                    </div>
                    <div>{{ entry.translations.locale.speciesName }} / {{ entry.translations.english.speciesName }}</div>
                    <div>#{{ entry.species }}</div>
                    <div v-if="entry.hasFemaleSprite && entry.gender === 'female'">Female</div>
                    <div v-if="hasValue(entry.translations.english.formName)">{{ entry.translations.locale.formName }} /
                      {{ entry.translations.english.formName }}
                    </div>
                    <div v-if="hasValue(entry.translations.english.formName)">#{{ entry.form }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        data() {
            return {
                templateText: homeSpriteTemplate,
                template: Handlebars.compile(homeSpriteTemplate),
                hasError: false,
                templateError: false,
                error: null,
                examplePokemon: {
                    'pid': 3791076706,
                    'species': 6,
                    'level': 1,
                    'hp': {
                        'max': 1,
                        'current': 1
                    },
                    'ivs': {},
                    'evs': {},
                    'translations': {
                        'english': {
                            'speciesName': 'Charizard',
                            'status': 'Healthy',
                            'types': [
                                'Fire',
                                'Dragon'
                            ],
                            'formName': 'Mega X',
                            'pokerusStatus': 'No'
                        },
                        'locale': {
                            'speciesName': 'Charizard',
                            'status': 'Healthy',
                            'types': [
                                'Fire',
                                'Dragon'
                            ],
                            'formName': 'Mega X',
                            'pokerusStatus': 'No'
                        }
                    },
                    'color': 'Black',
                    'fallbackSprite': 'http://localhost:3000/assets:/assets/sprites/pokemon/home/normal/charizard-megax.png',
                    'fallbackPartySprite': 'http://localhost:3000/pokelink:/pkhex/img/sprites/a_6-1.png',
                    'heldItem': 0,
                    'gender': 'male',
                    'form': 1,
                    'isEgg': false,
                    'hiddenPower': 18,
                    'nature': 25,
                    'isShiny': false,
                    'pokeball': 0,
                    'friendship': 0,
                    'ability': 0,
                    'pokerus': 'clean',
                    'locationMet': 0
                },
                entries: [],
                results: [],
                enableShiny: true,
                show: null
            };
        },
        methods: {
            resolve(str) {
                return resolveIllegalCharacters(str);
            },
            async getSpriteDex() {
                this.show = null;
                this.entries = [];
                this.hasError = false;
                this.error = null;
                this.finished = false;
                let response;
                try {
                    response = await fetch(`http://${clientSettings.host}:${clientSettings.port}/api/pokelink/v1/listSpriteDex${this.enableShiny ? '?addShiny=true' : ''}`, { method: 'GET' });
                }
                catch (e) {
                    this.hasError = true;
                    this.error = `Unable to connect to http://${clientSettings.host}:${clientSettings.port}. Is a Pokelink session running?\n\nIf it is. Please make sure the host and port url parameters are correct`;
                    throw e;
                }
                try {
                    let result = await response.text();
                    let json = JSON.parse(result);
                    if (Array.isArray(json.entries)) {
                        this.entries = json.entries;
                        this.results = [];
                        if (clientSettings.debug) {
                            console.debug(`${this.entries.length} entries received`);
                        }
                    }
                    else {
                        this.hasError = true;
                        this.error = `Data received was not an array ${JSON.stringify(result)}`;
                    }
                }
                catch (e) {
                    this.hasError = true;
                    this.error = e.toString();
                    throw e;
                }
            },
            canShow(i) {
                switch (this.show) {
                    case null:
                        return true;
                    default:
                        return this.results[i] === this.show;
                }
            },
            handleSuccess(i) {
                if (this.hasValue(this.results[i])) {
                    return;
                }
                this.results[i] = 2;
            },
            handleError(i, img) {
                if (!this.hasFinished) {
                    this.show = 1;
                }
                if (this.hasValue(this.results[i])) {
                    this.results[i] = 0;
                    return;
                }
                this.results[i] = 1;
                img.src = this.entries[i].fallbackSprite;
            },
            hasValue(idx) {
                return isDefined(idx);
            },
            exampleOutput() {
                try {
                    const result = this.template(this.examplePokemon);
                    this.templateError = false;
                    return `Example output: ${result}`;
                }
                catch (e) {
                    this.templateError = true;
                    this.error = e.toString();
                    return '';
                }
            }
        },
        computed: {
            hasFinished() {
                return this.entries.length === this.results.length;
            },
            helpers() {
                const output = [];
                for (const key in Handlebars.helpers) {
                    output.push(key);
                }
                return output;
            }
        },
        watch: {
            templateText(newValue) {
                this.show = null;
                this.results = [];
                this.entries = [];
                try {
                    const newTemplate = Handlebars.compile(newValue);
                    this.templateError = false;
                    this.hasError = false;
                    this.error = null;
                    this.template = newTemplate;
                }
                catch (ex) {
                    this.hasError = true;
                    this.error = ex;
                }
            }
        }
    }).mount('#test');
})();
//# sourceMappingURL=test.js.map