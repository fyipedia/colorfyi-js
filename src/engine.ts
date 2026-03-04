/**
 * Color conversion engine -- pure functions, zero dependencies.
 *
 * Supports hex, RGB, HSL, HSV, CMYK, CIE Lab (D65), and OKLCH color spaces.
 * All hex codes are uppercase, no # prefix.
 */

import type { RGB, HSL, HSV, CMYK, Lab, OKLCH, ColorInfo } from "./types.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round a number to `decimals` decimal places. */
function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Clamp a value between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** sRGB gamma linearization (0-1 input, 0-1 output). */
function linearize(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** sRGB gamma companding (0-1 linear input, 0-1 output). */
function delinearize(v: number): number {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
}

// ---------------------------------------------------------------------------
// Hex <-> RGB
// ---------------------------------------------------------------------------

/**
 * Convert a hex string to RGB.
 *
 * Accepts hex with or without `#` prefix, 3 or 6 characters.
 *
 * @example
 * hexToRgb("FF6B35") // { r: 255, g: 107, b: 53 }
 */
export function hexToRgb(hex: string): RGB {
  let h = hex.replace(/^#/, "").toUpperCase();
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/**
 * Convert RGB (0-255) to a 6-character uppercase hex string (no #).
 *
 * @example
 * rgbToHex(255, 107, 53) // "FF6B35"
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number): string =>
    clamp(Math.round(v), 0, 255).toString(16).toUpperCase().padStart(2, "0");
  return toHex(r) + toHex(g) + toHex(b);
}

// ---------------------------------------------------------------------------
// RGB <-> HSL
// ---------------------------------------------------------------------------

/**
 * Convert RGB (0-255) to HSL (h: 0-360, s: 0-100, l: 0-100).
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const cmax = Math.max(r1, g1, b1);
  const cmin = Math.min(r1, g1, b1);
  const delta = cmax - cmin;

  const ll = (cmax + cmin) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * ll - 1));
    if (cmax === r1) {
      h = 60 * (((g1 - b1) / delta) % 6);
    } else if (cmax === g1) {
      h = 60 * ((b1 - r1) / delta + 2);
    } else {
      h = 60 * ((r1 - g1) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  return {
    h: round(h, 1),
    s: round(s * 100, 1),
    l: round(ll * 100, 1),
  };
}

/**
 * Convert HSL (h: 0-360, s: 0-100, l: 0-100) to RGB (0-255).
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  const s1 = s / 100;
  const l1 = l / 100;

  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;

  let r1: number, g1: number, b1: number;

  if (h < 60) {
    [r1, g1, b1] = [c, x, 0];
  } else if (h < 120) {
    [r1, g1, b1] = [x, c, 0];
  } else if (h < 180) {
    [r1, g1, b1] = [0, c, x];
  } else if (h < 240) {
    [r1, g1, b1] = [0, x, c];
  } else if (h < 300) {
    [r1, g1, b1] = [x, 0, c];
  } else {
    [r1, g1, b1] = [c, 0, x];
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

// ---------------------------------------------------------------------------
// RGB <-> HSV
// ---------------------------------------------------------------------------

/**
 * Convert RGB (0-255) to HSV (h: 0-360, s: 0-100, v: 0-100).
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const cmax = Math.max(r1, g1, b1);
  const cmin = Math.min(r1, g1, b1);
  const delta = cmax - cmin;

  let h = 0;
  if (delta !== 0) {
    if (cmax === r1) {
      h = 60 * (((g1 - b1) / delta) % 6);
    } else if (cmax === g1) {
      h = 60 * ((b1 - r1) / delta + 2);
    } else {
      h = 60 * ((r1 - g1) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  const s = cmax === 0 ? 0 : delta / cmax;

  return {
    h: round(h, 1),
    s: round(s * 100, 1),
    v: round(cmax * 100, 1),
  };
}

// ---------------------------------------------------------------------------
// RGB <-> CMYK
// ---------------------------------------------------------------------------

/**
 * Convert RGB (0-255) to CMYK (0-100). No ICC profile, simple formula.
 */
export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const k = 1 - Math.max(r1, g1, b1);
  const c = (1 - r1 - k) / (1 - k);
  const m = (1 - g1 - k) / (1 - k);
  const y = (1 - b1 - k) / (1 - k);

  return {
    c: round(c * 100, 1),
    m: round(m * 100, 1),
    y: round(y * 100, 1),
    k: round(k * 100, 1),
  };
}

// ---------------------------------------------------------------------------
// RGB <-> CIE Lab (via XYZ, D65 illuminant)
// ---------------------------------------------------------------------------

/**
 * Convert RGB (0-255) to CIE Lab.
 * Uses D65 illuminant and sRGB gamma correction.
 */
export function rgbToLab(r: number, g: number, b: number): Lab {
  const rl = linearize(r / 255);
  const gl = linearize(g / 255);
  const bl = linearize(b / 255);

  // sRGB to XYZ (D65)
  const x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
  const y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
  const z = rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041;

  // D65 reference white
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const f = (t: number): number =>
    t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116;

  const fx = f(x / xn);
  const fy = f(y / yn);
  const fz = f(z / zn);

  const lVal = 116 * fy - 16;
  const aVal = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return {
    l: round(lVal, 2),
    a: round(aVal, 2),
    b: round(bVal, 2),
  };
}

/**
 * Convert CIE Lab to RGB (0-255) via XYZ. Clamps to valid sRGB gamut.
 */
export function labToRgb(l: number, a: number, b: number): RGB {
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const fInv = (t: number): number =>
    t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;

  const x = xn * fInv(fx);
  const y = yn * fInv(fy);
  const z = zn * fInv(fz);

  // XYZ to linear RGB
  const rl = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const gl = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  const bl = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  return {
    r: clamp(Math.round(delinearize(rl) * 255), 0, 255),
    g: clamp(Math.round(delinearize(gl) * 255), 0, 255),
    b: clamp(Math.round(delinearize(bl) * 255), 0, 255),
  };
}

// ---------------------------------------------------------------------------
// RGB -> OKLCH (via OKLab, Bjorn Ottosson)
// ---------------------------------------------------------------------------

/**
 * Convert RGB (0-255) to OKLCH (perceptually uniform color space).
 *
 * l: 0-1 (lightness), c: 0-0.4+ (chroma), h: 0-360 (hue).
 */
export function rgbToOklch(r: number, g: number, b: number): OKLCH {
  const rl = linearize(r / 255);
  const gl = linearize(g / 255);
  const bl = linearize(b / 255);

  const ll = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l_ = ll !== 0 ? Math.sign(ll) * Math.abs(ll) ** (1 / 3) : 0;
  const m_ = m !== 0 ? Math.sign(m) * Math.abs(m) ** (1 / 3) : 0;
  const s_ = s !== 0 ? Math.sign(s) * Math.abs(s) ** (1 / 3) : 0;

  const okL = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const okA = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const okB = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.sqrt(okA ** 2 + okB ** 2);
  const h = ((Math.atan2(okB, okA) * 180) / Math.PI + 360) % 360;

  return {
    l: round(okL, 4),
    c: round(c, 4),
    h: round(h, 1),
  };
}

// ---------------------------------------------------------------------------
// Color properties
// ---------------------------------------------------------------------------

/**
 * Relative luminance per WCAG 2.1 (used internally by contrast functions).
 */
function relativeLuminanceInternal(r: number, g: number, b: number): number {
  return (
    0.2126 * linearize(r / 255) +
    0.7152 * linearize(g / 255) +
    0.0722 * linearize(b / 255)
  );
}

/**
 * Check if a color is perceptually light (luminance > 0.179).
 */
function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  return relativeLuminanceInternal(r, g, b) > 0.179;
}

/**
 * Check if a color is warm (hue in 0-60 or 300-360 range).
 */
function isWarmColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const { h } = rgbToHsl(r, g, b);
  return h <= 60 || h >= 300;
}

// ---------------------------------------------------------------------------
// Comprehensive color info
// ---------------------------------------------------------------------------

/**
 * Get comprehensive color information from a hex value.
 *
 * Returns all 7 color space conversions plus light/warm flags.
 *
 * @example
 * const info = getColorInfo("FF6B35");
 * console.log(info.rgb);  // { r: 255, g: 107, b: 53 }
 * console.log(info.hsl);  // { h: 16, s: 100, l: 60.4 }
 */
export function getColorInfo(hex: string): ColorInfo {
  const h = hex.replace(/^#/, "").toUpperCase();
  const rgb = hexToRgb(h);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmykVal = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);

  return {
    hex: h,
    rgb,
    hsl,
    hsv,
    cmyk: cmykVal,
    lab,
    oklch,
    isLight: isLightColor(h),
    isWarm: isWarmColor(h),
  };
}
