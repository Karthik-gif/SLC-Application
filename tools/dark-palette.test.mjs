import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NIGHT, hueFamily, mapColor, mapVar, normaliseVar, parseColor, toHsl } from './dark-palette.mjs'

test('parses the hex and rgb forms the legacy pages actually use', () => {
  assert.deepEqual(parseColor('#fff'), { r: 255, g: 255, b: 255, a: 1 })
  assert.deepEqual(parseColor('#ffffff'), { r: 255, g: 255, b: 255, a: 1 })
  assert.deepEqual(parseColor('#0a6ed1'), { r: 10, g: 110, b: 209, a: 1 })
  assert.equal(parseColor('rgba(0,0,0,.12)').a, 0.12)
  assert.equal(parseColor('8px'), null)
  assert.equal(parseColor('"72","Segoe UI",Arial,sans-serif'), null)
})

test('lightness is measured, not guessed', () => {
  assert.equal(Math.round(toHsl(parseColor('#fff')).l * 100), 100)
  assert.equal(Math.round(toHsl(parseColor('#1d2d3e')).l * 100), 18)
})

test('brand and status colours keep their identity at night', () => {
  // A saturated fill is the point of the component: a blue primary button stays blue.
  assert.equal(mapColor('background', '#0a6ed1'), null)
  assert.equal(mapColor('background', '#107e3e'), null)
  assert.equal(mapColor('border-left-color', '#107e3e'), null)
  assert.equal(mapColor('border-left-color', '#bb0000'), null)
})

test('white text on an accent fill is left alone', () => {
  // The regression this guards: inverting it makes every primary button read blank, since
  // the fill underneath it is deliberately unchanged.
  assert.equal(mapColor('color', '#fff'), null)
  assert.equal(mapColor('color', '#ffffff'), null)
})

test('navy ink is ink, not an accent', () => {
  // #1d2d3e is the body colour in 318 places and shares SAP blue's hue. Judged by hue alone
  // it reads as an accent and the whole page comes out a murky mid-blue.
  assert.equal(mapColor('color', '#1d2d3e'), NIGHT.text)
  assert.equal(mapColor('color', '#102a43'), NIGHT.text)
  assert.equal(mapColor('color', '#173f63'), NIGHT.text)
  assert.equal(mapColor('color', '#111'), NIGHT.text)
  assert.equal(mapColor('color', '#556b82'), NIGHT.textSub)
  assert.equal(mapColor('color', '#9aa7b4'), NIGHT.textMuted)
})

test('a genuine accent used as text is lifted clear of the surface', () => {
  const lifted = mapColor('color', '#0a6ed1')
  assert.notEqual(lifted, null)
  assert.ok(toHsl(parseColor(lifted)).l > 0.6, `${lifted} should be light enough to read`)
  assert.ok(toHsl(parseColor(lifted)).s > 0.4, `${lifted} should still look blue`)
})

test('cool greys are neutral but faint status tints are not', () => {
  // Both are ~10 points of chroma; only the hue separates a hairline from a confirmed row.
  assert.equal(hueFamily(210, 0.18, 9), 'neutral')
  assert.equal(hueFamily(120, 0.18, 10), 'green')
  assert.equal(mapColor('border', '#e1e6ea'), NIGHT.border)
  assert.notEqual(mapColor('background', '#ebf5eb'), NIGHT.surface2)
})

test('pale accent fills become dark tints of the same family', () => {
  assert.equal(mapColor('background', '#eaf3fc'), mapColor('background', '#d1e8ff'))
  for (const [pale, name] of [['#eaf3fc', 'blue'], ['#ebf5eb', 'green'], ['#fff4e5', 'amber']]) {
    const dark = mapColor('background', pale)
    assert.ok(dark, `${name} tint should map`)
    assert.ok(toHsl(parseColor(dark)).l < 0.3, `${name} tint ${dark} should be dark`)
  }
})

test('the page sits behind its cards, not in front of them', () => {
  // The scope root paints the page. If a near-white literal there became a card surface, the
  // panels on top of it would read as holes punched in the page.
  const page = mapColor('background', '#f5f7f9', { isScopeRoot: true })
  const card = mapColor('background', '#fff')
  assert.equal(page, NIGHT.bg)
  assert.ok(toHsl(parseColor(page)).l < toHsl(parseColor(card)).l, 'page must be darker than card')
})

test('a row hover stays distinguishable from the row beneath it', () => {
  assert.notEqual(mapColor('background', '#f7fbff'), mapColor('background', '#fff'))
})

test('translucent colours are left to compose themselves', () => {
  assert.equal(mapColor('box-shadow', 'rgba(0,0,0,.12)'), null)
  assert.equal(mapColor('background', 'rgba(29,45,62,.30)'), null)
})

test('an opaque glow ring follows the pale-fill rule', () => {
  assert.equal(mapColor('box-shadow', '#d9f3e2'), mapColor('background', '#d9f3e2'))
})

test('the four custom-property naming conventions collapse to one role', () => {
  assert.equal(normaliseVar('--blue-soft'), 'bluesoft')
  assert.equal(normaliseVar('--blueSoft'), 'bluesoft')
  assert.equal(normaliseVar('--ds-blue-soft'), 'bluesoft')
  assert.equal(mapVar('--surface', '#fff'), mapVar('--ds-surface', '#ffffff'))
  assert.equal(mapVar('--line', '#d5dadd'), mapVar('--ds-line', '#d5dadd'))
})

test('a property name beats its value when naming a role', () => {
  // --grayReadOnly and --surfaceAlt are both #f2f4f5; only one of them is a surface.
  assert.notEqual(mapVar('--grayReadOnly', '#f2f4f5'), mapVar('--surfaceAlt', '#f2f4f5'))
})

test('non-colour custom properties are untouched', () => {
  assert.equal(mapVar('--radius', '8px'), null)
  assert.equal(mapVar('--sidebar', '355px'), null)
  assert.equal(mapVar('--ds-font', '"72","Segoe UI",Arial,sans-serif'), null)
  assert.equal(mapVar('--header', '52px'), null)
})

test('elevation is restated, since a slate shadow vanishes on a dark page', () => {
  const shadow = mapVar('--shadow', '0 1px 3px rgba(34,53,72,.13)')
  assert.ok(shadow, 'shadow variables must be mapped, not inherited')
  assert.match(shadow, /rgba\(0, 0, 0/, 'night shadows should be black, not slate')
  assert.notEqual(mapVar('--shadowHover', '0 3px 10px rgba(34,53,72,.16)'), null)
})

test('accent text colours invert so they stay readable on pale fills', () => {
  // Same reasoning as --blue-dark in the hub: on a dark tint these have to become light.
  const blueDark = mapVar('--blueDark', '#085caf')
  assert.ok(toHsl(parseColor(blueDark)).l > 0.6, `${blueDark} should be light`)
})
