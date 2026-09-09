// Update this list when themes are added to or removed from v2/themes/.
const THEMES = [
    'basic-card',
    'bdsp-battle-style-hud',
    'big-numbers',
    'default',
    'digital-hex',
    'fading-card-art',
    'friday',
    'gameboy',
    'jezzabel-personal',
    'letsgo',
    'mass-multiplayer',
    'pokeball',
    'rescue-team-dx',
    'simple-circles',
    'sports-game-scores',
    'sprite-only',
    'sprite-test',
    'stick-it-down',
    'sword-shield-team',
    'trozei',
    'twitch-plays-pokemon',
]

const SETTINGS_KEY = 'pokelink-theme-preview-settings'

// Themes assume an OBS-style 1920x1080 canvas. Every iframe is rendered at
// that fixed size and scaled down with a CSS transform to fit its container,
// rather than being given a small viewport (which would reflow the layout).
const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080

let currentIndex = 0

// One iframe per theme, created once and never re-parented away from the
// DOM. Navigating just moves the existing element between the primary slot
// and its grid cell, so its WebSocket connection is never dropped/reloaded.
const iframesByTheme = new Map()
const gridSlotsByTheme = new Map()
let primaryFrameWrap

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        rescale(entry.target)
    }
})

function loadSettings() {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return {
        server: stored.server || 'localhost',
        port: stored.port || '3000',
        users: stored.users || '',
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function readSettingsFromInputs() {
    return {
        server: document.getElementById('setting-server').value.trim() || 'localhost',
        port: document.getElementById('setting-port').value.trim() || '3000',
        users: document.getElementById('setting-users').value.trim(),
    }
}

function themeUrl(themeName, settings) {
    const params = new URLSearchParams()
    params.set('server', settings.server)
    params.set('port', settings.port)
    if (settings.users) {
        params.set('users', settings.users)
    }
    return `../../themes/${themeName}/index.html?${params.toString()}`
}

function rescale(containerEl) {
    const iframe = containerEl.querySelector('iframe')
    if (!iframe) {
        return
    }
    const scale = containerEl.clientWidth / CANVAS_WIDTH
    iframe.style.transform = `scale(${scale})`
}

function updateLabelAndHighlight() {
    const themeName = THEMES[currentIndex]
    document.getElementById('primary-label').textContent =
        `${themeName} (${currentIndex + 1} / ${THEMES.length})`

    document.querySelectorAll('.theme-cell').forEach((cell, index) => {
        cell.classList.toggle('active', index === currentIndex)
    })
}

function setCurrentIndex(index) {
    const newIndex = (index + THEMES.length) % THEMES.length
    if (newIndex === currentIndex) {
        return
    }

    const oldTheme = THEMES[currentIndex]
    const newTheme = THEMES[newIndex]

    // Move the outgoing iframe back into its grid cell, and the incoming
    // iframe into the primary slot. Neither iframe's src changes, so neither
    // reloads/reconnects.
    gridSlotsByTheme.get(oldTheme).appendChild(iframesByTheme.get(oldTheme))
    primaryFrameWrap.appendChild(iframesByTheme.get(newTheme))

    currentIndex = newIndex
    rescale(gridSlotsByTheme.get(oldTheme))
    rescale(primaryFrameWrap)
    updateLabelAndHighlight()
}

function reloadAll() {
    const settings = readSettingsFromInputs()
    saveSettings(settings)

    iframesByTheme.forEach((iframe, themeName) => {
        iframe.src = themeUrl(themeName, settings)
    })
}

function createIframe(themeName, settings) {
    const iframe = document.createElement('iframe')
    iframe.dataset.theme = themeName
    iframe.width = CANVAS_WIDTH
    iframe.height = CANVAS_HEIGHT
    iframe.src = themeUrl(themeName, settings)
    return iframe
}

function buildGrid() {
    const grid = document.getElementById('theme-grid')
    const settings = loadSettings()

    THEMES.forEach((themeName, index) => {
        const cell = document.createElement('div')
        cell.className = 'theme-cell'
        cell.addEventListener('click', () => setCurrentIndex(index))

        const label = document.createElement('div')
        label.className = 'theme-cell-label'
        label.textContent = themeName
        cell.appendChild(label)

        const frameWrap = document.createElement('div')
        frameWrap.className = 'theme-cell-frame'
        cell.appendChild(frameWrap)

        grid.appendChild(cell)
        gridSlotsByTheme.set(themeName, frameWrap)
        resizeObserver.observe(frameWrap)

        const iframe = createIframe(themeName, settings)
        iframesByTheme.set(themeName, iframe)

        if (index === currentIndex) {
            primaryFrameWrap.appendChild(iframe)
        } else {
            frameWrap.appendChild(iframe)
        }
    })
}

function init() {
    primaryFrameWrap = document.getElementById('primary-frame-wrap')
    resizeObserver.observe(primaryFrameWrap)

    const settings = loadSettings()
    document.getElementById('setting-server').value = settings.server
    document.getElementById('setting-port').value = settings.port
    document.getElementById('setting-users').value = settings.users

    document.getElementById('back-button').addEventListener('click', () => setCurrentIndex(currentIndex - 1))
    document.getElementById('next-button').addEventListener('click', () => setCurrentIndex(currentIndex + 1))
    document.getElementById('reload-button').addEventListener('click', reloadAll)

    buildGrid()
    updateLabelAndHighlight()
}

document.addEventListener('DOMContentLoaded', init)
