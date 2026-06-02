# Protocol Buffer Schema Documentation

This document describes the Protocol Buffer schemas used by PokeLink Web for data communication between the server and client.

## Overview

PokeLink Web supports two versions of Protocol Buffer schemas:
- **V1 (Legacy):** Used with Socket.IO connections
- **V2 (Modern):** Used with WebSocket connections, includes enhanced features

### Generating Protocol Buffer Types

Protocol Buffer definitions are automatically compiled to TypeScript during the build process:

```bash
# Generate protobuf types (recommended - uses Makefile)
make buf-generate

# Or use yarn directly
yarn buf generate
```

Generated files:
- `v2/assets/js/v2_pb.js` - Compiled protobuf code
- TypeScript definitions for all message types
- Serialization/deserialization functions

> 📝 **Note**: Protocol Buffer generation is included in `make setup` and `make build`. Manual generation is only needed when modifying `.proto` files. See [Build System](build-system.md) for details.

## V2 Protocol Buffer Schema

The V2 schema is located at `v2/assets/proto/v2.proto` and provides comprehensive data structures for modern theme development.

### Core Message Types

#### Base Message
All V2 messages extend from the Base message structure:

```protobuf
message Base {
  string channel = 1;
  optional string username = 2;
}
```

**Fields:**
- `channel`: Event channel identifier (e.g., "client:party:updated")
- `username`: Username of the player (optional for some message types)

### Party Data

#### Party Message
Main message for party updates:

```protobuf
message Party {
  string channel = 1;
  string username = 2;
  repeated PartyObject party = 3;
}
```

#### PartyObject
Individual party slot container:

```protobuf
message PartyObject {
  optional Pokemon pokemon = 1;
  uint32 changeId = 2;
}
```

**Fields:**
- `pokemon`: Pokemon data (null for empty slots)
- `changeId`: Incremental ID for tracking changes

### Pokemon Data Structure

#### Pokemon Message
Comprehensive Pokemon data structure:

```protobuf
message Pokemon {
  uint32 pid = 1;                    // Unique Pokemon ID
  uint32 species = 2;                // National Dex number
  uint32 level = 3;                  // Current level
  uint32 exp = 4;                    // Current experience
  uint32 expToNextLevel = 5;         // EXP needed for next level
  double expPercentage = 6;          // Progress to next level (0.0-1.0)
  HP hp = 7;                         // Health points
  repeated Move moves = 8;           // Up to 4 moves
  EVIV ivs = 9;                     // Individual Values
  EVIV evs = 10;                    // Effort Values
  BaseStats baseStats = 11;          // Base stat values
  StatusEffect status = 12;          // Current status condition
  PokemonTranslations translations = 13; // Localized names
  bool hasFemaleSprite = 14;         // Gender sprite availability

  // Optional fields
  optional string color = 15;                // Theme color hex
  optional string fallbackSprite = 16;      // Backup sprite URL
  optional string fallbackPartySprite = 17; // Backup party sprite URL
  optional string nickname = 18;            // Custom nickname
  optional uint32 heldItem = 19;           // Held item ID
  optional Gender gender = 20;              // Gender enum
  optional uint32 form = 21;               // Alternate form ID
  optional bool isEgg = 22;                // Egg status
  optional uint32 hiddenPower = 23;        // Hidden Power type
  optional uint32 nature = 24;             // Nature ID
  optional bool isShiny = 25;              // Shiny status
  optional uint32 pokeball = 26;           // Pokeball type ID
  optional uint32 friendship = 27;          // Friendship value
  optional uint32 ability = 28;            // Ability ID
  optional Pokerus pokerus = 29;           // Pokerus status
  optional uint32 locationMet = 30;        // Location caught
  optional uint32 levelMet = 31;           // Level when caught
  optional GraveMeta graveyardMeta = 32;   // Death metadata
}
```

#### Supporting Structures

##### HP (Health Points)
```protobuf
message HP {
  uint32 max = 1;     // Maximum HP
  uint32 current = 2; // Current HP
}
```

##### Move
```protobuf
message Move {
  uint32 id = 1;              // Move ID
  uint32 pp = 2;              // Current PP
  uint32 maxPP = 3;           // Maximum PP
  MoveTranslation english = 4; // English names/types
  MoveTranslation locale = 5;  // Localized names/types
}
```

##### EVIV (Stats Container)
Used for both EVs (Effort Values) and IVs (Individual Values):

```protobuf
message EVIV {
  uint32 atk = 1;    // Attack
  uint32 def = 2;    // Defense
  uint32 spatk = 3;  // Special Attack
  uint32 spdef = 4;  // Special Defense
  uint32 spd = 5;    // Speed
  uint32 hp = 6;     // HP
}
```

##### BaseStats
```protobuf
message BaseStats {
  uint32 atk = 1;    // Base Attack
  uint32 def = 2;    // Base Defense
  uint32 spatk = 3;  // Base Special Attack
  uint32 spdef = 4;  // Base Special Defense
  uint32 spd = 5;    // Base Speed
  uint32 hp = 6;     // Base HP
  uint32 bst = 7;    // Base Stat Total
}
```

### Translations and Localization

