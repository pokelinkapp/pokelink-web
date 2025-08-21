# Data Reception and Event Handling

This document explains how themes receive and handle real-time data updates from the PokeLink server.

## Overview

PokeLink Web uses an event-driven architecture where the client establishes a WebSocket connection to receive real-time updates. Data flows through the following pipeline:

```
PokeLink Server → WebSocket → Protocol Buffer Decoder → Event Emitter → Vue Components → DOM Updates
```

## Connection Management

### Automatic Connection Handling

The PokeLink client automatically manages connections with built-in reconnection logic:

```typescript
// Connection is established automatically when initializing
V2.initialize({
  numberOfPlayers: 1,              // How many players to track
  listenForSpriteUpdates: true     // Whether to update sprites dynamically
})

// Listen for connection events
V2.onConnect(() => {
  console.log('Connected to PokeLink server')
  // Show connection indicator, enable UI, etc.
})

// Disconnection is handled automatically with reconnection attempts
client.events.once('disconnected', () => {
  console.log('Disconnected from server, attempting reconnection...')
  // Show disconnection overlay, disable animations, etc.
})
```

### Connection States

Themes should handle different connection states:

```typescript
export default {
  data() {
    return {
      connected: false,
      loaded: false,    // Has received initial data
      party: []
    }
  },
  
  mounted() {
    V2.onConnect(() => {
      this.connected = true
    })
    
    // First party update indicates data is loaded
    V2.onPartyUpdate((party) => {
      this.party = party
      this.loaded = true
    })
  }
}
```

## Event Channels

### Core Event Types

PokeLink emits several types of events that themes can listen to:

#### 1. Party Updates (`client:party:updated`)
Fired when Pokemon party composition or stats change:

```typescript
V2.onPartyUpdate((party: (Pokemon | null)[], username: string) => {
  console.log(`Party update for ${username}:`)
  
  party.forEach((pokemon, index) => {
    if (pokemon) {
      console.log(`Slot ${index + 1}: ${pokemon.translations.english.speciesName} (Level ${pokemon.level})`)
      console.log(`  HP: ${pokemon.hp.current}/${pokemon.hp.max}`)
      console.log(`  Status: ${pokemon.translations.english.status}`)
    } else {
      console.log(`Slot ${index + 1}: Empty`)
    }
  })
  
  // Update theme state
  this.party = party
})
```

#### 2. Badge Updates (`client:badges:updated`) 
Fired when gym badges or achievements are earned:

```typescript
V2.onBadgeUpdate((badges: Badge[], username: string) => {
  console.log(`Badge update for ${username}:`)
  
  const earnedBadges = badges.filter(badge => badge.obtained)
  console.log(`Badges earned: ${earnedBadges.length}/${badges.length}`)
  
  // Update badge display
  this.badges = badges
  
  // Play animation for newly earned badges
  const newBadges = badges.filter(badge => 
    badge.obtained && !this.previousBadges.some(prev => prev.id === badge.id && prev.obtained)
  )
  
  newBadges.forEach(badge => {
    this.playBadgeEarnedAnimation(badge)
  })
})
```

#### 3. Death Events (`client:party:death`)
Fired when a Pokemon faints:

```typescript
V2.onDeath((pokemon: Pokemon, username: string) => {
  console.log(`${pokemon.translations.english.speciesName} fainted!`)
  
  // Add to graveyard
  this.graveyard.push(pokemon)
  
  // Play death animation
  this.playDeathAnimation(pokemon)
  
  // Update death counter
  this.deathCount++
  
  // Show memorial notification
  this.showMemorialNotification(pokemon)
})
```

#### 4. Revive Events (`client:party:revive`)
Fired when a Pokemon is revived from the graveyard:

