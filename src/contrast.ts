/**
 * WCAG 2.1 contrast ratio, relative luminance, and text color selection.
 *
 * Pure functions, zero dependencies.
 */

import type { ContrastResult } from "./types.js";
import { hexToRgb } from "./engine.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** sRGB gamma linearization (0-1 input, 0-1 output). */
function linearize(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate relative luminance per WCAG 2.1.
 *
 * @param r Red channel 0-255
 * @param g Green channel 0-255
 * @param b Blue channel 0-255
 * @returns Luminance between 0 (black) and 1 (white)
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * linearize(r / 255) +
    0.7152 * linearize(g / 255) +
    0.0722 * linearize(b / 255)
  );
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors.
 *
 * Returns the ratio and AA/AAA compliance flags for normal and large text.
 *
 * @example
 * contrastRatio("000000", "FFFFFF") // { ratio: 21, aaNormal: true, ... }
 */
export function contrastRatio(hex1: string, hex2: string): ContrastResult {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  const rounded = Math.round(ratio * 100) / 100;

  return {
    ratio: rounded,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

/**
 * Return the best text color (black or white) for a given background.
 *
 * Returns "000000" for light backgrounds, "FFFFFF" for dark backgrounds.
 *
 * @example
 * textColorForBg("FF6B35") // "FFFFFF"
 * textColorForBg("F0F0F0") // "000000"
 */
export function textColorForBg(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const lum = relativeLuminance(r, g, b);
  return lum < 0.179 ? "FFFFFF" : "000000";
}
