# Theme Data Structures

This document describes the data structures available to theme developers when creating PokeLink Web themes.

## Available Data Types

All data types are strongly typed through TypeScript and Protocol Buffers, ensuring type safety and preventing runtime errors.

### Pokemon Data Structure

The `Pokemon` interface is the primary data structure theme developers will work with:

```typescript
interface Pokemon {
  // Core identification
  pid: number                    // Unique Pokemon instance ID
  species: number               // National Pokedex number
  level: number                 // Current level (1-100)
  
  // Experience and progression  
  exp: number                   // Current experience points
  expToNextLevel: number        // Experience needed for next level
  expPercentage: number         // Progress to next level (0.0-1.0)
  
  // Health and status
  hp: HP                        // Health point structure
  status: StatusEffect          // Current status condition
  
  // Combat data
  moves: Move[]                 // Array of up to 4 moves
  ivs: EVIV                     // Individual Values
  evs: EVIV                     // Effort Values  
  baseStats: BaseStats          // Base stat values
  
  // Localization
  translations: PokemonTranslations  // Names in multiple languages
  
  // Visual and metadata
  color?: string                // Theme color (hex)
  fallbackSprite?: string       // Backup sprite URL
  fallbackPartySprite?: string  // Backup party sprite URL
  hasFemaleSprite: boolean      // Has gender-specific sprite
  
  // Optional attributes
  nickname?: string             // Custom nickname
  heldItem?: number            // Held item ID
  gender?: Gender              // Gender enum value
  form?: number                // Alternate form ID
  isEgg?: boolean              // Egg status
  hiddenPower?: number         // Hidden Power type ID
  nature?: number              // Nature ID
  isShiny?: boolean            // Shiny status
  pokeball?: number            // Capture ball type ID
  friendship?: number          // Friendship value (0-255)
  ability?: number             // Ability ID
  pokerus?: Pokerus            // Pokerus status
  locationMet?: number         // Location where caught
  levelMet?: number            // Level when caught
  graveyardMeta?: GraveMeta    // Death information (if applicable)
}
```

### Supporting Data Structures

#### HP (Health Points)
```typescript
interface HP {
  max: number      // Maximum HP value
  current: number  // Current HP value
}

// Usage example in themes
const healthPercent = (pokemon.hp.current / pokemon.hp.max) * 100
const isLowHealth = healthPercent <= 25
const isCriticalHealth = healthPercent <= 10
```

#### Move Structure
```typescript
interface Move {
  id: number                  // Move ID from game data
  pp: number                  // Current Power Points
  maxPP: number              // Maximum Power Points
  english: MoveTranslation   // English names and types
  locale: MoveTranslation    // Localized names and types
}

interface MoveTranslation {
  name: string               // Move name
  type: string              // Move type
  secondType?: string       // Secondary type (for moves like Flying Press)
}

// Usage example
pokemon.moves.forEach(move => {
  console.log(`${move.english.name} (${move.english.type}): ${move.pp}/${move.maxPP} PP`)
})
```

#### EVIV (Stats Container)
Used for both Individual Values (IVs) and Effort Values (EVs):

```typescript
interface EVIV {
  atk: number     // Attack
  def: number     // Defense  
  spatk: number   // Special Attack
  spdef: number   // Special Defense
  spd: number     // Speed
  hp: number      // HP
}

// Usage examples
const totalIVs = pokemon.ivs.atk + pokemon.ivs.def + pokemon.ivs.spatk + 
                 pokemon.ivs.spdef + pokemon.ivs.spd + pokemon.ivs.hp

const isCompetitiveIVs = totalIVs >= 186 // Perfect IVs = 186 (31*6)
```

#### BaseStats Structure
```typescript
interface BaseStats {
  atk: number     // Base Attack stat
  def: number     // Base Defense stat
  spatk: number   // Base Special Attack stat
  spdef: number   // Base Special Defense stat
  spd: number     // Base Speed stat
  hp: number      // Base HP stat
  bst: number     // Base Stat Total (sum of all base stats)
}

// Usage for Pokemon strength categorization
const isLegendary = pokemon.baseStats.bst >= 600
const isPseudoLegendary = pokemon.baseStats.bst >= 580 && pokemon.baseStats.bst < 600
```

