#!/usr/bin/env node
// Checks that a web source generation is internally consistent:
// the manifests the desktop app reads, the folders they point at, and the
// relative paths inside each theme's index.html.
//
// Usage: node scripts/validate-manifests.mjs <v3|v2|v1>
//
//   v3  the repository root (themes.json, badges.json, ...)
//   v2  the v2/ folder
//   v1  the v1/ folder (plain JSON manifests, no options)
//
// Exits non-zero and prints GitHub annotations when a check fails.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsHost = 'https://assets.pokelink.xyz'

// Theme folders that ship in the repo on purpose but are not listed in themes.json.
// Anything else missing from the manifest is treated as a mistake.
const unlistedThemes = new Set(['mass-multiplayer', 'sprite-test'])

const optionTypes = {
    boolean: value => typeof value === 'boolean',
    string: value => typeof value === 'string'
}

const generations = {
    v3: {dir: '.', urlVersion: 'v3'},
    v2: {dir: 'v2', urlVersion: 'v2'},
    v1: {dir: 'v1', urlVersion: null}
}

const errors = []
const warnings = []

function fail(file, message) {
    errors.push({file, message})
}

function warn(file, message) {
    warnings.push({file, message})
}

function readJson(root, name) {
    const file = path.join(root, name)
    if (!existsSync(file)) {
        fail(rel(file), 'file is missing')
        return null
    }
    try {
        return JSON.parse(readFileSync(file, 'utf8'))
    } catch (error) {
        fail(rel(file), `invalid JSON: ${error.message}`)
        return null
    }
}

function rel(file) {
    return path.relative(repoRoot, file) || '.'
}

function isDir(p) {
    return existsSync(p) && statSync(p).isDirectory()
}

function sourceDirs(root, kind) {
    const base = path.join(root, kind)
    if (!isDir(base)) return []
    return readdirSync(base).filter(name => !name.startsWith('_') && isDir(path.join(base, name)))
}

function checkOptions(file, label, options) {
    if (options === undefined) return
    if (!Array.isArray(options)) {
        fail(file, `${label}: "options" must be an array`)
        return
    }
    const keys = new Set()
    for (const option of options) {
        const where = `${label} option "${option?.key}"`
        if (typeof option?.key !== 'string' || option.key === '') {
            fail(file, `${label}: an option has no "key"`)
            continue
        }
        if (keys.has(option.key)) fail(file, `${where}: duplicate key`)
        keys.add(option.key)
        if (typeof option.name !== 'string') fail(file, `${where}: missing "name"`)
        const check = optionTypes[option.type]
        if (!check) {
            fail(file, `${where}: unknown type "${option.type}" (expected ${Object.keys(optionTypes).join(' or ')})`)
            continue
        }
        if (!check(option.default)) fail(file, `${where}: default ${JSON.stringify(option.default)} is not a ${option.type}`)
        if (option.options !== undefined) {
            if (!Array.isArray(option.options) || !option.options.includes(option.default)) {
                fail(file, `${where}: default ${JSON.stringify(option.default)} is not one of its choices`)
            }
        }
    }
}

function checkKind(root, urlVersion, kind, manifestName) {
    const manifest = readJson(root, manifestName)
    if (!manifest) return
    const file = rel(path.join(root, manifestName))
    if (typeof manifest.version !== 'number') fail(file, 'missing numeric "version"')
    const entries = manifest[kind]
    if (!Array.isArray(entries)) {
        fail(file, `"${kind}" must be an array`)
        return
    }

    const prefix = `${assetsHost}/${urlVersion}/${kind}/`
    const listed = new Set()
    const urls = new Set()
    for (const entry of entries) {
        const label = entry?.name ?? '(unnamed entry)'
        if (typeof entry?.name !== 'string') fail(file, 'an entry has no "name"')
        if (typeof entry?.url !== 'string' || !entry.url.startsWith(prefix)) {
            fail(file, `${label}: url must start with ${prefix}`)
            continue
        }
        if (urls.has(entry.url)) fail(file, `${label}: duplicate url ${entry.url}`)
        urls.add(entry.url)
        const slug = entry.url.slice(prefix.length).replace(/\/$/, '')
        listed.add(slug)
        if (!existsSync(path.join(root, kind, slug, 'index.html'))) {
            fail(file, `${label}: ${path.posix.join(rel(root), kind, slug, 'index.html')} does not exist`)
        }
        checkOptions(file, label, entry.options)
    }

    for (const dir of sourceDirs(root, kind)) {
        if (listed.has(dir)) continue
        if (kind === 'themes' && unlistedThemes.has(dir)) continue
        fail(file, `${kind}/${dir} exists but is not listed (add it, or add it to unlistedThemes in this script)`)
    }
}

