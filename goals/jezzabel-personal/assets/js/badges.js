import { createApp } from 'vue';
import { clientSettings, isDefined, trainerTrackerId, typeColors, V3 } from 'pokelink';
// Leader art the same way the default trainers page shows it: the tracker's trainer sprite, host resolved
function leaderArt(trainerSprite) {
    return V3.pokelinkHostToUrl(trainerSprite) ?? null;
}
// Every styleable element, each read from url params named <element><Property>, e.g. panelBorder or levelBackground
const styledElements = ['container', 'panel', 'leader', 'badge', 'level'];
const styleParams = {
    Border: 'border',
    Background: 'background',
    BackgroundSize: 'background-size',
    BackgroundPosition: 'background-position',
    Padding: 'padding',
    Margin: 'margin',
    Radius: 'border-radius',
    Shadow: 'box-shadow'
};
// Bare numbers become pixels so `panelPadding=10` or `panelRadius=12` work without units
const pixelProperties = ['padding', 'margin', 'border-radius', 'border'];
function styleValue(property, value) {
    if (pixelProperties.indexOf(property) !== -1 && /^-?\d+(\.\d+)?$/.test(value)) {
        return `${value}px`;
    }
    // A plain image url (no css function around it) is wrapped so it can be used as a background directly
    if (property === 'background' && !value.includes('(') && /^(https?:|data:|\.{0,2}\/)|\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value)) {
        return `url("${value}") center / cover no-repeat`;
    }
    return value;
}
function readElementStyle(element) {
    const style = {};
    for (const suffix of Object.keys(styleParams)) {
        const value = clientSettings.params.getString(element + suffix, '')?.trim() ?? '';
        if (value.length > 0) {
            style[styleParams[suffix]] = styleValue(styleParams[suffix], value);
        }
    }
    return style;
}
// Fixed badge types from the original badges-new page, used until the tracker has shown that gym's party
const badgeTypes = {
    boulder: 'Rock', cascade: 'Water', thunder: 'Electric', rainbow: 'Grass',
    soul: 'Poison', marsh: 'Psychic', volcano: 'Fire', earth: 'Ground',
    zephyr: 'Flying', hive: 'Bug', plain: 'Normal', fog: 'Ghost',
    storm: 'Fighting', mineral: 'Steel', glacier: 'Ice', rising: 'Dragon',
    trio: 'Bug', basic: 'Normal', insect: 'Bug', bolt: 'Electric',
    quake: 'Ground', jet: 'Flying', freeze: 'Ice', legend: 'Dragon',
    stone: 'Rock', knuckle: 'Fighting', dynamo: 'Electric', heat: 'Fire',
    balance: 'Normal', feather: 'Flying', mind: 'Psychic', rain: 'Water'
};
// Badge name from its sprite file, e.g. …/badges/unova/trio.png -> trio
function badgeName(badgeSprite) {
    if (!isDefined(badgeSprite) || badgeSprite === '') {
        return null;
    }
    const path = badgeSprite.split(/[?#]/)[0].toLowerCase();
    return path.substring(path.lastIndexOf('/') + 1).replace(/\.[a-z]+$/, '');
}
function fallbackType(badgeSprite) {
    return badgeTypes[badgeName(badgeSprite) ?? ''] ?? null;
}
// Counts every type across the trainer's parties; ties go to the types of the highest levelled pokemon
function mostUsedType(trainer) {
    const counts = {};
    let ace = null;
    for (const party of trainer.parties?.parties ?? []) {
        for (const pokemon of party.pokemon ?? []) {
            for (const type of pokemon.translations?.english?.types ?? []) {
                counts[type] = (counts[type] ?? 0) + 1;
            }
            if (!isDefined(ace) || (pokemon.level ?? 0) > (ace.level ?? 0)) {
                ace = pokemon;
            }
        }
    }
    const max = Math.max(0, ...Object.values(counts));
    if (max === 0) {
        return null;
    }
    const tied = Object.keys(counts).filter(type => counts[type] === max);
    const aceTypes = ace?.translations?.english?.types ?? [];
    return tied.find(type => aceTypes.indexOf(type) !== -1) ?? tied[0];
}
function filterLeaders(trainers, list) {
    return trainers.filter(trainer => list === 'bosses' ? trainer.isBoss : trainer.isGymLeader);
}
(() => {
    createApp({
        template: `
            <div class="badges container" v-if="connected" :style="styles.container">
                <div
                    v-for="slot in slots"
                    :key="slot.id"
                    class="panel"
                    :class="{ 'badge__slot': true, 'badge__slot--inactive': !slot.obtained, 'panel--inactive': !slot.obtained, ['panel--' + gymType(slot)]: true }"
                    :style="panelStyle(slot)"
                >
                    <img v-if="leaderImage(slot)" :src="leaderImage(slot)" :alt="slot.leader" class="leader"
                         :style="styles.leader" @error="brokenImages[slot.leaderArt] = true">
                    <img v-else-if="slot.sprite" class="badge-img" :src="slot.sprite" :alt="slot.leader" :style="styles.badge">
                    <span class="levelCap" v-if="slot.levelCap" :style="styles.level">{{ '' + slot.levelCap }}</span>
                </div>
            </div>
            <div class="no-connection" v-if="!connected">
                <p>Waiting for successful connection to Pokélink...</p>
                <p>Attempting to connect on port {{ settings.port }}</p>
            </div>
        `,
        data() {
            return {
                connected: false,
                trainers: [],
                // Pokélink's current cap, the same trainerTracker.levelCap the default trainers page shows
                trackerLevelCap: null,
                trainersDefeated: null,
                trainerCount: null,
                brokenImages: {},
                styles: {},
                settings: {
                    port: 0,
                    list: 'gyms'
                }
            };
        },
        computed: {
            slots() {
                const leaders = filterLeaders(this.trainers, this.settings.list);
                // The tracker only counts defeats, so they map onto the list when it holds every trainer it counts.
                // Otherwise the tracker is listing what's left, and every listed leader is still to beat
                const defeated = this.trainerCount === leaders.length ? (this.trainersDefeated ?? 0) : 0;
                return leaders.map((trainer, index) => {
                    const badgeSprite = V3.pokelinkHostToUrl(trainer.badgeSprite) ?? null;
                    return {
                        id: `${index}|${badgeName(badgeSprite) ?? trainer.translations?.locale?.name ?? ''}`,
                        type: mostUsedType(trainer) ?? fallbackType(badgeSprite),
                        leader: trainer.translations?.locale?.name ?? null,
                        sprite: badgeSprite,
                        obtained: index < defeated,
                        leaderArt: leaderArt(trainer.trainerSprite),
                        // Caps come from the tracker like the default trainers page: Pokélink's current levelCap for
                        // the next leader, then each leader's highestLevel
                        levelCap: (index === defeated ? this.trackerLevelCap : null) || trainer.highestLevel || null
                    };
                });
            }
        },
        methods: {
            // The tracker's leader art, unless it failed to load (the badge shows instead)
            leaderImage(slot) {
                return isDefined(slot.leaderArt) && !this.brokenImages[slot.leaderArt] ? slot.leaderArt : null;
            },
            gymType(slot) {
                return slot.type?.toLowerCase() ?? 'unknown';
            },
            panelStyle(slot) {
                const style = { '--panel-max-size': this.slots.length };
                if (isDefined(slot.type) && isDefined(typeColors[slot.type])) {
                    style['background-color'] = typeColors[slot.type];
                    // Lets a custom background reuse the gym colour, e.g. linear-gradient(var(--type-color), #000)
                    style['--type-color'] = typeColors[slot.type];
                }
                const custom = this.styles.panel ?? {};
                if (isDefined(custom['background'])) {
                    delete style['background-color'];
                }
                return { ...style, ...custom };
            },
        },
        mounted() {
            const vm = this;
            this.settings.port = clientSettings.port;
            this.settings.list = clientSettings.params.getString('list', 'gyms') ?? 'gyms';
            for (const element of styledElements) {
                this.styles[element] = readElementStyle(element);
            }
            // Same tracker request as the default trainers page
            const components = {};
            components[trainerTrackerId] = {
                max: 20,
                list: this.settings.list,
                levelCap: null,
                trainersDefeated: null,
                trainerCount: null,
                trainers: null
            };
            V3.initialize(components);
            V3.onTrainerTrackerUpdate((trainerTracker) => {
                vm.trackerLevelCap = trainerTracker.levelCap ?? null;
                vm.trainersDefeated = trainerTracker.trainersDefeated ?? null;
                vm.trainerCount = trainerTracker.trainerCount ?? null;
                vm.trainers = trainerTracker.trainers;
                if (clientSettings.debug) {
                    console.debug('Trainers', vm.slots);
                }
            });
            V3.onConnect(() => {
                vm.connected = true;
            });
        }
    }).mount('#badges');
})();
//# sourceMappingURL=badges.js.map