### Translation System

#### PokemonTranslations
All text data is provided in both English and the user's locale:

```typescript
interface PokemonTranslations {
  english: TranslationsObject   // English translations
  locale: TranslationsObject    // User's language translations
}

interface TranslationsObject {
  speciesName: string           // Pokemon name (e.g., "Charizard")
  status: string               // Status condition name
  types: string[]              // Array of type names
  formName?: string            // Alternate form name (e.g., "Mega X")
  heldItemName?: string        // Held item name
  gender?: string              // Gender string
  hiddenPowerName?: string     // Hidden Power type name
  pokeballName?: string        // Pokeball name
  abilityName?: string         // Ability name
  pokerusStatus?: string       // Pokerus status description
  locationMetName?: string     // Location name
  natureName?: string          // Nature name
}
```

#### Usage in Templates
```vue
<template>
  <div class="pokemon-card">
    <!-- Use nickname if available, otherwise species name -->
    <h3>{{ pokemon.nickname || pokemon.translations.locale.speciesName }}</h3>
    
    <!-- Show types with proper localization -->
    <div class="types">
      <span v-for="type in pokemon.translations.english.types" 
            :key="type" 
            :class="'type-' + type.toLowerCase()">
        {{ pokemon.translations.locale.types[pokemon.translations.english.types.indexOf(type)] }}
      </span>
    </div>
    
    <!-- Status with localized text -->
    <div v-if="pokemon.status !== 'healthy'" class="status">
      {{ pokemon.translations.locale.status }}
    </div>
  </div>
</template>
```

### Enumerations

#### Gender
```typescript
enum Gender {
  male = 0,
  female = 1, 
  genderless = 2
}

// Usage in sprite selection
const spriteGenderSuffix = pokemon.gender === Gender.female && pokemon.hasFemaleSprite ? '-f' : ''
```

#### StatusEffect  
```typescript
enum StatusEffect {
  healthy = 0,
  poisoned = 1,
  asleep = 2, 
  paralyzed = 3,
  frozen = 4,
  burned = 5
}

// Usage for status styling
const statusClass = {
  [StatusEffect.poisoned]: 'status-poison',
  [StatusEffect.asleep]: 'status-sleep', 
  [StatusEffect.paralyzed]: 'status-paralysis',
  [StatusEffect.frozen]: 'status-freeze',
  [StatusEffect.burned]: 'status-burn'
}[pokemon.status] || ''
```

#### Pokerus
```typescript
enum Pokerus {
  clean = 0,    // No Pokerus
  infected = 1, // Currently infected (spreads to others)
  cured = 2     // Previously infected (immune, keeps benefits)
}
```

### Party Data Structure

The party is received as an array of Pokemon objects, with null entries for empty slots:

```typescript
type Party = (Pokemon | null)[]

// Typical usage in Vue themes
export default {
  data() {
    return {
      party: [] as (Pokemon | null)[]
    }
  },
  computed: {
    // Filter out empty slots
    activePokemon(): Pokemon[] {
      return this.party.filter(p => p !== null) as Pokemon[]
    },
    
    // Get specific slot (1-indexed for user display)
    getSlot() {
      return (slotNumber: number): Pokemon | null => {
        return this.party[slotNumber - 1] || null
      }
    },
    
    // Check if party is full
    isPartyFull(): boolean {
      return this.party.filter(p => p !== null).length === 6
    }
  }
}
```

### Badge Data Structure

```typescript
interface Badge {
  id: string                    // Unique badge identifier
  localeName: string           // Badge name in user's language
  englishName: string          // Badge name in English
  obtained: boolean            // Whether badge is earned
  sprite: string               // Badge image URL
  englishCategory?: string     // Category (English)
  localeCategory?: string      // Category (localized)  
  levelText?: string           // Level cap description
  levelCap?: number           // Numerical level cap
}

// Usage in badge display
const earnedBadges = badges.filter(badge => badge.obtained)
const nextBadge = badges.find(badge => !badge.obtained)
```

