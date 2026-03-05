# @fyipedia/colorfyi

[![npm](https://img.shields.io/npm/v/@fyipedia/colorfyi)](https://www.npmjs.com/package/@fyipedia/colorfyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/@fyipedia/colorfyi)

Pure TypeScript color engine for developers. Convert between 7 color spaces (hex, RGB, HSL, HSV, CMYK, CIE Lab, OKLCH), check [WCAG contrast ratios](https://colorfyi.com/tools/contrast-checker/), generate [color harmonies](https://colorfyi.com/tools/palette-generator/) and [Tailwind-style shades](https://colorfyi.com/tools/shade-generator/), simulate [color blindness](https://colorfyi.com/tools/color-blindness-simulator/), and create [smooth gradients](https://colorfyi.com/tools/gradient-generator/) -- all with zero dependencies.

> **Try the interactive tools at [colorfyi.com](https://colorfyi.com/)** -- [color converter](https://colorfyi.com/tools/converter/), [contrast checker](https://colorfyi.com/tools/contrast-checker/), [palette generator](https://colorfyi.com/tools/palette-generator/), [shade generator](https://colorfyi.com/tools/shade-generator/), [color blindness simulator](https://colorfyi.com/tools/color-blindness-simulator/), and [gradient generator](https://colorfyi.com/tools/gradient-generator/).

## Install

```bash
npm install @fyipedia/colorfyi
```

Works in Node.js, Deno, Bun, and browsers (ESM).

## Quick Start

```typescript
import { getColorInfo, contrastRatio, harmonies, generateShades } from "@fyipedia/colorfyi";

// Convert any hex color to 7 color spaces instantly
const info = getColorInfo("FF6B35");
console.log(info.rgb);    // { r: 255, g: 107, b: 53 }
console.log(info.hsl);    // { h: 16, s: 100, l: 60.4 }
console.log(info.cmyk);   // { c: 0, m: 58, y: 79.2, k: 0 }
console.log(info.oklch);  // { l: 0.685, c: 0.179, h: 42.9 }

// WCAG 2.1 contrast ratio with AA/AAA compliance checks
const cr = contrastRatio("FF6B35", "FFFFFF");
console.log(cr.ratio);      // 3.38
console.log(cr.aaLarge);    // true
console.log(cr.aaaNormal);  // false

// Generate all 5 harmony types at once
const h = harmonies("FF6B35");
console.log(h.complementary);       // ["35C0FF"]
console.log(h.analogous);           // ["FF3535", "FFA135"]
console.log(h.triadic);             // ["6B35FF", "35FF6B"]

// Tailwind-style shade palette (50-950)
const shades = generateShades("3498DB");
for (const shade of shades) {
  console.log(`${shade.level}: #${shade.hex}`);
}
```

## Color Blindness Simulation

```typescript
import { simulateColorBlindness } from "@fyipedia/colorfyi";

// Simulate how 8% of men experience your color choices
const cb = simulateColorBlindness("FF6B35");
console.log(cb.protanopia);     // Red-blind simulation
console.log(cb.deuteranopia);   // Green-blind simulation
console.log(cb.tritanopia);     // Blue-blind simulation
console.log(cb.achromatopsia);  // Total color blindness
```

## Perceptual Color Comparison

```typescript
import { compareColors, mixColors, gradientSteps } from "@fyipedia/colorfyi";

// CIE76 Delta E perceptual distance
const cmp = compareColors("FF6B35", "3498DB");
console.log(cmp.deltaE);           // 55.4
console.log(cmp.deltaECategory);   // "Very Different"

// Mix colors in Lab space (perceptually uniform)
const mixed = mixColors("FF0000", "0000FF", 0.5);

// Smooth gradient with perceptual interpolation
const colors = gradientSteps("FF6B35", "3498DB", 7);
```

## API Reference

### Color Conversion

| Function | Description |
|----------|-------------|
| `hexToRgb(hex) -> RGB` | HEX to RGB |
| `rgbToHex(r, g, b) -> string` | RGB to HEX |
| `rgbToHsl(r, g, b) -> HSL` | RGB to HSL |
| `hslToRgb(h, s, l) -> RGB` | HSL to RGB |
| `rgbToHsv(r, g, b) -> HSV` | RGB to HSV |
| `rgbToCmyk(r, g, b) -> CMYK` | RGB to CMYK |
| `rgbToLab(r, g, b) -> Lab` | RGB to CIE Lab |
| `labToRgb(l, a, b) -> RGB` | CIE Lab to RGB |
| `rgbToOklch(r, g, b) -> OKLCH` | RGB to OKLCH |
| `getColorInfo(hex) -> ColorInfo` | All 7 color spaces at once |

### WCAG Contrast

| Function | Description |
|----------|-------------|
| `contrastRatio(hex1, hex2) -> ContrastResult` | WCAG 2.1 contrast ratio + AA/AAA checks |
| `relativeLuminance(r, g, b) -> number` | Relative luminance (0-1) |
| `textColorForBg(hex) -> string` | Best text color (black or white) for a background |

### Harmonies & Palettes

| Function | Description |
|----------|-------------|
| `harmonies(hex) -> HarmonySet` | All 5 harmony types |
| `complementary(hex) -> string[]` | Complementary colors |
| `analogous(hex) -> string[]` | Analogous colors |
| `triadic(hex) -> string[]` | Triadic colors |
| `splitComplementary(hex) -> string[]` | Split-complementary |
| `tetradic(hex) -> string[]` | Tetradic (rectangular) |

### Shades

| Function | Description |
|----------|-------------|
| `generateShades(hex) -> ShadeStep[]` | Tailwind-style 50-950 |

### Comparison & Mixing

| Function | Description |
|----------|-------------|
| `deltaE(hex1, hex2) -> number` | CIE76 perceptual distance |
| `compareColors(hex1, hex2) -> CompareResult` | Full comparison report |
| `mixColors(hex1, hex2, ratio?) -> string` | Perceptual mixing in Lab space |
| `gradientSteps(hex1, hex2, steps?) -> string[]` | Smooth gradient |
| `simulateColorBlindness(hex) -> ColorBlindResult` | 4 types of CVD simulation |

## TypeScript Types

```typescript
import type {
  RGB, HSL, HSV, CMYK, Lab, OKLCH,
  ColorInfo, ContrastResult, HarmonySet,
  ShadeStep, ColorBlindResult, CompareResult,
} from "@fyipedia/colorfyi";
```

## Features

- **7 color spaces**: RGB, HSL, HSV, CMYK, CIE Lab, OKLCH, Hex
- **WCAG 2.1 contrast**: AA/AAA compliance checks for normal and large text
- **Color harmonies**: complementary, analogous, triadic, split-complementary, tetradic
- **Shade generation**: Tailwind-style 50-950 scale
- **Color blindness simulation**: protanopia, deuteranopia, tritanopia, achromatopsia (Vienot matrices)
- **Perceptual comparison**: CIE76 Delta E, Lab-space gradients and mixing
- **Zero dependencies**: Pure TypeScript, no runtime deps
- **Type-safe**: Full TypeScript with strict mode
- **Tree-shakeable**: ESM with named exports
- **Fast**: All computations under 1ms

## Also Available for Python

```bash
pip install colorfyi
```

See the [Python package on PyPI](https://pypi.org/project/colorfyi/).

## FYIPedia Developer Tools

Part of the [FYIPedia](https://github.com/fyipedia) open-source developer tools ecosystem:

| Package | Description |
|---------|-------------|
| **colorfyi** | [Hex to RGB converter](https://colorfyi.com/tools/converter/), [WCAG contrast checker](https://colorfyi.com/tools/contrast-checker/), [color harmonies](https://colorfyi.com/tools/palette-generator/) |
| [emojifyi](https://emojifyi.com/) | [Emoji encoding](https://emojifyi.com/developers/) & metadata for 3,781 Unicode emojis |
| [symbolfyi](https://symbolfyi.com/) | [Symbol encoder](https://symbolfyi.com/developers/) -- 11 encoding formats for any character |
| [unicodefyi](https://unicodefyi.com/) | [Unicode character lookup](https://unicodefyi.com/developers/) -- 17 encodings + character search |
| [fontfyi](https://fontfyi.com/) | [Google Fonts explorer](https://fontfyi.com/developers/) -- metadata, CSS helpers, font pairings |
| [distancefyi](https://www.npmjs.com/package/distancefyi) | Haversine distance, bearing, travel times -- [distancefyi.com](https://distancefyi.com/) |
| [timefyi](https://www.npmjs.com/package/timefyi) | Timezone operations, time differences -- [timefyi.com](https://timefyi.com/) |
| [namefyi](https://www.npmjs.com/package/namefyi) | Korean romanization, Five Elements -- [namefyi.com](https://namefyi.com/) |
| [unitfyi](https://www.npmjs.com/package/unitfyi) | Unit conversion, 200 units, 20 categories -- [unitfyi.com](https://unitfyi.com/) |
| [holidayfyi](https://www.npmjs.com/package/holidayfyi) | Holiday dates, Easter calculation -- [holidayfyi.com](https://holidayfyi.com/) |

## Links

- [Interactive Color Converter](https://colorfyi.com/tools/converter/) -- Convert hex, RGB, HSL, CMYK, OKLCH
- [WCAG Contrast Checker](https://colorfyi.com/tools/contrast-checker/) -- Test color accessibility
- [Palette Generator](https://colorfyi.com/tools/palette-generator/) -- Create color harmonies
- [Shade Generator](https://colorfyi.com/tools/shade-generator/) -- Tailwind-style shade palettes
- [Color Blindness Simulator](https://colorfyi.com/tools/color-blindness-simulator/) -- Test for color vision deficiency
- [Gradient Generator](https://colorfyi.com/tools/gradient-generator/) -- Create smooth CSS gradients
- [REST API Documentation](https://colorfyi.com/developers/) -- Free API with OpenAPI spec
- [Python Package](https://pypi.org/project/colorfyi/) -- Same engine, Python version
- [Source Code](https://github.com/fyipedia/colorfyi-js) -- MIT licensed

## License

MIT
