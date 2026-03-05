/**
 * colorfyi -- Pure TypeScript color engine for developers.
 *
 * Convert between 7 color spaces (hex, RGB, HSL, HSV, CMYK, CIE Lab, OKLCH),
 * check WCAG contrast ratios, generate color harmonies and Tailwind-style
 * shades, simulate color blindness, and create smooth gradients.
 *
 * Zero dependencies. Works in Node.js, Deno, Bun, and browsers.
 *
 * @example
 * ```ts
 * import { getColorInfo, contrastRatio, harmonies } from "@fyipedia/colorfyi";
 *
 * const info = getColorInfo("FF6B35");
 * console.log(info.rgb);  // { r: 255, g: 107, b: 53 }
 *
 * const cr = contrastRatio("FF6B35", "FFFFFF");
 * console.log(cr.ratio);  // 3.38
 *
 * const h = harmonies("FF6B35");
 * console.log(h.complementary); // ["35C0FF"]
 * ```
 *
 * @packageDocumentation
 */

// Types
export type {
  RGB,
  HSL,
  HSV,
  CMYK,
  Lab,
  OKLCH,
  ColorInfo,
  ContrastResult,
  HarmonySet,
  ShadeStep,
  ColorBlindResult,
  CompareResult,
} from "./types.js";

// Engine -- color conversions
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  rgbToLab,
  labToRgb,
  rgbToOklch,
  getColorInfo,
} from "./engine.js";

// Contrast -- WCAG 2.1
export {
  relativeLuminance,
  contrastRatio,
  textColorForBg,
} from "./contrast.js";

// Harmonies -- hue rotation
export {
  complementary,
  analogous,
  triadic,
  splitComplementary,
  tetradic,
  harmonies,
} from "./harmonies.js";

// Shades -- Tailwind-style palette
export { SHADE_LEVELS, generateShades } from "./shades.js";

// Color blindness simulation
export { simulateColorBlindness } from "./blindness.js";

// Comparison & mixing
export {
  deltaE,
  mixColors,
  gradientSteps,
  compareColors,
} from "./compare.js";
