# Contributing

This repository holds the browser sources (OBS overlays) that the PokeLink desktop app points at: party themes, badge sets and graveyards. It keeps several generations of them side by side.

## Versions

| Generation | Location | Status | Build |
|---|---|---|---|
| v3 | repository root | Active. New work goes here. | Yarn, `buf`, `tsc`, webpack |
| v2 | `v2/` | Released. Bug fixes only. | Same tools, own `package.json` and lockfile |
| v1 | `v1/` | Legacy. Bug fixes only. | None, plain JavaScript |

Each generation is served from its own URL prefix (`https://assets.pokelink.xyz/v3/...`, `.../v2/...`), and released desktop builds point at those URLs. A change to v2 or v1 changes what existing users see, so keep those changes small.

CI runs a separate lane for each generation and skips a lane when none of its files changed.

## Building

Themes are served as static files, so the compiled `.js` and `.js.map` files next to each `.ts` file are committed, and so is the bundle in `assets/dist`. Rebuild and commit them whenever you change TypeScript or a `.proto` file. CI rebuilds everything and fails if the result differs from what is committed.

Use the Node version in `.nvmrc`. From the repository root (v3):

```sh
yarn install --frozen-lockfile
yarn buf generate
yarn build:core
yarn build:themes:nodeps
yarn build:badges:nodeps
yarn build:graveyards:nodeps
```

For v2, run the same commands inside `v2/`. The v2 bundle at `v2/assets/dist/pokelink.js` does not reproduce from a clean install today, so CI reports a difference there without failing. The compiled theme, badge and graveyard files are still checked.

`@bufbuild/protobuf` and `@bufbuild/protoc-gen-es` are pinned to one exact version in the root `package.json`. The generated `assets/js/v3_pb.*` files record the plugin version and the bundle includes the runtime, so bump both together, rebuild and commit the result.

## Manifests

`themes.json`, `badges.json`, `graveyards.json` and `sprites.json` are what the desktop app reads. Check them with:

```sh
node scripts/validate-manifests.mjs v3   # or v2, or v1
```

The script checks that:

- every `url` points at a folder that has an `index.html`
- every theme folder is listed, except `sprite-test` and `mass-multiplayer`
- option keys are unique and each default matches its type
- relative paths in each `index.html` resolve to real files
- the theme list in `dev-tools/theme-preview/preview.js` matches the folders

To add a theme, create `themes/<name>/`, add it to `themes.json`, and add it to the `THEMES` list in `dev-tools/theme-preview/preview.js`.

## Protocol files

`assets/proto/v3.proto` can change. `v2/assets/proto/v2.proto` and `v1/assets/proto/V1.proto` are frozen, because `pokelink-neo` compiles them into released builds. CI fails a pull request that touches a frozen file unless a maintainer adds the `allow-frozen-proto` label.

For v3, CI runs `buf breaking` against the base branch and reports incompatible changes as warnings.

`pokelink-neo` finds these files by path (`assets/proto/*.proto` and `v2/assets/proto/*.proto`). If you add, move or remove a `.proto` file, CI warns you so you can check that it still finds every version it needs.

## Dependency updates

Dependabot opens weekly pull requests for the root, `v2/` and GitHub Actions. A bump can change the generated output. When CI says the committed output is out of date, run the build commands above on that branch and push the result.
