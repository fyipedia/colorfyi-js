/**
 * Tailwind-style shade generation.
 *
 * Generates an 11-step shade scale (50-950) from a base color,
 * with 500 closest to the input color.
 */

import type { ShadeStep } from "./types.js";
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from "./engine.js";

/** Standard Tailwind shade levels. */
export const SHADE_LEVELS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** Lightness targets for each Tailwind shade level. */
const LIGHTNESS_MAP: Record<number, number> = {
  50: 97,
  100: 93,
  200: 86,
  300: 76,
  400: 63,
  500: 50,
  600: 40,
  700: 32,
  800: 25,
  900: 19,
  950: 12,
};

/**
 * Generate a Tailwind-style shade palette (50-950) from a base color.
 *
 * The base color is placed at level 500. Lighter shades increase lightness
 * toward white; darker shades decrease toward black. Saturation is slightly
 * reduced at the extremes for more natural results.
 *
 * @example
 * const shades = generateShades("3498DB");
 * shades.forEach(s => console.log(`${s.level}: #${s.hex}`));
 */
export function generateShades(hex: string): ShadeStep[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const { h, s } = hsl;

  const shades: ShadeStep[] = [];

  for (const level of SHADE_LEVELS) {
    const targetL = LIGHTNESS_MAP[level];

    let satFactor = 1.0;
    if (level <= 100) {
      satFactor = 0.85;
    } else if (level >= 900) {
      satFactor = 0.9;
    }

    const adjS = Math.min(s * satFactor, 100);
    const newRgb = hslToRgb(h, adjS, targetL);
    shades.push({ level, hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b) });
  }

  return shades;
}