```typescript
V2.onRevive((graveId: string, username: string) => {
  console.log(`Pokemon with grave ID ${graveId} was revived`)
  
  // Find and remove from graveyard
  const revivedIndex = this.graveyard.findIndex(pokemon => 
    pokemon.graveyardMeta?.id === graveId
  )
  
  if (revivedIndex !== -1) {
    const revivedPokemon = this.graveyard.splice(revivedIndex, 1)[0]
    this.playReviveAnimation(revivedPokemon)
  }
})
```

#### 5. Graveyard Updates (`client:graveyard:updated`)
Fired when the complete graveyard contents change:

```typescript
V2.onGraveyardUpdate((graves: Pokemon[], username: string) => {
  console.log(`Graveyard update: ${graves.length} fallen Pokemon`)
  
  // Update graveyard display
  this.graveyard = graves
  
  // Sort by death time (most recent first)
  this.graveyard.sort((a, b) => {
    const timeA = a.graveyardMeta?.timeOfDeath?.getTime() || 0
    const timeB = b.graveyardMeta?.timeOfDeath?.getTime() || 0
    return timeB - timeA
  })
})
```

### Advanced Event Handling

#### Event Filtering by Username

For multi-user environments, filter events by username:

```typescript
const targetUsers = ['Player1', 'Player2'] // From URL parameters

V2.onPartyUpdate((party, username) => {
  if (!targetUsers.includes(username)) {
    return // Ignore updates for other users
  }
  
  // Process update for tracked user
  this.updatePartyForUser(username, party)
})
```

#### Debounced Updates

For performance, debounce rapid updates:

```typescript
import { debounce } from 'lodash'

const debouncedPartyUpdate = debounce((party) => {
  this.party = party
  this.$forceUpdate()
}, 100) // Update at most once per 100ms

V2.onPartyUpdate((party) => {
  debouncedPartyUpdate(party)
})
```

#### Event Chaining

Handle related events together:

```typescript
// Track recent deaths for memorial display
const recentDeaths = []

V2.onDeath((pokemon) => {
  recentDeaths.push({
    pokemon,
    timestamp: Date.now()
  })
  
  // Remove deaths older than 5 minutes
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
  recentDeaths.splice(0, recentDeaths.findIndex(death => death.timestamp > fiveMinutesAgo))
})

V2.onPartyUpdate((party) => {
  // Check if any previously alive Pokemon are now missing (indicating death)
  const currentAlive = party.filter(p => p !== null).map(p => p.pid)
  const previousAlive = this.previousParty.filter(p => p !== null).map(p => p.pid)
  
  const newlyMissing = previousAlive.filter(pid => !currentAlive.includes(pid))
  // Handle newly missing Pokemon...
})
```

## Data Transformation Pipeline

### Protocol Buffer Decoding

Data flows through several transformation layers:

```typescript
// 1. Raw Protocol Buffer bytes received via WebSocket
const rawBuffer: Uint8Array = /* received from server */

// 2. Decoded to typed message objects
const partyMessage = fromBinary(PartySchema, rawBuffer)

// 3. Transformed to theme-friendly format
const party: (Pokemon | null)[] = partyMessage.party.map(slot => slot.pokemon)

// 4. Emitted as typed events
events.emit('client:party:updated', party, partyMessage.username)

// 5. Handled by theme event listeners
V2.onPartyUpdate((party, username) => {
  // Theme receives clean, typed data
})
```

### Data Validation

All received data is automatically validated:

```typescript
// Type validation through TypeScript
V2.onPartyUpdate((party: (Pokemon | null)[], username: string) => {
  party.forEach((pokemon, index) => {
    if (pokemon) {
      // TypeScript guarantees these fields exist and are the correct type
      const species: number = pokemon.species        // Always a number
      const level: number = pokemon.level           // Always a number  
      const hp: HP = pokemon.hp                     // Always has max/current
      
      // Optional fields are properly typed
      const nickname: string | undefined = pokemon.nickname
      const isShiny: boolean | undefined = pokemon.isShiny
      
      // Use type guards for safety
      if (pokemon.nickname) {
        console.log(`Nickname: ${pokemon.nickname}`) // TypeScript knows it's defined
      }
    }
  })
})
```

