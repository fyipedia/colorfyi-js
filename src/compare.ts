/**
 * Color comparison, mixing, and gradient generation.
 *
 * Uses CIE Lab color space for perceptually uniform operations.
 */

import type { CompareResult } from "./types.js";
import { hexToRgb, rgbToHex, rgbToLab, labToRgb } from "./engine.js";
import { contrastRatio } from "./contrast.js";

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

/** Categorize Delta E into human-readable description. */
function deltaECategory(de: number): string {
  if (de < 1.0) return "Identical";
  if (de < 5.0) return "Similar";
  if (de < 25.0) return "Noticeable";
  return "Very Different";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * CIE76 Delta E -- perceptual color difference.
 *
 * Returns 0.0 for identical colors, typically up to ~100 for maximally different.
 *
 * @example
 * deltaE("FF6B35", "3498DB") // ~55
 */
export function deltaE(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  const d = Math.sqrt(
    (lab1.l - lab2.l) ** 2 + (lab1.a - lab2.a) ** 2 + (lab1.b - lab2.b) ** 2
  );
  return Math.round(d * 100) / 100;
}

/**
 * Mix two colors in CIE Lab space (perceptually uniform).
 *
 * @param hex1 First color hex
 * @param hex2 Second color hex
 * @param ratio Mix ratio: 0.0 = all hex1, 1.0 = all hex2, 0.5 = equal mix
 * @returns Mixed color as uppercase hex string
 *
 * @example
 * mixColors("FF0000", "0000FF")      // purple-ish
 * mixColors("FF0000", "0000FF", 0.25) // more red
 */
export function mixColors(hex1: string, hex2: string, ratio = 0.5): string {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  const l = lab1.l + (lab2.l - lab1.l) * ratio;
  const a = lab1.a + (lab2.a - lab1.a) * ratio;
  const b = lab1.b + (lab2.b - lab1.b) * ratio;

  const rgb = labToRgb(l, a, b);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Generate a smooth gradient by interpolating in CIE Lab space.
 *
 * Lab interpolation produces perceptually smoother gradients than RGB.
 *
 * @param hex1 Start color
 * @param hex2 End color
 * @param steps Number of gradient steps (default 7)
 * @returns Array of hex color strings
 *
 * @example
 * gradientSteps("FF0000", "0000FF", 5) // ["FF0000", ..., "0000FF"]
 */
export function gradientSteps(hex1: string, hex2: string, steps = 7): string[] {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  const result: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps > 1 ? i / (steps - 1) : 0.5;
    const l = lab1.l + (lab2.l - lab1.l) * t;
    const a = lab1.a + (lab2.a - lab1.a) * t;
    const b = lab1.b + (lab2.b - lab1.b) * t;
    const rgb = labToRgb(l, a, b);
    result.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  return result;
}

/**
 * Full comparison of two colors.
 *
 * Returns contrast ratio, Delta E, 50:50 mix, and 7-step gradient.
 *
 * @example
 * const cmp = compareColors("FF6B35", "3498DB");
 * console.log(cmp.contrast.ratio); // contrast ratio
 * console.log(cmp.deltaE);         // perceptual distance
 * console.log(cmp.mixed);          // 50:50 mix hex
 */
export function compareColors(hex1: string, hex2: string): CompareResult {
  const cr = contrastRatio(hex1, hex2);
  const de = deltaE(hex1, hex2);
  const mixed = mixColors(hex1, hex2, 0.5);
  const gradient = gradientSteps(hex1, hex2, 7);

  return {
    contrast: cr,
    deltaE: de,
    deltaECategory: deltaECategory(de),
    mixed,
    gradient,
  };
}
