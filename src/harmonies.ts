/**
 * Color harmonies -- hue rotation in HSL space.
 *
 * Generates complementary, analogous, triadic, split-complementary,
 * and tetradic color schemes from any hex color.
 */

import type { HarmonySet } from "./types.js";
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from "./engine.js";

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

/** Rotate hue by degrees and return hex. */
function rotateHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newH = ((hsl.h + degrees) % 360 + 360) % 360;
  const newRgb = hslToRgb(newH, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return complementary color (180 degree rotation).
 *
 * @example
 * complementary("FF6B35") // ["35C0FF"]
 */
export function complementary(hex: string): string[] {
  return [rotateHue(hex, 180)];
}

/**
 * Return 2 analogous colors (30 degrees each side).
 *
 * @example
 * analogous("FF6B35") // ["FF3535", "FFA135"]
 */
export function analogous(hex: string): string[] {
  return [rotateHue(hex, -30), rotateHue(hex, 30)];
}

/**
 * Return 2 triadic colors (120 degrees apart).
 *
 * @example
 * triadic("FF6B35") // ["6B35FF", "35FF6B"]
 */
export function triadic(hex: string): string[] {
  return [rotateHue(hex, 120), rotateHue(hex, 240)];
}

/**
 * Return 2 split-complementary colors (150 and 210 degrees).
 */
export function splitComplementary(hex: string): string[] {
  return [rotateHue(hex, 150), rotateHue(hex, 210)];
}

/**
 * Return 3 tetradic colors (90, 180, 270 degrees).
 */
export function tetradic(hex: string): string[] {
  return [rotateHue(hex, 90), rotateHue(hex, 180), rotateHue(hex, 270)];
}

/**
 * Get all 5 harmony types for a color.
 *
 * @example
 * const h = harmonies("FF6B35");
 * console.log(h.complementary); // ["35C0FF"]
 * console.log(h.triadic);       // ["6B35FF", "35FF6B"]
 */
export function harmonies(hex: string): HarmonySet {
  return {
    complementary: complementary(hex),
    analogous: analogous(hex),
    triadic: triadic(hex),
    splitComplementary: splitComplementary(hex),
    tetradic: tetradic(hex),
  };
}
