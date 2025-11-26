# Build System Documentation

This document provides comprehensive documentation for the PokeLink Web V2 build system, including the Makefile and package.json scripts.

## Overview

The PokeLink Web V2 build system is designed around:
- **TypeScript compilation** for type safety
- **Protocol Buffer generation** for efficient data serialization
- **Webpack bundling** for optimized client libraries
- **Modular builds** for themes, badges, and graveyards
- **Development workflows** with watch mode support

## Build Tools

### Core Dependencies
- **TypeScript**: Static type checking and ES2015+ to ES5 compilation
- **Webpack**: Module bundling and asset optimization
- **Protocol Buffers**: Efficient binary serialization format
- **Vue.js**: Reactive framework for theme components
- **Yarn**: Package management and script execution

### Build Structure
```
v2/
├── assets/              # Core library source
│   ├── js/             # TypeScript source files
│   ├── dist/           # Compiled output
│   └── tsconfig.json   # TypeScript configuration
├── themes/             # Theme sources
│   ├── */assets/js/    # Individual theme TypeScript
│   └── tsconfig.json   # Themes TypeScript config
├── badges/             # Badge component sources
├── graveyards/         # Graveyard component sources
├── package.json        # Dependencies and npm scripts
├── Makefile           # Make-based build system
└── webpack.config.js  # Webpack configuration
```

## Using the Makefile

The Makefile provides a more intuitive interface than raw npm/yarn scripts with colored output and better error handling.

### Quick Reference

```bash
# Show all available commands
make help

# Initial setup
make setup              # Install deps + generate protobuf

# Development
make dev               # Build core + watch for changes
make build-watch       # Watch mode only

# Building
make build             # Complete build (prep + buf + compile all)
make quick-build       # Fast build (skip prep/protobuf)
make build-core        # Build only core libraries
make build-themes      # Build only themes
make build-badges      # Build only badges
make build-graveyards  # Build only graveyards

# Maintenance
make clean             # Remove build artifacts
make clean-deps        # Remove build artifacts + node_modules
make rebuild           # Clean + build
make check-types       # TypeScript type checking
make validate          # Full validation
```

### Build Target Categories

#### 🏗️ **Core Build Targets**

##### `make build-core`
Compiles the core TypeScript libraries and creates the webpack bundle.

**What it does:**
1. Compiles TypeScript from `assets/js/` to `assets/dist/`
2. Bundles modules with webpack for browser consumption
3. Generates source maps for debugging

**Files processed:**
- `assets/js/client.ts` → `assets/dist/client.js`
- `assets/js/clientv2.ts` → `assets/dist/clientv2.js`
- `assets/js/pokelink.ts` → `assets/dist/pokelink.js`
- `assets/js/global.ts` → `assets/dist/global.js`

**Output:**
- JavaScript modules with type definitions
- Source maps for debugging
- Webpack bundles ready for browser import

##### `make buf-generate`
Generates TypeScript types from Protocol Buffer definitions.

**What it does:**
1. Reads `assets/proto/v2.proto`
2. Generates TypeScript interfaces and classes
3. Creates serialization/deserialization code

**Output:**
- `assets/js/v2_pb.js` - Generated protobuf code
- Type definitions for all message types

#### 🎨 **Component Build Targets**

##### `make build-themes`
Compiles all theme TypeScript files to JavaScript.

**Process:**
1. Scans `themes/*/assets/js/*.ts` files
2. Compiles using `themes/tsconfig.json` configuration
3. Outputs `.js` and `.js.map` files alongside source

**Example:**
```
themes/basic-card/assets/js/party.ts
  ↓ TypeScript compilation
themes/basic-card/assets/js/party.js + party.js.map
```

##### `make build-badges`
Compiles badge component TypeScript files.

##### `make build-graveyards`  
Compiles graveyard component TypeScript files.

#### 🚀 **Development Targets**

##### `make dev`
Starts development mode with automatic rebuilding.

**What it does:**
1. Builds core libraries once
2. Starts watch mode for all component types
3. Automatically recompiles on file changes
4. Runs multiple TypeScript watchers in parallel

**Usage during development:**
```bash
make dev
# Edit any .ts file
# Watch console for compilation results
# Refresh browser to see changes
```

##### `make build-watch`
Watch mode only (no initial core build).

**Parallel processes:**
- `assets/` TypeScript watcher
- `themes/` TypeScript watcher  
- `badges/` TypeScript watcher
- `graveyards/` TypeScript watcher

#### 🧹 **Maintenance Targets**

##### `make clean`
Removes all compiled JavaScript files and source maps.

**Files removed:**
- `assets/dist/*`
- `themes/*/assets/js/*.js`
- `themes/*/assets/js/*.js.map`
- `badges/*/assets/js/*.js`
- `badges/*/assets/js/*.js.map`
- `graveyards/*/assets/js/*.js`
- `graveyards/*/assets/js/*.js.map`

##### `make clean-deps`
Complete cleanup including node_modules.

**Use cases:**
- Dependency corruption
- Major version upgrades
- Fresh development environment setup

#### ✅ **Validation Targets**

##### `make check-types`
Type-checks all TypeScript without emitting files.

