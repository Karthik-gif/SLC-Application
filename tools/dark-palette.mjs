/**
 * The night palette for converted applications, and the rules that map a light declaration
 * to its night counterpart.
 *
 * Why this is computed rather than hand-listed: across the 21 converted stylesheets there are
 * 292 distinct (property, colour) pairs over 3179 occurrences, under four different custom
 * property naming conventions (--blue, --blueDark, --ds-blue, --blue-dark). A hand-kept table
 * of that size would rot on the first legacy edit. So a colour is classified by what it is
 * being used FOR (the property) and what it IS (hue, saturation, lightness), then mapped by
 * role.
 *
 * The palette is deliberately the one menu-shell.css already uses for the hub, so crossing
 * from the launcher into an application is not a change of scenery.
 */

/** Anchors. Everything else is derived from these by role. */
export const NIGHT = {
  bg: '#0d1724',
  bg2: '#16243a',
  surface: '#14212f',
  surface2: '#1b2b3d',
  border: '#2a3d52',
  borderStrong: '#3d5670',
  text: '#e6eef8',
  textSub: '#a9c2dd',
  textMuted: '#7f9bb8',
}

/** Dark tints standing in for the pale accent fills (#eaf3fc, #e4f5e9, #ffebee, ...). */
const TINT = {
  blue: '#17304a',
  blueStrong: '#1e4368',
  green: '#14321f',
  red: '#3a1b1e',
  amber: '#3a2a12',
  teal: '#113330',
  neutral: NIGHT.surface2,
}

/** Pale accent BORDERS, a shade up from the fills so an edge still reads against them. */
const TINT_EDGE = {
  blue: '#2d4a6b',
  green: '#26543a',
  red: '#5c2b30',
  amber: '#5a4220',
  teal: '#1d4f4a',
  neutral: NIGHT.border,
}

// ---------------------------------------------------------------------------- colour maths

export function parseColor(raw) {
  const s = String(raw).trim().toLowerCase()
  const hex = /^#([0-9a-f]{3,8})$/.exec(s)
  if (hex) {
    const h = hex[1]
    if (h.length === 3 || h.length === 4) {
      const [r, g, b] = [0, 1, 2].map((i) => parseInt(h[i] + h[i], 16))
      return { r, g, b, a: h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1 }
    }
    if (h.length === 6 || h.length === 8) {
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
      return { r, g, b, a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 }
    }
    return null
  }
  const fn = /^rgba?\(([^)]+)\)$/.exec(s)
  if (fn) {
    const parts = fn[1].split(/[,\s/]+/).filter(Boolean)
    if (parts.length < 3) return null
    const [r, g, b] = parts.slice(0, 3).map((p) => Math.round(parseFloat(p)))
    const a = parts.length > 3 ? parseFloat(parts[3]) : 1
    if ([r, g, b, a].some(Number.isNaN)) return null
    return { r, g, b, a }
  }
  return null
}

export function toHsl({ r, g, b }) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return { h: 0, s: 0, l }
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: h * 360, s, l }
}

export function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const bucket = Math.floor(((((h % 360) + 360) % 360) / 60)) % 6
  const seg = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][bucket]
  return (
    '#' +
    seg.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')
  )
}

/**
 * Which family a hue belongs to. Drives which pale tint a washed-out fill becomes.
 *
 * Chroma rather than saturation decides "neutral", because HSL saturation is meaningless at
 * the top of the lightness range: #e1e6ea is a grey hairline nine points wide in RGB, but
 * HSL calls it 18% saturated blue, which would tint every rule in the page.
 */
export function hueFamily(h, s, chroma = 255) {
  // Every grey in these pages is cool — a blue-cast #e1e6ea or #f7fbff. So a faint cast is
  // only neutral if it leans blue; an equally faint green (#ebf5eb, the confirmed-row tint)
  // is a deliberate status colour and has to keep its meaning at night.
  if (chroma <= 4) return 'neutral'
  if (chroma <= 12) return h >= 180 && h < 270 ? 'neutral' : hueFamily(h, 1, 255)
  if (s <= 0.12) return 'neutral'
  if (h >= 190 && h < 255) return 'blue'
  if (h >= 165 && h < 190) return 'teal'
  if (h >= 90 && h < 165) return 'green'
  if (h >= 15 && h < 90) return 'amber'
  return 'red'
}

// ------------------------------------------------------------------------- property groups

const SURFACE_PROPS = /^(background|background-color)$/
const BORDER_PROPS =
  /^(border|border-top|border-right|border-bottom|border-left|border-color|border-top-color|border-right-color|border-bottom-color|border-left-color|border-block|border-inline|outline|outline-color|column-rule|column-rule-color)$/
const INK_PROPS =
  /^(color|-webkit-text-fill-color|fill|stroke|caret-color|text-decoration-color)$/
const SHADOW_PROPS = /^(box-shadow|text-shadow|-webkit-box-shadow)$/

/**
 * The night colour for one literal in one property, or null to leave it exactly as it is.
 *
 * Leaving it alone is the common, correct answer for saturated brand and status colours: SAP
 * blue, the green of a confirmed row and the red of a breach all stay themselves at night.
 * Only the page's neutrals — its surfaces, its rules and its ink — actually invert.
 */
