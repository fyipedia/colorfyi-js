# @fyipedia/colorfyi

[![npm](https://img.shields.io/npm/v/@fyipedia/colorfyi)](https://www.npmjs.com/package/@fyipedia/colorfyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/@fyipedia/colorfyi)

Pure TypeScript color engine for developers. Convert between 7 color spaces (hex, RGB, HSL, HSV, CMYK, CIE Lab, OKLCH), check [WCAG contrast ratios](https://colorfyi.com/tools/contrast-checker/), generate [color harmonies](https://colorfyi.com/tools/palette-generator/) and [Tailwind-style shades](https://colorfyi.com/tools/shade-generator/), simulate [color blindness](https://colorfyi.com/tools/color-blindness-simulator/), and create [smooth gradients](https://colorfyi.com/tools/gradient-generator/) -- all with zero dependencies.

Extracted from [ColorFYI](https://colorfyi.com/), a color reference platform with 809 named colors across 6 color systems (CSS, X11, Crayola, Pantone, RAL, NCS), 544 brand color palettes, and interactive tools used by developers and designers worldwide.

> **Try the interactive tools at [colorfyi.com](https://colorfyi.com/)** -- [color converter](https://colorfyi.com/tools/converter/), [contrast checker](https://colorfyi.com/tools/contrast-checker/), [palette generator](https://colorfyi.com/tools/palette-generator/), [shade generator](https://colorfyi.com/tools/shade-generator/), [color blindness simulator](https://colorfyi.com/tools/color-blindness-simulator/), and [gradient generator](https://colorfyi.com/tools/gradient-generator/).

<p align="center">
  <img src="demo.gif" alt="@fyipedia/colorfyi demo — color conversion, WCAG contrast, and harmonies" width="800">
</p>

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Color Space Conversion](#color-space-conversion)
  - [WCAG Contrast Checking](#wcag-contrast-checking)
  - [Color Harmonies](#color-harmonies)
  - [Tailwind-Style Shades](#tailwind-style-shades)
  - [Color Blindness Simulation](#color-blindness-simulation)
  - [Perceptual Color Comparison](#perceptual-color-comparison)
- [API Reference](#api-reference)
- [TypeScript Types](#typescript-types)
- [Features](#features)
- [Learn More About Color](#learn-more-about-color)
- [Also Available](#also-available)
- [FYIPedia Developer Tools](#fyipedia-developer-tools)
- [License](#license)

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

## What You Can Do

### Color Space Conversion

Convert between **7 color spaces** in a single call. Each space has different strengths:

| Color Space | Best For | Example |
|-------------|----------|---------|
| **Hex** | Web/CSS, shorthand notation | `#FF6B35` |
| **RGB** | Screen display, digital design | `rgb(255, 107, 53)` |
| **HSL** | Intuitive hue/saturation/lightness adjustments | `hsl(16, 100%, 60%)` |
| **HSV** | Color pickers (Photoshop, Figma) | `hsv(16, 79%, 100%)` |
| **CMYK** | Print design, physical media | `cmyk(0%, 58%, 79%, 0%)` |
| **CIE Lab** | Perceptually uniform comparisons, Delta E | `Lab(65.4, 42.1, 47.8)` |
| **OKLCH** | Modern CSS (`oklch()`), perceptual palettes | `oklch(0.685, 0.179, 42.9)` |

```typescript
import { getColorInfo } from "@fyipedia/colorfyi";

const info = getColorInfo("3B82F6");  // Tailwind Blue 500
console.log(info.rgb);    // { r: 59, g: 130, b: 246 }
console.log(info.hsl);    // { h: 217.2, s: 91.2, l: 59.8 }
console.log(info.oklch);  // { l: 0.623, c: 0.184, h: 259.1 }
```

Learn more: [Color Converter Tool](https://colorfyi.com/tools/converter/) · [What is OKLCH?](https://colorfyi.com/blog/oklch-color-space/) · [Color Space Guide](https://colorfyi.com/glossary/terms/color-space/)

### WCAG Contrast Checking

Test color pairs against [WCAG 2.1 accessibility guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html). The Web Content Accessibility Guidelines require a minimum contrast ratio of **4.5:1** for normal text (AA) and **7:1** for enhanced contrast (AAA).

```typescript
import { contrastRatio, textColorForBg } from "@fyipedia/colorfyi";

// Check if your color combination is accessible
const cr = contrastRatio("1E40AF", "FFFFFF");  // Dark blue on white
console.log(cr.ratio);       // 8.55
console.log(cr.aaNormal);   // true  (>= 4.5:1)
console.log(cr.aaLarge);    // true  (>= 3:1)
console.log(cr.aaaNormal);  // true  (>= 7:1)
console.log(cr.aaaLarge);   // true  (>= 4.5:1)

// Automatically pick black or white text for any background
const text = textColorForBg("FF6B35");  // -> "000000" (black text)
```

Learn more: [WCAG Contrast Checker](https://colorfyi.com/tools/contrast-checker/) · [Contrast Ratio Guide](https://colorfyi.com/glossary/terms/contrast-ratio/)

### Color Harmonies

Generate aesthetically pleasing color combinations based on **color wheel theory**. Five harmony types cover different design needs:

| Harmony | Description | Use Case |
|---------|-------------|----------|
| **Complementary** | Opposite on the color wheel | High contrast, bold designs |
| **Analogous** | Adjacent colors (+/-30 degrees) | Cohesive, harmonious palettes |
| **Triadic** | Three evenly spaced (120 degrees) | Vibrant, balanced layouts |
| **Split-complementary** | Complement + neighbors | Softer contrast than complementary |
| **Tetradic** | Four colors (rectangle) | Rich, complex color schemes |

```typescript
import { harmonies } from "@fyipedia/colorfyi";

const h = harmonies("FF6B35");
console.log(h.complementary);        // ["35C0FF"]
console.log(h.analogous);            // ["FF3535", "FFA135"]
console.log(h.triadic);              // ["6B35FF", "35FF6B"]
console.log(h.splitComplementary);   // ["3565FF", "35FFA1"]
console.log(h.tetradic);             // ["C035FF", "35FF6B", "35C0FF"]
```

Learn more: [Palette Generator](https://colorfyi.com/tools/palette-generator/) · [Color Harmony Guide](https://colorfyi.com/glossary/terms/color-harmony/)

### Tailwind-Style Shades

Generate a full 50-950 shade scale from any base color, matching Tailwind CSS conventions. Essential for building design systems and consistent UI themes.

```typescript
import { generateShades } from "@fyipedia/colorfyi";

const shades = generateShades("3B82F6");  // Generate shades from Tailwind Blue 500
// shade.level: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
for (const shade of shades) {
  console.log(`${shade.level}: #${shade.hex}`);
}
```

Learn more: [Shade Generator](https://colorfyi.com/tools/shade-generator/) · [Tailwind CSS Colors](https://colorfyi.com/collections/tailwind-css/)

### Color Blindness Simulation

Approximately **8% of men and 0.5% of women** have some form of color vision deficiency (CVD). Simulate how your colors appear to users with different types of color blindness using Vienot transformation matrices.

```typescript
import { simulateColorBlindness } from "@fyipedia/colorfyi";

const cb = simulateColorBlindness("FF6B35");
console.log(cb.protanopia);     // Red-blind (~1% of men)
console.log(cb.deuteranopia);   // Green-blind (~6% of men, most common)
console.log(cb.tritanopia);     // Blue-blind (rare, ~0.01%)
console.log(cb.achromatopsia);  // Total color blindness (monochromacy)
```

Learn more: [Color Blindness Simulator](https://colorfyi.com/tools/color-blindness-simulator/) · [Color Vision Deficiency Guide](https://colorfyi.com/glossary/terms/color-blindness/)

### Perceptual Color Comparison

Compare colors using **CIE76 Delta E** -- a metric designed to match human perception. Unlike simple RGB distance, Delta E accounts for how our eyes actually perceive color differences.

| Delta E | Perception |
|---------|-----------|
| 0-1 | Not perceptible |
| 1-2 | Barely perceptible |
| 2-10 | Perceptible at close look |
| 10-50 | Clearly different |
| 50+ | Very different |

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

Learn more: [Gradient Generator](https://colorfyi.com/tools/gradient-generator/) · [Delta E Explained](https://colorfyi.com/glossary/terms/delta-e/)

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

## Learn More About Color

- **Tools**: [Color Converter](https://colorfyi.com/tools/converter/) · [Contrast Checker](https://colorfyi.com/tools/contrast-checker/) · [Palette Generator](https://colorfyi.com/tools/palette-generator/) · [Shade Generator](https://colorfyi.com/tools/shade-generator/) · [Blindness Simulator](https://colorfyi.com/tools/color-blindness-simulator/) · [Gradient Generator](https://colorfyi.com/tools/gradient-generator/)
- **Color Systems**: [CSS Named Colors](https://colorfyi.com/color/named/?source=css) · [Pantone Colors](https://colorfyi.com/collections/pantone/) · [Tailwind Colors](https://colorfyi.com/collections/tailwind-css/) · [RAL Colors](https://colorfyi.com/collections/ral-classic/)
- **Brand Colors**: [544 Brand Palettes](https://colorfyi.com/brands/) · [Google](https://colorfyi.com/brands/google/) · [Apple](https://colorfyi.com/brands/apple/) · [Meta](https://colorfyi.com/brands/meta/)
- **Guides**: [Color Theory Glossary](https://colorfyi.com/glossary/) · [Blog](https://colorfyi.com/blog/)
- **API**: [REST API Docs](https://colorfyi.com/developers/) · [OpenAPI Spec](https://colorfyi.com/api/openapi.json)
- **Python**: [PyPI Package](https://pypi.org/project/colorfyi/) · [Python Quick Start](https://pypi.org/project/colorfyi/#quick-start)

## Also Available

| Platform | Install | Link |
|----------|---------|------|
| **PyPI** | `pip install colorfyi` | [PyPI](https://pypi.org/project/colorfyi/) |
| **Homebrew** | `brew tap fyipedia/tap && brew install fyipedia` | [Tap](https://github.com/fyipedia/homebrew-tap) |
| **MCP** | `uvx --from "colorfyi[mcp]" python -m colorfyi.mcp_server` | [Config](https://pypi.org/project/colorfyi/#mcp-server-claude-cursor-windsurf) |
| **VSCode** | `ext install fyipedia.colorfyi-vscode` | [Marketplace](https://marketplace.visualstudio.com/items?itemName=fyipedia.colorfyi-vscode) |

## FYIPedia Developer Tools

Part of the [FYIPedia](https://fyipedia.com) open-source developer tools ecosystem.

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| **colorfyi** | [PyPI](https://pypi.org/project/colorfyi/) | [npm](https://www.npmjs.com/package/@fyipedia/colorfyi) | Color conversion, WCAG contrast, harmonies -- [colorfyi.com](https://colorfyi.com/) |
| emojifyi | [PyPI](https://pypi.org/project/emojifyi/) | [npm](https://www.npmjs.com/package/emojifyi) | Emoji encoding & metadata for 3,953 emojis -- [emojifyi.com](https://emojifyi.com/) |
| symbolfyi | [PyPI](https://pypi.org/project/symbolfyi/) | [npm](https://www.npmjs.com/package/symbolfyi) | Symbol encoding in 11 formats -- [symbolfyi.com](https://symbolfyi.com/) |
| unicodefyi | [PyPI](https://pypi.org/project/unicodefyi/) | [npm](https://www.npmjs.com/package/unicodefyi) | Unicode lookup with 17 encodings -- [unicodefyi.com](https://unicodefyi.com/) |
| fontfyi | [PyPI](https://pypi.org/project/fontfyi/) | [npm](https://www.npmjs.com/package/fontfyi) | Google Fonts metadata & CSS -- [fontfyi.com](https://fontfyi.com/) |
| distancefyi | [PyPI](https://pypi.org/project/distancefyi/) | [npm](https://www.npmjs.com/package/distancefyi) | Haversine distance & travel times -- [distancefyi.com](https://distancefyi.com/) |
| timefyi | [PyPI](https://pypi.org/project/timefyi/) | [npm](https://www.npmjs.com/package/timefyi) | Timezone ops & business hours -- [timefyi.com](https://timefyi.com/) |
| namefyi | [PyPI](https://pypi.org/project/namefyi/) | [npm](https://www.npmjs.com/package/namefyi) | Korean romanization & Five Elements -- [namefyi.com](https://namefyi.com/) |
| unitfyi | [PyPI](https://pypi.org/project/unitfyi/) | [npm](https://www.npmjs.com/package/unitfyi) | Unit conversion, 220 units -- [unitfyi.com](https://unitfyi.com/) |
| holidayfyi | [PyPI](https://pypi.org/project/holidayfyi/) | [npm](https://www.npmjs.com/package/holidayfyi) | Holiday dates & Easter calculation -- [holidayfyi.com](https://holidayfyi.com/) |
| cocktailfyi | [PyPI](https://pypi.org/project/cocktailfyi/) | -- | Cocktail ABV, calories, flavor -- [cocktailfyi.com](https://cocktailfyi.com/) |
| fyipedia | [PyPI](https://pypi.org/project/fyipedia/) | -- | Unified CLI: `fyi color info FF6B35` -- [fyipedia.com](https://fyipedia.com/) |
| fyipedia-mcp | [PyPI](https://pypi.org/project/fyipedia-mcp/) | -- | Unified MCP hub for AI assistants -- [fyipedia.com](https://fyipedia.com/) |

## License

MIT
