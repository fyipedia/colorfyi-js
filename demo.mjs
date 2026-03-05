import { getColorInfo, contrastRatio, harmonies } from './dist/index.js'

const C = { r: '\x1b[0m', b: '\x1b[1m', d: '\x1b[2m', y: '\x1b[33m', g: '\x1b[32m', c: '\x1b[36m', m: '\x1b[35m' }

// 1. Color info
const info = getColorInfo('#FF6B35')
console.log(`${C.b}${C.y}Color: #FF6B35${C.r}`)
console.log(`  ${C.c}RGB  ${C.r} rgb(${C.g}${info.rgb.r}${C.r}, ${C.g}${info.rgb.g}${C.r}, ${C.g}${info.rgb.b}${C.r})`)
console.log(`  ${C.c}HSL  ${C.r} hsl(${C.g}${info.hsl.h}°${C.r}, ${C.g}${info.hsl.s}%${C.r}, ${C.g}${info.hsl.l}%${C.r})`)
console.log(`  ${C.c}CMYK ${C.r} cmyk(${C.g}${info.cmyk.c}%${C.r}, ${C.g}${info.cmyk.m}%${C.r}, ${C.g}${info.cmyk.y}%${C.r}, ${C.g}${info.cmyk.k}%${C.r})`)
console.log(`  ${C.c}Warm ${C.r} ${info.isWarm ? `${C.g}Yes` : `${C.m}No`}${C.r}   ${C.c}Light${C.r} ${info.isLight ? `${C.g}Yes` : `${C.m}No`}${C.r}`)

console.log()

// 2. WCAG Contrast
const cr = contrastRatio('#1a1a2e', '#ffffff')
console.log(`${C.b}${C.y}Contrast: #1a1a2e vs #ffffff${C.r}`)
console.log(`  ${C.c}Ratio     ${C.r} ${C.b}${C.g}${cr.ratio}:1${C.r}`)
console.log(`  ${C.c}AA Normal ${C.r} ${cr.aaNormal ? `${C.g}PASS ✓` : `${C.m}FAIL ✗`}${C.r}`)
console.log(`  ${C.c}AAA Normal${C.r} ${cr.aaaNormal ? `${C.g}PASS ✓` : `${C.m}FAIL ✗`}${C.r}`)

console.log()

// 3. Harmonies
const h = harmonies('#FF6B35')
console.log(`${C.b}${C.y}Harmonies for #FF6B35${C.r}`)
console.log(`  ${C.c}Complementary${C.r}  ${h.complementary.map(c => `${C.g}#${c}`).join(`${C.d}, `)}${C.r}`)
console.log(`  ${C.c}Triadic${C.r}        ${h.triadic.map(c => `${C.g}#${c}`).join(`${C.d}, `)}${C.r}`)
console.log(`  ${C.c}Analogous${C.r}      ${h.analogous.map(c => `${C.g}#${c}`).join(`${C.d}, `)}${C.r}`)