export function mapColor(prop, raw, { isScopeRoot = false } = {}) {
  const c = parseColor(raw)
  if (!c) return null

  // Translucent colours are overlays, scrims and drop shadows. They compose over whatever is
  // beneath them, so they already read correctly on a dark page.
  if (c.a < 1) return null

  const { h, s, l } = toHsl(c)
  const chroma = Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b)
  const fam = hueFamily(h, s, chroma)
  const property = prop.toLowerCase()

  if (SHADOW_PROPS.test(property)) {
    // An opaque colour in a shadow is a glow ring (box-shadow:0 0 0 3px #d9f3e2), not a drop
    // shadow, so it follows the pale-fill rule.
    return l >= 0.85 ? TINT[fam] : null
  }

  if (SURFACE_PROPS.test(property)) {
    if (fam === 'neutral') {
      // The page itself must land DARKER than the cards on it, or the depth hierarchy
      // inverts and every panel reads as a hole rather than a surface. The page is whatever
      // the scope root paints; the same near-white literal anywhere else is a card.
      if (isScopeRoot) return NIGHT.bg
      if (l >= 0.995) return NIGHT.surface
      if (l >= 0.93) return NIGHT.surface2
      if (l >= 0.8) return NIGHT.bg2
      return null
    }
    // A tint so pale it reads as white is doing a surface's job, not an accent's.
    if (l >= 0.97) return TINT.neutral
    if (l >= 0.9) return TINT[fam]
    if (l >= 0.82) return fam === 'blue' ? TINT.blueStrong : TINT[fam]
    return null // a saturated accent fill keeps its colour
  }

  if (BORDER_PROPS.test(property)) {
    if (l >= 0.82) return fam === 'neutral' ? NIGHT.border : TINT_EDGE[fam]
    if (l >= 0.68 && fam === 'neutral') return NIGHT.borderStrong
    return null // accent and already-dark borders stay
  }

  if (INK_PROPS.test(property)) {
    // White text almost always sits on an accent fill that is keeping its colour, so
    // inverting it would make the label vanish into its own button.
    if (l >= 0.8) return null
    // Saturation, not hue, separates a brand colour used as text from ordinary ink. The inks
    // in these pages are navies — #1d2d3e, #102a43, #173f63 — which share a hue with SAP blue
    // but sit far below it in saturation. Judging by hue alone reads body copy as an accent
    // and leaves the whole page a murky mid-blue.
    if (s < 0.7) {
      if (l <= 0.3) return NIGHT.text
      if (l <= 0.45) return NIGHT.textSub
      return NIGHT.textMuted
    }
    // A genuine accent used as text needs lifting: #0a6ed1 on #14212f fails contrast.
    return hslToHex(h, Math.max(s, 0.5), 0.68)
  }

  return null
}

// ------------------------------------------------------- custom properties, mapped by role

/** Normalises --ds-blue-soft, --blueSoft and --blue-soft to one key. */
export function normaliseVar(name) {
  return name.replace(/^--/, '').replace(/^ds-/, '').replace(/[-_]/g, '').toLowerCase()
}

/**
 * A custom property's name states its role outright, which beats inferring the role from its
 * value: --grayReadOnly and --surfaceAlt are both #f2f4f5, but only one of them is a surface.
 */
const VAR_ROLES = {
  bg: NIGHT.bg,
  page: NIGHT.bg,
  page2: NIGHT.bg2,
  surface: NIGHT.surface,
  surface2: NIGHT.surface2,
  surfacealt: NIGHT.surface2,
  grayreadonly: NIGHT.bg2,
  line: NIGHT.border,
  border: NIGHT.border,
  linestrong: NIGHT.borderStrong,
  borderstrong: NIGHT.borderStrong,
  text: NIGHT.text,
  sub: NIGHT.textSub,
  labelink: NIGHT.textSub,
  textsecondary: NIGHT.textSub,
  muted: NIGHT.textMuted,
  bluesoft: TINT.blue,
  bluepale: TINT.blue,
  bluesoft2: TINT.blueStrong,
  bluepale2: TINT.blueStrong,
  greensoft: TINT.green,
  redsoft: TINT.red,
  orangesoft: TINT.amber,
  tealsoft: TINT.teal,
  // Accent text colours. On pale fills at night these have to become light, exactly as
  // --blue-dark does in the hub, or every tag and active tab goes unreadable.
  bluedark: '#7cc0f8',
  blueactive: '#7cc0f8',
}

/**
 * Elevation has to be restated rather than inherited. The day shadows are low-alpha slate
 * (rgba(34,53,72,.13)), which is invisible against a #0d1724 page — every card would sit
 * flat. These are the hub's night shadows.
 */
const VAR_SHADOWS = {
  shadow: '0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 20px -10px rgba(0, 0, 0, 0.5)',
  shadowhover: '0 2px 4px rgba(0, 0, 0, 0.35), 0 14px 30px -12px rgba(0, 0, 0, 0.55)',
}

/** The night value for a custom property declaration, or null to leave it as it is. */
export function mapVar(name, value) {
  const key = normaliseVar(name)
  if (key in VAR_SHADOWS) return VAR_SHADOWS[key]
  if (!parseColor(value)) return null // sizes, font stacks
  if (key in VAR_ROLES) return VAR_ROLES[key]
  // An unrecognised name is judged as a fill, which is what most of the remainder are.
  return mapColor('background', value)
}
