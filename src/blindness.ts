/**
 * Color blindness simulation using Vienot et al. (1999) matrices.
 *
 * Simulates protanopia (red-blind), deuteranopia (green-blind),
 * tritanopia (blue-blind), and achromatopsia (total color blindness).
 */

import type { RGB, ColorBlindResult } from "./types.js";
import { hexToRgb, rgbToHex } from "./engine.js";

// ---------------------------------------------------------------------------
// Vienot simulation matrices (3x3, applied to sRGB 0-255)
// ---------------------------------------------------------------------------

type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

const PROTANOPIA_MATRIX: Matrix3x3 = [
  [0.56667, 0.43333, 0.0],
  [0.55833, 0.44167, 0.0],
  [0.0, 0.24167, 0.75833],
];

const DEUTERANOPIA_MATRIX: Matrix3x3 = [
  [0.625, 0.375, 0.0],
  [0.7, 0.3, 0.0],
  [0.0, 0.3, 0.7],
];

const TRITANOPIA_MATRIX: Matrix3x3 = [
  [0.95, 0.05, 0.0],
  [0.0, 0.43333, 0.56667],
  [0.0, 0.475, 0.525],
];

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

/** Apply a 3x3 color transformation matrix to RGB values. */
function applyMatrix(r: number, g: number, b: number, matrix: Matrix3x3): RGB {
  const nr = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const ng = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const nb = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  return {
    r: Math.max(0, Math.min(255, Math.round(nr))),
    g: Math.max(0, Math.min(255, Math.round(ng))),
    b: Math.max(0, Math.min(255, Math.round(nb))),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Simulate how a color appears under 4 types of color blindness.
 *
 * Uses Vienot et al. (1999) simulation matrices for dichromatic vision.
 * Achromatopsia uses WCAG luminance weights.
 *
 * @example
 * const cb = simulateColorBlindness("FF6B35");
 * console.log(cb.protanopia);     // simulated hex for red-blind
 * console.log(cb.deuteranopia);   // simulated hex for green-blind
 * console.log(cb.tritanopia);     // simulated hex for blue-blind
 * console.log(cb.achromatopsia);  // grayscale
 */
export function simulateColorBlindness(hex: string): ColorBlindResult {
  const rgb = hexToRgb(hex);
  const { r, g, b } = rgb;

  const proto = applyMatrix(r, g, b, PROTANOPIA_MATRIX);
  const deuter = applyMatrix(r, g, b, DEUTERANOPIA_MATRIX);
  const trit = applyMatrix(r, g, b, TRITANOPIA_MATRIX);

  // Achromatopsia: use luminance formula
  const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

  return {
    original: hex.replace(/^#/, "").toUpperCase(),
    protanopia: rgbToHex(proto.r, proto.g, proto.b),
    deuteranopia: rgbToHex(deuter.r, deuter.g, deuter.b),
    tritanopia: rgbToHex(trit.r, trit.g, trit.b),
    achromatopsia: rgbToHex(gray, gray, gray),
  };
}