### Graveyard Data Structure

Fallen Pokemon retain all their original data plus death metadata:

```typescript
interface GraveMeta {
  timeOfDeath: Date    // When the Pokemon fainted
  id: string           // Unique identifier for the grave
}

// Graveyard is an array of Pokemon with graveyardMeta populated
type Graveyard = Pokemon[]

// Usage example
const recentDeaths = graveyard
  .filter(pokemon => pokemon.graveyardMeta)
  .sort((a, b) => b.graveyardMeta!.timeOfDeath.getTime() - a.graveyardMeta!.timeOfDeath.getTime())
  .slice(0, 5) // Show 5 most recent deaths
```

### Sprite and Asset URLs

PokeLink provides multiple sprite sources with fallback mechanisms:

```typescript
// Primary sprite URL (customizable via sprite templates)
const primarySprite = V2.getSprite(pokemon)

// Party sprite (smaller, optimized for party display)  
const partySprite = V2.getPartySprite(pokemon)

// Fallback sprites (always available)
const fallbackSprite = pokemon.fallbackSprite
const fallbackPartySprite = pokemon.fallbackPartySprite

// Held item sprite
const itemSprite = clientSettings.itemSpriteTemplate(pokemon)
```

### Utility Data Types

#### Nullable Type
Many values can be null or undefined:

```typescript
type Nullable<T> = T | null | undefined

// Utility function provided by PokeLink
function isDefined<T>(value: Nullable<T>): value is T {
  return value !== null && value !== undefined
}

// Usage
if (isDefined(pokemon.nickname)) {
  // TypeScript now knows pokemon.nickname is definitely a string
  displayName = pokemon.nickname.toUpperCase()
}
```

### Color and Theming Data

PokeLink provides color systems for consistent theming:

```typescript
// Type colors (official Pokemon type colors)
const typeColors: { [key: string]: string } = {
  'Fire': '#f08030',
  'Water': '#6890f0', 
  'Grass': '#78c850',
  'Electric': '#f8d030',
  // ... all 18 types
}

// Status condition colors
const statusColors: { [key: string]: string } = {
  'Poisoned': '#c060c0',
  'Paralyzed': '#b8b818',
  'Asleep': '#a0a088',
  'Frozen': '#88b0e0',
  'Burned': '#e07050',
  'Fainted': '#e85038'
}

// Usage in themes
const typeColor = V2.getTypeColor(pokemon.translations.english.types[0])
const statusColor = V2.getStatusColor(pokemon.translations.english.status)

// Pokemon-specific theme color (generated from species name)
const pokemonColor = pokemon.color || string2ColHex(pokemon.translations.english.speciesName)
```

### Real-time Data Updates

All data structures are reactive and updated in real-time:

```typescript
// Vue theme example
export default {
  mounted() {
    // Listen for party updates
    V2.onPartyUpdate((newParty: (Pokemon | null)[]) => {
      this.party = newParty
      // Vue automatically re-renders when party changes
    })
    
    // Listen for badge updates  
    V2.onBadgeUpdate((badges: Badge[]) => {
      this.badges = badges
    })
    
    // Listen for deaths (for graveyard themes)
    V2.onDeath((pokemon: Pokemon) => {
      this.graveyard.push(pokemon)
      // Play death animation, update counters, etc.
    })
  }
}
```

### Data Validation and Safety

All data is validated through Protocol Buffers and TypeScript:

- **Type Safety**: All fields are strongly typed
- **Required Fields**: Core fields like `pid`, `species`, `level` are always present  
- **Optional Fields**: Marked with `?` and can be safely checked with `isDefined()`
- **Enum Validation**: Status, gender, and pokerus values are validated against defined enums
- **Array Safety**: Move arrays, type arrays, etc. are guaranteed to be proper arrays

This comprehensive type system prevents common theme development errors and ensures reliable data access patterns.