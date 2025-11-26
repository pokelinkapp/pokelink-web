# PokeLink Web Documentation

Welcome to the comprehensive documentation for PokeLink Web - a collection of styled web sources for streamers to display their Pokémon teams in real-time.

## Documentation Index

### 📖 Core Documentation
- **[Protocol Buffer Schema](protobuf-schema.md)** - Complete reference for V1 and V2 protobuf message types and schemas
- **[Theme Data Structures](theme-data-structures.md)** - Available data types and interfaces for theme development
- **[Data Reception & Events](data-reception-events.md)** - How themes receive and handle real-time data updates
- **[Client API Reference](client-api-reference.md)** - Complete API reference for the PokeLink client
- **[Build System](build-system.md)** - Complete guide to the Makefile and build process

### 🎨 Development Guides
- **[Theme Development Guide](theme-development-guide.md)** - Step-by-step guide for creating custom themes
- **[Examples & Code Snippets](examples-and-snippets.md)** - Practical examples and reusable code snippets

## Quick Start

### For Theme Users
1. Choose a theme from the `v2/themes/` directory
2. Open the theme's `index.html` in a browser
3. Add `?user=YourUsername` to the URL
4. Use in OBS as a Browser Source

### For Theme Developers
1. Read the [Theme Development Guide](theme-development-guide.md)
2. Understand the [Build System](build-system.md) for compilation and development workflows
3. Explore [Examples & Code Snippets](examples-and-snippets.md)
4. Reference the [Client API](client-api-reference.md) for available methods
5. Use [Data Structures](theme-data-structures.md) for type information

## Key Concepts

### Protocol Versions
- **V1 (Legacy)**: Socket.IO with JSON messages - found in root `themes/` directory
- **V2 (Modern)**: WebSocket with Protocol Buffers - found in `v2/themes/` directory

### Data Flow
```
PokeLink Server → WebSocket → Protocol Buffer → Event Emitter → Vue.js → DOM
```

### Event Types
- **Party Updates**: When Pokemon party changes
- **Badge Updates**: When gym badges are earned
- **Death Events**: When Pokemon faint
- **Revive Events**: When Pokemon are revived
- **Graveyard Updates**: Complete fallen Pokemon list

### Theme Structure
```
theme-name/
├── assets/
│   ├── css/styles.css     # Theme styling
│   └── js/party.ts        # Main theme logic
└── index.html             # Theme entry point
```

## Available Data

### Pokemon Data
Each Pokemon object contains:
- **Core Info**: Species, level, Exp, HP
- **Combat Data**: Moves, IVs, EVs, base stats, nature
- **Metadata**: Nickname, gender, shiny status, held item
- **Translations**: Names in multiple languages
- **Sprites**: Multiple sprite sources with fallbacks

### Real-time Events
- Party composition changes
- Individual Pokemon updates (HP, level, moves)
- Badge/achievement progress
- Pokemon deaths and revivals
- Settings and sprite template updates

## Development Tools

### URL Parameters
Control theme behavior via URL parameters:
- `?user=Username` - Specify PokeLink username (required)
- `?slot=1` - Show single Pokemon slot (1-6)
- `?hp=true` - Display HP bars
- `?debug=true` - Enable debug logging
- `?template=URL` - Custom sprite template

### Build System
The project includes both Makefile and package.json scripts:

```bash
# Using Makefile (recommended)
make setup              # Initial setup
make dev               # Development with watch mode
make build             # Complete build
make help              # Show all available commands

# Using yarn directly
yarn install           # Install dependencies
yarn build:core        # Build core libraries
yarn build:themes      # Build themes
yarn build             # Complete build
```

See [Build System Documentation](build-system.md) for complete details.

### Testing
- Use `?debug=true` for detailed event logging
- Test with mock data using `?mock=true`
- Verify across different browsers and screen sizes

## Theme Categories

### Party Display Themes
Show current Pokemon party with various layouts:
- **basic-card**: Clean card-based layout
- **gameboy**: Retro GameBoy styling
- **sword-shield-team**: Official game UI style

### Badge Tracking Themes
Display gym badge progress:
- **default**: Simple badge grid
- **badges-only**: Compact badge display

### Death Counter Themes
Track fallen Pokemon (for Nuzlocke runs):
- **stick-it-down**: Memorial-style graveyard
- **simple-circles**: Minimalist death counter

### Specialty Themes
Unique display formats:
- **sports-game-scores**: Sports ticker style
- **trozei**: Puzzle game inspired layout
- **jezzabel-personal**: Sports ticker style

## Best Practices

### Performance
- Use `v-memo` for expensive list items
- Memoize computed properties
- Preload sprites when possible
- Clean up event listeners

### Error Handling
- Implement sprite fallbacks
- Handle connection losses gracefully
- Validate data before rendering
- Provide user feedback for errors

## Contributing

### Creating New Themes
1. Follow the [Theme Development Guide](theme-development-guide.md)
2. Test thoroughly across different scenarios
3. Add entry to `themes.json`
4. Include preview image and documentation
5. Submit pull request

### Improving Documentation
- Keep examples up-to-date
- Add missing use cases
- Improve clarity and organization
- Test all code examples

## Support

### Common Issues
- **Connection Failed**: Verify PokeLink server is running
- **Sprites Not Loading**: Check internet connection and sprite URLs
- **Theme Not Updating**: Clear browser cache and rebuild with `make rebuild`
- **Build Errors**: Use `make clean` then `make setup`, or see [Build System](build-system.md) troubleshooting

### Getting Help
- Check existing GitHub issues
- Review documentation thoroughly
- Test with debug mode enabled
- Provide detailed error descriptions

## Version History

### V2 (Current)
- TypeScript support
- Protocol Buffer messages
- Enhanced sprite system
- Comprehensive type safety
- Modern Vue.js 3 architecture

### V1 (Legacy)
- JavaScript themes
- Socket.IO communication
- JSON message format
- Basic Vue.js 2 support

---

*This documentation is continuously updated to reflect the latest PokeLink Web features and best practices.*