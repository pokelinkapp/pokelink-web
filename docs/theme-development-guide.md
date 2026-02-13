# Theme Development Guide

This guide walks you through creating custom themes for PokeLink Web, from basic setup to advanced techniques.

## Getting Started

### Prerequisites

Before developing themes, ensure you have:

- **Node.js** (14+) and **Yarn** installed
- **PokeLink server** running locally
- **Code editor** with TypeScript support (VS Code recommended)
- **Browser** for testing (Chrome/Firefox recommended)

### Development Environment Setup

1. **Clone and Setup PokeLink Web:**
```bash
git clone https://github.com/pokelinkapp/pokelink-web.git
cd pokelink-web/v2

# Initial setup (recommended - uses Makefile)
make setup

# Or use yarn directly
yarn install
```

2. **Build the Core Libraries:**
```bash
# Using Makefile (recommended)
make build-core

# Or use yarn directly
yarn build:core
```

3. **Start Development:**
```bash
# Development mode with watch (recommended - uses Makefile)
make dev

# Or watch for changes and rebuild automatically
yarn build --watch
```

> 💡 **Tip**: The Makefile provides colored output, better error handling, and more intuitive commands. See the [Build System Documentation](build-system.md) for complete details.

### Project Structure for Themes

```
v2/themes/
├── _shared/                 # Shared components across themes
│   └── components/
├── your-theme-name/        # Your custom theme
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css  # Theme-specific styling
│   │   └── js/
│   │       ├── components/ # Vue components (optional)
│   │       └── party.ts   # Main theme script
│   └── index.html         # Theme entry point
```

## Creating Your First Theme

### Step 1: Create Theme Directory

```bash
mkdir v2/themes/my-first-theme
cd v2/themes/my-first-theme
mkdir -p assets/{css,js}
```

### Step 2: Create HTML Entry Point

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First PokeLink Theme</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <div id="party" v-show="loaded">
        <div v-if="!connected" class="no-connection">
            Disconnected
        </div>

        <div class="pokemon-container">
            <div v-for="(pokemon, index) in pokemonToShow"
                 :key="pokemon?.pid || index"
                 class="pokemon-slot">

                <div v-if="pokemon" class="pokemon-card">
                    <!-- Pokemon sprite -->
                    <img :src="getSprite(pokemon)"
                         @error="useFallback($event.target, pokemon)"
                         :alt="pokemon.translations.english.speciesName"
                         class="sprite" />

                    <!-- Pokemon name -->
                    <h3>{{ pokemon.nickname || pokemon.translations.english.speciesName }}</h3>

                    <!-- Level -->
                    <div class="level">Lv. {{ pokemon.level }}</div>

                    <!-- HP Bar -->
                    <div class="hp-container" v-if="showHP">
                        <div class="hp-bar">
                            <div class="hp-fill"
                                 :style="{ width: getHPPercent(pokemon) + '%' }"
                                 :class="getHPClass(pokemon)">
                            </div>
                        </div>
                        <div class="hp-text">
                            {{ pokemon.hp.current }} / {{ pokemon.hp.max }}
                        </div>
                    </div>

                    <!-- Types -->
                    <div class="types">
                        <span v-for="type in pokemon.translations.english.types"
                              :key="type"
                              class="type"
                              :style="{ backgroundColor: getTypeColor(type) }">
                            {{ type }}
                        </span>
                    </div>
                </div>

                <!-- Empty slot -->
                <div v-else class="empty-slot">
                    <div class="pokeball-empty"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Load PokeLink core libraries -->
    <script src="../../assets/dist/client.js"></script>
    <script src="../../assets/dist/global.js"></script>
    <script src="../../assets/dist/pokelink.js"></script>
    <script src="assets/js/party.js"></script>
</body>
</html>
```

### Step 3: Create Theme Logic

Create `assets/js/party.ts`:

```typescript
import { createApp } from 'vue'
import { V2, clientSettings, isDefined } from 'pokelink'
import type { Nullable } from 'global'
import type { Pokemon } from 'v2Proto'

