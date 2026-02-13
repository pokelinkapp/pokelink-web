# Client API Reference

This document provides a complete reference for the PokeLink Web client API that theme developers use to interact with the PokeLink system.

## Core API Namespace: `V2`

The `V2` namespace contains all modern client functionality. Import it in your themes:

```typescript
import { V2, clientSettings, isDefined } from 'pokelink'
```

## Initialization

### `V2.initialize(settings?: V2Settings)`

Initializes the PokeLink client connection and starts listening for server events.

**Parameters:**
- `settings` (optional): Configuration object for client behavior

**V2Settings Interface:**
```typescript
interface V2Settings {
  numberOfPlayers?: number        // Number of players to track (-1 for all)
  listenForSpriteUpdates?: boolean // Whether to update sprite templates dynamically
}
```

**Default Values:**
- `numberOfPlayers`: 1
- `listenForSpriteUpdates`: true

**Example:**
```typescript
// Basic initialization
V2.initialize()

// Advanced initialization
V2.initialize({
  numberOfPlayers: 2,              // Track 2 players
  listenForSpriteUpdates: false    // Don't update sprites dynamically
})
```

## Event Listeners

### Party Events

#### `V2.onPartyUpdate(handler: (party: (Pokemon | null)[], username: string) => void)`

Registers a callback for party composition changes.

**Parameters:**
- `handler`: Function called when party updates
  - `party`: Array of 6 Pokemon objects (null for empty slots)
  - `username`: Username of the player whose party updated

**Example:**
```typescript
V2.onPartyUpdate((party, username) => {
  console.log(`${username}'s party updated:`)
  
  party.forEach((pokemon, index) => {
    if (pokemon) {
      console.log(`Slot ${index + 1}: ${pokemon.translations.english.speciesName}`)
    }
  })
  
  // Update Vue component
  this.party = party
})
```

### Badge Events

#### `V2.onBadgeUpdate(handler: (badges: Badge[], username: string) => void)`

Registers a callback for badge/achievement updates.

**Parameters:**
- `handler`: Function called when badges update
  - `badges`: Array of Badge objects
  - `username`: Username of the player

**Example:**
```typescript
V2.onBadgeUpdate((badges, username) => {
  const earned = badges.filter(b => b.obtained).length
  console.log(`${username} has ${earned}/${badges.length} badges`)
  
  this.badges = badges
})
```

### Death and Revival Events

#### `V2.onDeath(handler: (pokemon: Pokemon, username: string) => void)`

Registers a callback for Pokemon death events.

**Example:**
```typescript
V2.onDeath((pokemon, username) => {
  console.log(`💀 ${pokemon.translations.english.speciesName} fainted!`)
  
  // Add to graveyard with timestamp
  this.graveyard.push({
    ...pokemon,
    deathTime: new Date()
  })
  
  // Increment death counter
  this.totalDeaths++
})
```

#### `V2.onRevive(handler: (graveId: string, username: string) => void)`

Registers a callback for Pokemon revival events.

**Example:**
```typescript
V2.onRevive((graveId, username) => {
  console.log(`✨ Pokemon with ID ${graveId} was revived!`)
  
  // Remove from graveyard
  const index = this.graveyard.findIndex(p => p.graveyardMeta?.id === graveId)
  if (index !== -1) {
    this.graveyard.splice(index, 1)
  }
})
```

### Graveyard Events

#### `V2.onGraveyardUpdate(handler: (graves: Pokemon[], username: string) => void)`

Registers a callback for complete graveyard updates.

**Example:**
```typescript
V2.onGraveyardUpdate((graves, username) => {
  console.log(`Graveyard contains ${graves.length} fallen Pokemon`)
  
  // Sort by death time
  this.graveyard = graves.sort((a, b) => {
    const timeA = a.graveyardMeta?.timeOfDeath?.getTime() || 0
    const timeB = b.graveyardMeta?.timeOfDeath?.getTime() || 0
    return timeB - timeA
  })
})
```

### Connection Events

#### `V2.onConnect(handler: () => void)`

Registers a callback for successful server connections.

**Example:**
```typescript
V2.onConnect(() => {
  console.log('🔗 Connected to PokeLink server')
  this.connected = true
  this.showConnectionIndicator(true)
})
```

### Sprite Events

#### `V2.onSpriteTemplateUpdate(handler: () => void)`

Registers a callback for sprite template changes.

**Example:**
```typescript
V2.onSpriteTemplateUpdate(() => {
  console.log('🎨 Sprite template updated')
  // Force re-render of all Pokemon sprites
  this.$forceUpdate()
})
```

#### `V2.onSpriteSetReset(handler: () => void)`

Registers a callback for sprite template resets.

**Example:**
```typescript
V2.onSpriteSetReset(() => {
  console.log('🔄 Sprite template reset to default')
  this.$forceUpdate()
})
```

## Sprite Management

### `V2.getSprite(pokemon: Pokemon): string`

Gets the primary sprite URL for a Pokemon.

**Parameters:**
- `pokemon`: Pokemon object

**Returns:** String URL for the Pokemon sprite

**Example:**
```typescript
const spriteUrl = V2.getSprite(pokemon)