#### PokemonTranslations
```protobuf
message PokemonTranslations {
  TranslationsObject english = 1; // English names
  TranslationsObject locale = 2;  // User's locale names
}
```

#### TranslationsObject
```protobuf
message TranslationsObject {
  string speciesName = 1;           // Pokemon species name
  string status = 2;                // Status condition name
  repeated string types = 3;        // Type names array
  optional string formName = 4;     // Alternate form name
  optional string heldItemName = 5; // Held item name
  optional string gender = 6;       // Gender string
  optional string hiddenPowerName = 7; // Hidden Power type name
  optional string pokeballName = 8; // Pokeball name
  optional string abilityName = 9;  // Ability name
  optional string pokerusStatus = 10; // Pokerus status string
  optional string locationMetName = 11; // Location name
  optional string natureName = 12;  // Nature name
}
```

### Enumerations

#### Gender
```protobuf
enum Gender {
  male = 0;
  female = 1;
  genderless = 2;
}
```

#### StatusEffect
```protobuf
enum StatusEffect {
  healthy = 0;
  poisoned = 1;
  asleep = 2;
  paralyzed = 3;
  frozen = 4;
  burned = 5;
}
```

#### Pokerus
```protobuf
enum Pokerus {
  clean = 0;
  infected = 1;
  cured = 2;
}
```

### Badge System

#### Badges Message
```protobuf
message Badges {
  string channel = 1;
  string username = 2;
  repeated Badge badges = 3;
}
```

#### Badge
```protobuf
message Badge {
  string id = 1;                    // Unique badge identifier
  string localeName = 2;            // Localized badge name
  string englishName = 3;           // English badge name
  bool obtained = 4;                // Whether badge is obtained
  string sprite = 5;                // Badge sprite URL
  optional string englishCategory = 6;  // Badge category (English)
  optional string localeCategory = 7;   // Badge category (localized)
  optional string levelText = 8;    // Level cap text
  optional uint32 levelCap = 9;     // Numerical level cap
}
```

### Graveyard System

#### GraveyardUpdate Message
```protobuf
message GraveyardUpdate {
  string channel = 1;
  string username = 2;
  repeated Pokemon graves = 3;
}
```

#### GraveMeta
Death metadata for fallen Pokemon:

```protobuf
message GraveMeta {
  google.protobuf.Timestamp timeOfDeath = 1; // When Pokemon fainted
  string id = 2;                             // Unique grave identifier
}
```

### Death and Revival Events

#### PokemonDeath Message
```protobuf
message PokemonDeath {
  string channel = 1;
  string username = 2;
  Pokemon pokemon = 3;
}
```

#### PokemonRevive Message
```protobuf
message PokemonRevive {
  string channel = 1;
  string username = 2;
  string graveId = 3;  // ID of the grave to revive from
}
```

### Settings System

#### Settings Message
```protobuf
message Settings {
  string channel = 1;
  string username = 2;
  SettingsData data = 3;
}
```

#### SettingsData
```protobuf
message SettingsData {
  optional string spriteTemplate = 1; // Custom sprite template URL
}
```

## V1 Protocol Buffer Schema (Legacy)

The V1 schema is simpler and used for backward compatibility with older themes.

### Key Differences from V2

1. **Less structured data:** No comprehensive translation system
2. **Simpler move system:** Only name and PP, no type information
3. **Basic status system:** Numeric status values instead of enums
4. **Limited metadata:** No graveyard timestamps or comprehensive stats

### Legacy Pokemon Structure

```protobuf
message Pokemon {
  optional bool isEgg = 1;
  uint32 exp = 2;
  HP hp = 3;
  optional string nature = 4;
  Move move1 = 5;
  Move move2 = 6;
  Move move3 = 7;
  Move move4 = 8;
  // ... additional fields
}
```

## Channel Types

### V2 Event Channels

| Channel | Message Type | Description |
|---------|--------------|-------------|
| `client:party:updated` | Party | Party composition changed |
| `client:badges:updated` | Badges | Badge status updated |
| `client:party:death` | PokemonDeath | Pokemon fainted |
| `client:party:revive` | PokemonRevive | Pokemon revived |
| `client:settings:updated` | Settings | User settings changed |
| `client:graveyard:updated` | GraveyardUpdate | Graveyard contents changed |

### Usage in Themes

```typescript
// TypeScript example for handling protobuf messages
import {fromBinary} from '@bufbuild/protobuf'
import {PartySchema, PokemonDeathSchema} from './v2_pb.js'

client.on('client:party:updated', (buffer: Uint8Array) => {
  const partyMessage = fromBinary(PartySchema, buffer)
  console.log(`Received party update for ${partyMessage.username}`)
  
  partyMessage.party.forEach((slot, index) => {
    if (slot.pokemon) {
      console.log(`Slot ${index + 1}: ${slot.pokemon.translations.english.speciesName}`)
    }
  })
})
```

## Data Validation

All protobuf messages are strongly typed and validated:

- **Required fields** must be present
- **Optional fields** can be null/undefined
- **Enums** are validated against defined values
- **Repeated fields** are arrays that can be empty

This ensures type safety in TypeScript themes and prevents runtime errors from malformed data.