(() => {
    createApp({
        data() {
            return {
                connected: false,
                loaded: false,
                party: [] as (Pokemon | null)[],
                showHP: true
            }
        },

        mounted() {
            // Initialize PokeLink connection
            V2.initialize({
                numberOfPlayers: 1,
                listenForSpriteUpdates: true
            })

            // Get URL parameters
            this.showHP = clientSettings.params.getBool('hp', true)

            // Listen for party updates
            V2.onPartyUpdate((party: (Pokemon | null)[]) => {
                this.party = party
                this.loaded = true
                this.$forceUpdate()
            })

            // Listen for connection events
            V2.onConnect(() => {
                this.connected = true
            })
        },

        computed: {
            pokemonToShow(): (Pokemon | null)[] {
                // Show single slot if specified
                if (clientSettings.params.hasKey('slot')) {
                    const slotIndex = clientSettings.params.getNumber('slot', 1) - 1
                    return [this.party[slotIndex] || null]
                }

                // Show all party slots
                return this.party
            }
        },

        methods: {
            getSprite(pokemon: Pokemon): string {
                return V2.getSprite(pokemon)
            },

            useFallback(img: HTMLImageElement, pokemon: Pokemon): void {
                V2.useFallback(img, pokemon)
            },

            getHPPercent(pokemon: Pokemon): number {
                if (!pokemon.hp || pokemon.hp.max === 0) return 0
                return (pokemon.hp.current / pokemon.hp.max) * 100
            },

            getHPClass(pokemon: Pokemon): string {
                const percent = this.getHPPercent(pokemon)
                if (percent <= 15) return 'critical'
                if (percent <= 50) return 'low'
                return 'healthy'
            },

            getTypeColor(type: string): string {
                return V2.getTypeColor(type)
            }
        }
    }).mount('#party')
})()
```

### Step 4: Create Basic Styling

Create `assets/css/styles.css`:

```css
/* Reset and base styles */
html, body {
    margin: 0;
    padding: 0;
    background: transparent;
    font-family: 'Arial', sans-serif;
    color: white;
}

/* Connection indicator */
.no-connection {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    font-size: 24px;
    z-index: 1000;
}

/* Pokemon container */
.pokemon-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
}

/* Pokemon card */
.pokemon-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    backdrop-filter: blur(5px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    min-width: 200px;
    transition: transform 0.3s ease;
}

.pokemon-card:hover {
    transform: translateY(-5px);
}

/* Pokemon sprite */
.sprite {
    max-width: 150px;
    max-height: 150px;
    image-rendering: pixelated; /* For pixel art sprites */
}