// Use in img tag
<img :src="V2.getSprite(pokemon)" :alt="pokemon.translations.english.speciesName" />
```

### `V2.getPartySprite(pokemon: Pokemon): string`

Gets the party-optimized sprite URL for a Pokemon (usually smaller/simpler).

**Example:**
```typescript
const partySprite = V2.getPartySprite(pokemon)

// Use for compact party display
<img :src="V2.getPartySprite(pokemon)" class="party-sprite" />
```

### `V2.useFallback(img: HTMLImageElement, pokemon: Pokemon)`

Switches an image element to the fallback sprite when the primary fails to load.

**Parameters:**
- `img`: HTML image element that failed to load
- `pokemon`: Pokemon object containing fallback URL

**Example:**
```typescript
// In Vue template
<img :src="V2.getSprite(pokemon)" 
     @error="V2.useFallback($event.target, pokemon)"
     :alt="pokemon.translations.english.speciesName" />

// Or in component method
methods: {
  handleSpriteError(event) {
    V2.useFallback(event.target, this.pokemon)
  }
}
```

### `V2.usePartyFallback(img: HTMLImageElement, pokemon: Pokemon)`

Similar to `useFallback` but for party sprites.

## Utility Functions

### `V2.isValidPokemon(pokemon: Pokemon | null): boolean`

Checks if a Pokemon object is valid and not null.

**Example:**
```typescript
const validPokemon = this.party.filter(V2.isValidPokemon)

// Or in template
<div v-for="pokemon in party" v-if="V2.isValidPokemon(pokemon)">
  <!-- Pokemon display -->
</div>
```

### `V2.getTypeColor(englishType: string): string`

Gets the official color for a Pokemon type.

**Parameters:**
- `englishType`: English name of the type (e.g., "Fire", "Water")

**Returns:** Hex color string

**Example:**
```typescript
const fireColor = V2.getTypeColor('Fire') // '#f08030'

// Use in styling
<span :style="{ backgroundColor: V2.getTypeColor(type) }">
  {{ type }}
</span>
```

### `V2.getStatusColor(englishStatus: string): string`

Gets the color for a status condition.

**Example:**
```typescript
const poisonColor = V2.getStatusColor('Poisoned') // '#c060c0'
```

### `V2.updateSpriteTemplate(template: string | null)`

Manually updates the sprite template (usually handled automatically).

**Parameters:**
- `template`: Handlebars template string or null to reset

## Client Settings

### `clientSettings` Object

Global configuration object available to themes:

```typescript
interface ClientSettings {
  debug: boolean                        // Debug mode enabled
  params: ParamsManager                 // URL parameter manager
  host: string                          // Server hostname
  port: number                          // Server port
  users: string[]                       // Tracked usernames
  useFallbackSprites: boolean          // Force use of fallback sprites
  spriteTemplate: HandlebarsTemplateDelegate    // Compiled sprite template
  itemSpriteTemplate: HandlebarsTemplateDelegate // Compiled item template
}
```

**Example Usage:**
```typescript
// Check if debug mode is enabled
if (clientSettings.debug) {
  console.log('Debug information:', data)
}

// Get sprite URL using template
const spriteUrl = clientSettings.spriteTemplate(pokemon)

// Get item sprite URL
const itemUrl = clientSettings.itemSpriteTemplate(pokemon)
```

### `ParamsManager` Methods

Access URL parameters in themes:

#### `clientSettings.params.hasKey(key: string): boolean`

Check if a URL parameter exists.

#### `clientSettings.params.getString(key: string, default?: string): string | undefined`

Get string parameter value.

#### `clientSettings.params.getBool(key: string, default: boolean = false): boolean`

Get boolean parameter value ('true'/'false' strings).

#### `clientSettings.params.getNumber(key: string, default: number = 1): number`

Get numeric parameter value.

**Example:**
```typescript
// URL: theme.html?user=Player1&slot=3&hp=true&debug=false