function checkSprites(root) {
    const manifest = readJson(root, 'sprites.json')
    if (!manifest) return
    const file = rel(path.join(root, 'sprites.json'))
    if (!Array.isArray(manifest.spriteSets)) {
        fail(file, '"spriteSets" must be an array')
        return
    }
    const ids = new Set()
    for (const set of manifest.spriteSets) {
        if (typeof set?.id !== 'string') {
            fail(file, 'a sprite set has no "id"')
            continue
        }
        if (ids.has(set.id)) fail(file, `${set.id}: duplicate id`)
        ids.add(set.id)
        if (typeof set.templateString !== 'string' || set.templateString === '') fail(file, `${set.id}: missing "templateString"`)
        if (!Array.isArray(set.supportedGenerations) || !set.supportedGenerations.every(Number.isInteger)) {
            fail(file, `${set.id}: "supportedGenerations" must be a list of integers`)
        }
    }
}

// The preview page keeps its own hand-written theme list.
function checkPreviewList(root) {
    const file = path.join(root, 'dev-tools/theme-preview/preview.js')
    if (!existsSync(file)) return
    const source = readFileSync(file, 'utf8')
    const block = source.match(/const THEMES = \[([\s\S]*?)\]/)
    if (!block) {
        fail(rel(file), 'could not find the THEMES list')
        return
    }
    const listed = new Set([...block[1].matchAll(/'([^']+)'/g)].map(match => match[1]))
    const dirs = new Set(sourceDirs(root, 'themes'))
    for (const dir of dirs) if (!listed.has(dir)) fail(rel(file), `THEMES is missing "${dir}"`)
    for (const name of listed) if (!dirs.has(name)) fail(rel(file), `THEMES lists "${name}" but themes/${name} does not exist`)
}

function htmlFiles(root, kind) {
    return sourceDirs(root, kind).map(dir => path.join(root, kind, dir, 'index.html')).filter(existsSync)
}

// Themes are served as static files, so a moved or renamed file breaks them silently.
function checkHtmlReferences(root) {
    for (const kind of ['themes', 'badges', 'graveyards']) {
        for (const html of htmlFiles(root, kind)) {
            const source = readFileSync(html, 'utf8')
            const missing = ref => !existsSync(path.resolve(path.dirname(html), ref.split(/[?#]/)[0]))

            const tags = new Set([...source.matchAll(/\b(?:src|href)="(\.{1,2}\/[^"]*)"/g)].map(match => match[1]))
            for (const ref of tags) if (missing(ref)) fail(rel(html), `references ${ref}, which does not exist`)

            // An import map entry only matters if something imports it, so an
            // unused stale entry is reported without failing the run.
            const mapped = new Set([...source.matchAll(/"[\w@/-]+"\s*:\s*"(\.{1,2}\/[^"]*)"/g)].map(match => match[1]))
            for (const ref of mapped) if (missing(ref)) warn(rel(html), `import map points at ${ref}, which does not exist`)
        }
    }
}

function checkV1(root) {
    for (const name of ['themes.json', 'themes/themes.json']) {
        const manifest = readJson(root, name)
        if (!manifest) continue
        const file = rel(path.join(root, name))
        if (!Array.isArray(manifest.themes)) {
            fail(file, '"themes" must be an array')
            continue
        }
        for (const theme of manifest.themes) {
            if (typeof theme?.path !== 'string') {
                fail(file, `${theme?.name ?? '(unnamed entry)'}: missing "path"`)
                continue
            }
            if (!existsSync(path.join(root, 'themes', theme.path, 'index.html'))) {
                fail(file, `${theme.name}: themes/${theme.path}/index.html does not exist`)
            }
        }
    }
}

const name = process.argv[2]
const generation = generations[name]
if (!generation) {
    console.error(`Usage: validate-manifests.mjs <${Object.keys(generations).join('|')}>`)
    process.exit(2)
}
const root = path.join(repoRoot, generation.dir)

if (name === 'v1') {
    checkV1(root)
} else {
    checkKind(root, generation.urlVersion, 'themes', 'themes.json')
    checkKind(root, generation.urlVersion, 'badges', 'badges.json')
    checkKind(root, generation.urlVersion, 'graveyards', 'graveyards.json')
    checkSprites(root)
    checkPreviewList(root)
    checkHtmlReferences(root)
}

for (const {file, message} of warnings) console.log(`::warning file=${file}::${message}`)

if (errors.length > 0) {
    for (const {file, message} of errors) console.log(`::error file=${file}::${message}`)
    console.error(`\n${name}: ${errors.length} problem${errors.length === 1 ? '' : 's'} found`)
    process.exit(1)
}
console.log(`${name}: manifests and theme references are consistent`)
