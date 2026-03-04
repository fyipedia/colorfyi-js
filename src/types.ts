/**
 * TypeScript interfaces for the colorfyi color engine.
 *
 * All color values use standard ranges:
 * - RGB: 0-255 per channel
 * - HSL: h 0-360, s 0-100, l 0-100
 * - HSV: h 0-360, s 0-100, v 0-100
 * - CMYK: 0-100 per channel
 * - Lab: l 0-100, a -128..127, b -128..127
 * - OKLCH: l 0-1, c 0-0.4+, h 0-360
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface Lab {
  l: number;
  a: number;
  b: number;
}

export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

export interface ColorInfo {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  hsv: HSV;
  cmyk: CMYK;
  lab: Lab;
  oklch: OKLCH;
  isLight: boolean;
  isWarm: boolean;
}

export interface ContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export interface HarmonySet {
  complementary: string[];
  analogous: string[];
  triadic: string[];
  splitComplementary: string[];
  tetradic: string[];
}

export interface ShadeStep {
  level: number;
  hex: string;
}

export interface ColorBlindResult {
  original: string;
  protanopia: string;
  deuteranopia: string;
  tritanopia: string;
  achromatopsia: string;
}

export interface CompareResult {
  contrast: ContrastResult;
  deltaE: number;
  deltaECategory: string;
  mixed: string;
  gradient: string[];
}