const username = clientSettings.params.getString('user', 'DefaultUser')  // 'Player1'
const slotNumber = clientSettings.params.getNumber('slot', 1)            // 3
const showHP = clientSettings.params.getBool('hp', false)               // true
const debugMode = clientSettings.params.getBool('debug', false)         // false

// Use in theme logic
if (clientSettings.params.hasKey('slot')) {
  // Show only specific slot
  this.singleSlotMode = true
  this.targetSlot = slotNumber
}
```

## Utility Exports

### `isDefined<T>(value: T | null | undefined): value is T`

Type-safe check for defined values.

**Example:**
```typescript
if (isDefined(pokemon.nickname)) {
  // TypeScript knows pokemon.nickname is definitely a string here
  displayName = pokemon.nickname.toUpperCase()
}
```

### `string2ColHex(input: string): string`

Generate consistent hex color from string.

**Example:**
```typescript
const pokemonColor = string2ColHex(pokemon.translations.english.speciesName)
// Same Pokemon species always generates the same color
```

### `hex2rgba(hex: string, opacity: number): string`

Convert hex color to RGBA with opacity.

**Example:**
```typescript
const semiTransparentRed = hex2rgba('#ff0000', 50) // 'rgba(255,0,0,0.5)'
```

### `resolveIllegalCharacters(input: string): string`

Clean string for use in URLs (removes illegal characters).

**Example:**
```typescript
const cleanName = resolveIllegalCharacters("Pokémon?!")  // "Pokémon"
```

## Data Type Exports

### `V2DataTypes`

All Protocol Buffer types for advanced usage:

```typescript
import { V2DataTypes } from 'pokelink'

// Access specific types
const pokemon: V2DataTypes.Pokemon = /* ... */
const badge: V2DataTypes.Badge = /* ... */
const gender: V2DataTypes.Gender = V2DataTypes.Gender.male
```

### `Nullable<T>`

Type alias for values that can be null or undefined:

```typescript
type Nullable<T> = T | null | undefined

// Usage
const maybeString: Nullable<string> = pokemon.nickname
```

## Color Constants

### `typeColors`

Object mapping Pokemon types to their official colors:

```typescript
const typeColors = {
  'Fire': '#f08030',
  'Water': '#6890f0',
  'Grass': '#78c850',
  // ... all 18 types
}
```

### `statusColors`

Object mapping status conditions to colors:

```typescript
const statusColors = {
  'Poisoned': '#c060c0',
  'Paralyzed': '#b8b818',
  'Asleep': '#a0a088',
  'Frozen': '#88b0e0',
  'Burned': '#e07050',
  'Fainted': '#e85038'
}
```

### `htmlColors`

Complete mapping of HTML color names to hex values.

## Handlebars Integration

### Custom Helpers

PokeLink registers custom Handlebars helpers for sprite templates:

- `isDefined(value)`: Check if value is defined
- `ifElse(condition, ifTrue, ifFalse)`: Ternary operator
- `concat(str1, str2)`: String concatenation
- `toLower(str)`: Convert to lowercase
- `noSpaces(str)`: Remove all spaces
- `underscoreSpaces(str)`: Replace spaces with underscores
- `remove(str, filter)`: Remove substring
- `nidoranGender(str, maleTag, femaleTag)`: Handle Nidoran gender variants
- `addFemaleTag(pokemon, tag)`: Add tag for female Pokemon
- `isZero(value)`: Check if number is zero

**Example Template:**
```handlebars
https://example.com/sprites/{{toLower (noSpaces translations.english.speciesName)}}{{addFemaleTag this "-f"}}{{ifElse isShiny "-shiny" ""}}.png
```

## Error Handling

### Connection Errors

```typescript
// Listen for disconnections
client.events.once('disconnected', () => {
  console.log('Connection lost, attempting reconnection...')
  this.connected = false
})

// Handle parsing errors
client.events.on('parseError', (error, rawData) => {
  console.error('Failed to parse server data:', error)
})
```

### Sprite Loading Errors

```typescript
// Automatic fallback handling
<img :src="V2.getSprite(pokemon)" 
     @error="V2.useFallback($event.target, pokemon)"
     :alt="pokemon.translations.english.speciesName" />

// Manual error handling
methods: {
  handleImageError(event, pokemon) {
    console.log(`Sprite failed to load for ${pokemon.translations.english.speciesName}`)
    V2.useFallback(event.target, pokemon)
  }
}
```

This API provides everything needed to create robust, interactive PokeLink themes with real-time data updates and comprehensive error handling.