**Validation scope:**
- Core libraries type checking
- Theme component type checking
- Badge component type checking
- Graveyard component type checking

**Benefits:**
- Fast type validation
- No file output
- Comprehensive error reporting
- CI/CD integration ready

##### `make validate`
Complete project validation.

**Current validation:**
- TypeScript type checking
- Extensible for future validations (linting, testing)

### Complete Build Workflow

#### Initial Setup
```bash
# First time setup
make setup
# Equivalent to: make prep + make buf-generate
```

#### Daily Development
```bash
# Start development
make dev

# In another terminal, make changes to themes
# Files automatically recompile

# When ready to test full build
make quick-build
```

#### Production Deployment
```bash
# Clean build for production
make clean
make build-prod
# Sets NODE_ENV=production for optimizations
```

#### Troubleshooting Build Issues
```bash
# Check for type errors
make check-types

# Nuclear option - rebuild everything
make rebuild

# Check build environment
make info
```

## Package.json Scripts

The original npm/yarn scripts are still available and form the foundation of the Makefile:

### Core Scripts
- `yarn prep` - Install dependencies
- `yarn build:core` - Build core TypeScript + webpack
- `yarn build:themes` - Build themes with dependencies
- `yarn build:badges` - Build badges with dependencies  
- `yarn build:graveyards` - Build graveyards with dependencies
- `yarn build` - Complete build process

### No-Dependency Scripts
- `yarn build:themes:nodeps` - Build themes without rebuilding core
- `yarn build:badges:nodeps` - Build badges without rebuilding core
- `yarn build:graveyards:nodeps` - Build graveyards without rebuilding core

### Buf (Protocol Buffers)
- `yarn buf generate` - Generate TypeScript from .proto files

## TypeScript Configuration

### Shared Configuration
Each module has its own `tsconfig.json` with shared base settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Module-Specific Settings

#### Assets (Core)
- Outputs to `assets/dist/`
- Includes webpack integration
- Generates declaration files

#### Themes
- Preserves directory structure
- Outputs alongside source files
- Vue.js support enabled

#### Badges & Graveyards  
- Similar to themes configuration
- Component-specific optimizations

## Webpack Configuration

### Bundle Strategy
- **Entry points**: Multiple entry points for different modules
- **Output**: AMD/UMD compatible modules
- **Optimization**: Code splitting and tree shaking
- **Development**: Source maps and hot reloading support

### Loader Chain
1. **TypeScript Loader**: `.ts` → JavaScript
2. **Vue Loader**: `.vue` → JavaScript (if present)
3. **Asset Loaders**: Images, fonts, CSS

## Build Performance

### Optimization Strategies

#### Development
- **Incremental compilation**: Only changed files
- **Parallel builds**: Multiple TypeScript processes
- **Source maps**: Full debugging information
- **No minification**: Faster builds

#### Production
- **Tree shaking**: Remove unused code
- **Minification**: Reduce bundle size
- **Optimization**: Enable all webpack optimizations
- **Source maps**: Production-safe source maps

### Build Times
Typical build times on modern hardware:

| Target | Cold Build | Incremental |
|--------|------------|-------------|
| Core | ~10-15s | ~2-3s |
| Themes | ~5-8s | ~1-2s |
| Badges | ~2-3s | ~1s |
| Graveyards | ~2-3s | ~1s |
| **Full Build** | ~20-30s | ~5-8s |

### Performance Tips

#### For Development
```bash
# Use quick-build after initial setup
make quick-build

# Use component-specific builds
make build-themes-only

# Use watch mode for active development
make dev
```

#### For CI/CD
```bash
# Parallel builds where possible
make build-core &
make buf-generate &
wait
make quick-build
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check TypeScript errors
make check-types

# Verify dependencies
make info

# Clean rebuild
make rebuild
```

#### Missing Dependencies
```bash
# Reinstall everything
make clean-deps
make setup
```

#### Protocol Buffer Issues  
```bash
# Regenerate protobuf types
make buf-generate

# Check if buf is installed
yarn buf --version
```

#### Watch Mode Problems
```bash
# Stop all processes
Ctrl+C

# Restart development
make dev
```

### Error Diagnosis

#### TypeScript Compilation Errors
- Check `tsconfig.json` settings
- Verify import paths
- Ensure all dependencies are installed

#### Webpack Bundle Errors
- Check `webpack.config.js`
- Verify entry points exist
- Check for circular dependencies

#### Runtime Errors
- Check browser console
- Verify all scripts are loaded
- Check for missing Protocol Buffer types

## Integration with IDEs

### VS Code
Recommended extensions:
- TypeScript and JavaScript Language Features
- Vue Language Features (Volar)
- Protocol Buffer support

### WebStorm
Built-in support for:
- TypeScript compilation
- Webpack integration
- Vue.js development

## Continuous Integration

### GitHub Actions Example
```yaml
name: Build and Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'yarn'
    - run: cd v2 && make setup
    - run: cd v2 && make validate
    - run: cd v2 && make build
```

This build system provides a robust foundation for developing PokeLink Web themes with modern tooling, type safety, and efficient development workflows.