### Error Handling

Robust error handling for network issues:

```typescript
// Connection error handling
client.events.on('error', (error) => {
  console.error('Connection error:', error)
  // Show error message to user
  this.showConnectionError()
})

// Data parsing error handling  
client.events.on('parseError', (error, rawData) => {
  console.error('Failed to parse server data:', error)
  // Log for debugging but don't crash the theme
})

// Sprite loading error handling
V2.onPartyUpdate((party) => {
  party.forEach(pokemon => {
    if (pokemon) {
      // Sprites have fallback mechanisms built-in
      const sprite = V2.getSprite(pokemon) // Automatically handles fallbacks
    }
  })
})
```

## Performance Optimization

### Efficient Event Handling

```typescript
// Use computed properties instead of watchers when possible
export default {
  computed: {
    // Automatically updates when party changes
    alivePokemon(): Pokemon[] {
      return this.party.filter(p => p !== null) as Pokemon[]
    },
    
    // Cached calculation
    averageLevel(): number {
      const alive = this.alivePokemon
      if (alive.length === 0) return 0
      
      return alive.reduce((sum, p) => sum + p.level, 0) / alive.length
    }
  },
  
  methods: {
    // Efficient party updates
    updateParty(newParty: (Pokemon | null)[]) {
      // Only update if actually changed
      if (this.partiesEqual(this.party, newParty)) {
        return
      }
      
      // Batch DOM updates
      this.$nextTick(() => {
        this.party = newParty
      })
    },
    
    partiesEqual(a: (Pokemon | null)[], b: (Pokemon | null)[]): boolean {
      if (a.length !== b.length) return false
      
      return a.every((pokemon, index) => {
        const other = b[index]
        if (!pokemon && !other) return true
        if (!pokemon || !other) return false
        
        // Compare by PID for identity
        return pokemon.pid === other.pid
      })
    }
  }
}
```

### Memory Management

```typescript
// Clean up event listeners when theme is destroyed
export default {
  beforeUnmount() {
    // Events are automatically cleaned up, but you can manually remove them
    events.removeAllListeners('client:party:updated')
    events.removeAllListeners('client:badges:updated')
  },
  
  methods: {
    // Limit graveyard size to prevent memory leaks
    addToGraveyard(pokemon: Pokemon) {
      this.graveyard.push(pokemon)
      
      // Keep only last 100 deaths
      if (this.graveyard.length > 100) {
        this.graveyard.splice(0, this.graveyard.length - 100)
      }
    }
  }
}
```

## Testing and Development

### Debug Mode

Enable debug mode for detailed event logging:

```typescript
// Add ?debug=true to theme URL
// Or set in initialization
V2.initialize({
  debug: true // Enables detailed console logging
})

// Debug mode logs all events:
// "Party update: [Pokemon data...]"
// "Badge update: [Badge data...]" 
// "Death update: [Pokemon data...]"
```

### Mock Data for Development

Test themes with mock data:

```typescript
// Create test data for development
const mockParty: (Pokemon | null)[] = [
  {
    pid: 123456,
    species: 6, // Charizard
    level: 50,
    hp: { max: 150, current: 120 },
    translations: {
      english: { speciesName: 'Charizard', status: 'Healthy', types: ['Fire', 'Flying'] },
      locale: { speciesName: 'Charizard', status: 'Healthy', types: ['Fire', 'Flying'] }
    },
    // ... other required fields
  },
  null, // Empty slot
  null,
  null,
  null,
  null
]

// In development mode, use mock data
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    this.party = mockParty
  }, 1000)
} else {
  V2.onPartyUpdate((party) => {
    this.party = party
  })
}
```

This event-driven architecture ensures themes receive real-time updates while maintaining type safety and performance. The automatic reconnection and error handling provide a robust foundation for streaming applications.