/* Pokemon name */
.pokemon-card h3 {
    margin: 15px 0 10px 0;
    font-size: 18px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* Level display */
.level {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #ffd700;
}

/* HP Bar */
.hp-container {
    margin: 15px 0;
}

.hp-bar {
    width: 100%;
    height: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #333;
}

.hp-fill {
    height: 100%;
    transition: width 1s ease, background-color 0.3s ease;
    border-radius: 8px;
}

.hp-fill.healthy {
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
}

.hp-fill.low {
    background: linear-gradient(90deg, #FF9800, #FFC107);
}

.hp-fill.critical {
    background: linear-gradient(90deg, #F44336, #FF5722);
}

.hp-text {
    font-size: 14px;
    margin-top: 5px;
}

/* Type badges */
.types {
    display: flex;
    gap: 5px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 10px;
}

.type {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Empty slot */
.empty-slot {
    width: 200px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.1);
}

.pokeball-empty {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #ddd, #999);
    position: relative;
    opacity: 0.3;
}

.pokeball-empty::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #333;
    transform: translateY(-1px);
}

.pokeball-empty::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #333;
    transform: translate(-50%, -50%);
}

/* Responsive design */
@media (max-width: 768px) {
    .pokemon-container {
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }

    .pokemon-card {
        width: 100%;
        max-width: 300px;
    }
}
```

### Step 5: Build and Test

1. **Build the theme:**
```bash
# Using Makefile (recommended)
make build-themes

# Or use yarn directly
yarn build:themes
```

2. **Test the theme:**
```bash
# Open in browser with your PokeLink username
file:///path/to/pokelink-web/v2/themes/my-first-theme/index.html?user=YourUsername
```

> 📝 **Development Workflow**: Use `make dev` to automatically rebuild your theme as you make changes, then refresh your browser to see updates instantly.

## Advanced Theme Development

### Custom Vue Components

Create reusable components for complex themes:

Create `assets/js/components/pokemon-card.vue.ts`:

```typescript
import { defineComponent, PropType } from 'vue'
import { V2 } from 'pokelink'
import { Pokemon } from 'v2Proto'

export default defineComponent({
    template: `
        <div class="advanced-pokemon-card" :class="cardClasses">
            <div class="card-header">
                <img :src="V2.getSprite(pokemon)"
                     @error="handleSpriteError"
                     class="pokemon-sprite" />
                <div class="shiny-indicator" v-if="pokemon.isShiny">✨</div>
            </div>

            <div class="card-body">
                <h3 class="pokemon-name">
                    {{ pokemon.nickname || pokemon.translations.english.speciesName }}
                </h3>

                <div class="pokemon-level">Lv. {{ pokemon.level }}</div>

                <div class="pokemon-types">
                    <type-badge v-for="type in pokemon.translations.english.types"
                               :key="type"
                               :type="type" />
                </div>

                <health-bar :pokemon="pokemon" v-if="showHealth" />

                <div class="pokemon-stats" v-if="showStats">
                    <stat-display label="ATK" :value="pokemon.baseStats.atk" />
                    <stat-display label="DEF" :value="pokemon.baseStats.def" />
                    <stat-display label="SPA" :value="pokemon.baseStats.spatk" />
                    <stat-display label="SPD" :value="pokemon.baseStats.spdef" />
                    <stat-display label="SPE" :value="pokemon.baseStats.spd" />
                </div>
            </div>
        </div>
    `,

    props: {
        pokemon: {
            type: Object as PropType<Pokemon>,
            required: true
        },
        showHealth: {
            type: Boolean,
            default: true
        },
        showStats: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        cardClasses(): string[] {
            const classes = []

            if (this.pokemon.isShiny) classes.push('shiny')
            if (this.pokemon.status !== 0) classes.push('status-affected')
            if (this.pokemon.isEgg) classes.push('egg')

            return classes
        }
    },

    methods: {
        handleSpriteError(event: Event) {
            V2.useFallback(event.target as HTMLImageElement, this.pokemon)
        }
    }
})
```

### Multi-User Support

Handle multiple players in a single theme:

```typescript
export default createApp({
    data() {
        return {
            players: new Map<string, (Pokemon | null)[]>(),
            connected: false
        }
    },

    mounted() {
        V2.initialize({
            numberOfPlayers: -1  // Track all players
        })

        V2.onPartyUpdate((party, username) => {
            this.players.set(username, party)
            this.$forceUpdate()
        })
    },

    computed: {
        displayedPlayers(): Array<{username: string, party: (Pokemon | null)[]}> {
            const targetUsers = clientSettings.params.getString('users', '').split(',')

            return Array.from(this.players.entries())
                .filter(([username]) => targetUsers.includes(username))
                .map(([username, party]) => ({ username, party }))
        }
    }
})
```

### Animation System

Add smooth animations for state changes:

```typescript
// In your theme's Vue app
methods: {
    onPartyUpdate(newParty: (Pokemon | null)[]) {
        // Detect changes
        const changes = this.detectPartyChanges(this.party, newParty)

        // Animate changes
        changes.forEach(change => {
            switch (change.type) {
                case 'pokemon_added':
                    this.animatePokemonAppear(change.slotIndex)
                    break
                case 'pokemon_removed':
                    this.animatePokemonDisappear(change.slotIndex)
                    break
                case 'level_up':
                    this.animateLevelUp(change.slotIndex, change.newLevel)
                    break
                case 'hp_changed':
                    this.animateHPChange(change.slotIndex, change.oldHP, change.newHP)
                    break
            }
        })

        // Update party data
        this.party = newParty
    },

    animatePokemonAppear(slotIndex: number) {
        this.$nextTick(() => {
            const element = this.$refs[`slot-${slotIndex}`] as HTMLElement
            element.style.opacity = '0'
            element.style.transform = 'scale(0.5)'

            element.offsetHeight // Force reflow

            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
            element.style.opacity = '1'
            element.style.transform = 'scale(1)'
        })
    },

    animateLevelUp(slotIndex: number, newLevel: number) {
        // Create level up animation
        const element = this.$refs[`level-${slotIndex}`] as HTMLElement
        element.classList.add('level-up-animation')

        setTimeout(() => {
            element.classList.remove('level-up-animation')
        }, 1000)
    }
}
```

### Custom Sprite Templates

Create dynamic sprite loading with Handlebars:

```typescript
// Custom sprite template for your theme
const customSpriteTemplate = `
https://my-sprite-server.com/pokemon/
{{#if isShiny}}shiny/{{/if}}
{{species}}
{{#if (isDefined form)}}
    {{#if (not (isZero form))}}-form{{form}}{{/if}}
{{/if}}
{{addFemaleTag this "-female"}}
.png
`

// Apply template
V2.updateSpriteTemplate(customSpriteTemplate.replace(/\s+/g, ''))
```

### Error Handling and Fallbacks

Implement robust error handling:

```typescript
export default createApp({
    data() {
        return {
            errors: [],
            retryCount: 0,
            maxRetries: 3
        }
    },

    methods: {
        handleConnectionError() {
            this.retryCount++

            if (this.retryCount <= this.maxRetries) {
                setTimeout(() => {
                    V2.initialize()
                }, 1000 * this.retryCount)
            } else {
                this.errors.push({
                    type: 'connection',
                    message: 'Failed to connect after multiple attempts'
                })
            }
        },

        handleSpriteError(event: Event, pokemon: Pokemon) {
            const img = event.target as HTMLImageElement

            // Try fallback sprite
            if (img.src !== pokemon.fallbackSprite) {
                V2.useFallback(img, pokemon)
                return
            }

            // Use placeholder if fallback also fails
            img.src = 'assets/images/placeholder-pokemon.png'

            this.errors.push({
                type: 'sprite',
                message: `Failed to load sprite for ${pokemon.translations.english.speciesName}`,
                pokemon: pokemon
            })
        }
    }
})
```

## Performance Optimization

### Efficient Rendering

```typescript
// Use v-show instead of v-if for frequently toggled elements
<div v-show="pokemon" class="pokemon-card">

// Memoize expensive computations
computed: {
    sortedParty(): Pokemon[] {
        return this.party
            .filter(p => p !== null)
            .sort((a, b) => a.level - b.level)
    },

    partyStats(): {totalLevel: number, averageLevel: number} {
        const alive = this.sortedParty
        const totalLevel = alive.reduce((sum, p) => sum + p.level, 0)

        return {
            totalLevel,
            averageLevel: alive.length > 0 ? totalLevel / alive.length : 0
        }
    }
}

// Use object freeze for static data
mounted() {
    this.typeColors = Object.freeze({
        'Fire': '#f08030',
        'Water': '#6890f0',
        // ... other types
    })
}
```

### Memory Management

```typescript
// Clean up resources
beforeUnmount() {
    // Remove event listeners if manually added
    window.removeEventListener('resize', this.handleResize)

    // Clear intervals/timeouts
    if (this.animationInterval) {
        clearInterval(this.animationInterval)
    }

    // Clear large data structures
    this.spriteCache.clear()
}
```

## Testing Your Theme

### Development Testing

1. **Use mock data:**
```typescript
if (clientSettings.params.getBool('mock', false)) {
    this.party = mockPartyData
    this.loaded = true
}
```

2. **Test different scenarios:**
- Empty party
- Full party
- Mixed levels
- Different Pokemon types
- Shiny Pokemon
- Status conditions
- Connection loss

### URL Parameter Testing

Test various URL configurations:

```bash
# Single slot display
?user=TestUser&slot=1

# Show HP bars
?user=TestUser&hp=true

# Debug mode
?user=TestUser&debug=true

# Multiple users
?users=Player1,Player2

# Custom sprite template
?template=https://example.com/sprites/{{species}}.png
```

## Deployment and Distribution

### Building for Production

```bash
# Build optimized version (recommended - uses Makefile)
make build-prod

# Or build with yarn
yarn build

# Test built version
# Open index.html and verify all scripts load correctly
```

> 🚀 **Production Tip**: `make build-prod` sets NODE_ENV=production for optimized builds. Use `make clean` before production builds to ensure a clean state.

### Theme Submission

To share your theme with the community:

1. **Create documentation:**
   - Theme description
   - Screenshot/preview
   - Supported features
   - URL parameters

2. **Test thoroughly:**
   - Multiple browsers
   - Different screen sizes
   - Various Pokemon combinations

3. **Submit pull request:**
   - Add to `themes.json`
   - Include preview image
   - Follow naming conventions

This guide provides the foundation for creating custom PokeLink themes. Experiment with different layouts, animations, and features to create unique streaming experiences!