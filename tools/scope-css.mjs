// Extracts a legacy page's <style> block and scopes every selector under a root class so
// several apps' original stylesheets can coexist in one SPA. Declarations are never touched.
//
// node scope-css.mjs <legacy.html> <scopeClass> <out.css> [keyframePrefix]
import { readFileSync, writeFileSync } from 'node:fs'

const [file, scope, out, kfPrefix = scope.replace(/^\./, '') + '-'] = process.argv.slice(2)
const html = readFileSync(file, 'utf8')

const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')
if (!styles.trim()) throw new Error('no <style> block found in ' + file)

const keyframeNames = [...styles.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1])

function scopeSelector(sel) {
  return sel
    .split(',')
    .map((raw) => {
      const s = raw.trim()
      if (!s) return s
      // The variable block and the body rule both become the scope root itself.
      if (s === ':root' || s === 'html' || s === 'body' || s === 'html,body') return scope
      // Universal reset must also cover the root element, not just its descendants.
      if (s === '*' || s === '*::before' || s === '*::after') return `${scope} ${s}, ${scope}`
      // Pseudo-elements that attach to the scrollbar have no element of their own.
      if (s.startsWith('::')) return `${scope} ${s}`
      return `${scope} ${s}`
    })
    .join(', ')
}

/** Selector lists can repeat the scope root after expansion; emit each part once. */
function dedupe(selectorList) {
  const seen = new Set()
  return selectorList
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && !seen.has(s) && seen.add(s))
    .join(', ')
}

// Splits top-level rules, keeping @media/@keyframes blocks intact.
function splitRules(css) {
  const rules = []
  let depth = 0
  let start = 0
  for (let i = 0; i < css.length; i++) {
    const c = css[i]
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        rules.push(css.slice(start, i + 1))
        start = i + 1
      }
    }
  }
  return rules.map((r) => r.trim()).filter(Boolean)
}

function transform(css) {
  return splitRules(css)
    .map((rule) => {
      const open = rule.indexOf('{')
      const rawPrelude = rule.slice(0, open)
      const body = rule.slice(open + 1, rule.lastIndexOf('}'))

      // A comment sitting before a selector is not part of it. It must be lifted out before
      // anything else: comment text routinely contains commas, and splitting the prelude on
      // commas with the comment still attached shatters the selector into fragments — which
      // silently breaks that rule and every declaration in it.
      const comments = rawPrelude.match(/\/\*[\s\S]*?\*\//g) ?? []
      const prelude = rawPrelude.replace(/\/\*[\s\S]*?\*\//g, '').trim()
      const keptComments = comments.length ? `${comments.join('\n')}\n` : ''

      if (!prelude) return keptComments.trim()

      if (prelude.startsWith('@keyframes')) {
        // Hoisted unchanged but renamed: keyframe names are global and would collide.
        const name = prelude.replace(/@keyframes\s+/, '').trim()
        return `${keptComments}@keyframes ${kfPrefix}${name} {${body}}`
      }
      if (prelude.startsWith('@media')) {
        return `${prelude} {\n${transform(body)}\n}`
      }
      if (prelude.startsWith('@')) return `${keptComments}${prelude} {${body}}`
      return `${keptComments}${dedupe(scopeSelector(prelude))} {${body}}`
    })
    .join('\n')
}

let result = transform(styles)

// Point animation: declarations at the renamed keyframes.
for (const name of keyframeNames) {
  result = result.replace(
    new RegExp(`(animation\\s*:[^;}]*?)\\b${name}\\b`, 'g'),
    `$1${kfPrefix}${name}`,
  )
}

const header = `/* Original stylesheet of ${file.split(/[\\/]/).pop()}, scoped under ${scope}.
 * Generated — every declaration is byte-identical to the legacy page; only selectors are
 * prefixed and @keyframes renamed, so each converted app keeps its exact original look
 * while several can coexist in one SPA. Do not hand-edit; re-run tools/scope-css.mjs.
 */\n`

writeFileSync(out, header + result + '\n')
console.log(`${out}: ${result.split('\n').length} rules scoped under ${scope}`)
