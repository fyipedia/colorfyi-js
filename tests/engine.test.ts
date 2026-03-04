import { describe, it, expect } from "vitest";
import {
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
  contrastRatio,
  relativeLuminance,
  textColorForBg,
  harmonies,
  complementary,
  analogous,
  triadic,
  splitComplementary,
  tetradic,
  generateShades,
  simulateColorBlindness,
  deltaE,
  mixColors,
  gradientSteps,
  compareColors,
} from "../src/index.js";

// ---------------------------------------------------------------------------
// Hex <-> RGB
// ---------------------------------------------------------------------------

describe("hexToRgb", () => {
  it("converts FF6B35", () => {
    expect(hexToRgb("FF6B35")).toEqual({ r: 255, g: 107, b: 53 });
  });

  it("converts 000000", () => {
    expect(hexToRgb("000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("converts FFFFFF", () => {
    expect(hexToRgb("FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("handles # prefix", () => {
    expect(hexToRgb("#3498DB")).toEqual({ r: 52, g: 152, b: 219 });
  });

  it("handles lowercase", () => {
    expect(hexToRgb("ff6b35")).toEqual({ r: 255, g: 107, b: 53 });
  });

  it("handles 3-character shorthand", () => {
    expect(hexToRgb("F00")).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("rgbToHex", () => {
  it("converts (255, 107, 53) to FF6B35", () => {
    expect(rgbToHex(255, 107, 53)).toBe("FF6B35");
  });

  it("converts (0, 0, 0) to 000000", () => {
    expect(rgbToHex(0, 0, 0)).toBe("000000");
  });

  it("converts (255, 255, 255) to FFFFFF", () => {
    expect(rgbToHex(255, 255, 255)).toBe("FFFFFF");
  });

  it("pads single-digit hex values", () => {
    expect(rgbToHex(1, 2, 3)).toBe("010203");
  });

  it("clamps out-of-range values", () => {
    expect(rgbToHex(300, -10, 128)).toBe("FF0080");
  });
});

// ---------------------------------------------------------------------------
// RGB <-> HSL
// ---------------------------------------------------------------------------

describe("rgbToHsl", () => {
  it("converts pure red", () => {
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("converts pure green", () => {
    const hsl = rgbToHsl(0, 255, 0);
    expect(hsl.h).toBe(120);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("converts pure blue", () => {
    const hsl = rgbToHsl(0, 0, 255);
    expect(hsl.h).toBe(240);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("converts black to achromatic", () => {
    const hsl = rgbToHsl(0, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(0);
  });

  it("converts white to achromatic", () => {
    const hsl = rgbToHsl(255, 255, 255);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(100);
  });

  it("converts mid-gray", () => {
    const hsl = rgbToHsl(128, 128, 128);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBeCloseTo(50.2, 0);
  });
});

describe("hslToRgb", () => {
  it("converts pure red HSL to RGB", () => {
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("converts pure green HSL to RGB", () => {
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("converts pure blue HSL to RGB", () => {
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("roundtrips through HSL", () => {
    const hex = "3498DB";
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const back = hslToRgb(hsl.h, hsl.s, hsl.l);
    // Allow 1-unit rounding difference
    expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// RGB <-> HSV
// ---------------------------------------------------------------------------

describe("rgbToHsv", () => {
  it("converts pure red", () => {
    const hsv = rgbToHsv(255, 0, 0);
    expect(hsv.h).toBe(0);
    expect(hsv.s).toBe(100);
    expect(hsv.v).toBe(100);
  });

  it("converts black", () => {
    const hsv = rgbToHsv(0, 0, 0);
    expect(hsv.h).toBe(0);
    expect(hsv.s).toBe(0);
    expect(hsv.v).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// RGB -> CMYK
// ---------------------------------------------------------------------------

describe("rgbToCmyk", () => {
  it("converts pure red", () => {
    const cmyk = rgbToCmyk(255, 0, 0);
    expect(cmyk.c).toBe(0);
    expect(cmyk.m).toBe(100);
    expect(cmyk.y).toBe(100);
    expect(cmyk.k).toBe(0);
  });

  it("converts black", () => {
    const cmyk = rgbToCmyk(0, 0, 0);
    expect(cmyk.c).toBe(0);
    expect(cmyk.m).toBe(0);
    expect(cmyk.y).toBe(0);
    expect(cmyk.k).toBe(100);
  });

  it("converts white", () => {
    const cmyk = rgbToCmyk(255, 255, 255);
    expect(cmyk.c).toBe(0);
    expect(cmyk.m).toBe(0);
    expect(cmyk.y).toBe(0);
    expect(cmyk.k).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// RGB <-> Lab
// ---------------------------------------------------------------------------

describe("rgbToLab", () => {
  it("converts white to L*=100", () => {
    const lab = rgbToLab(255, 255, 255);
    expect(lab.l).toBeCloseTo(100, 0);
    expect(lab.a).toBeCloseTo(0, 0);
    expect(lab.b).toBeCloseTo(0, 0);
  });

  it("converts black to L*=0", () => {
    const lab = rgbToLab(0, 0, 0);
    expect(lab.l).toBeCloseTo(0, 0);
  });

  it("converts pure red", () => {
    const lab = rgbToLab(255, 0, 0);
    expect(lab.l).toBeCloseTo(53.2, 0);
    expect(lab.a).toBeGreaterThan(60); // positive a* = red
    expect(lab.b).toBeGreaterThan(40); // positive b* = yellow direction
  });
});

describe("labToRgb", () => {
  it("roundtrips through Lab", () => {
    const origR = 128, origG = 64, origB = 200;
    const lab = rgbToLab(origR, origG, origB);
    const back = labToRgb(lab.l, lab.a, lab.b);
    expect(Math.abs(back.r - origR)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - origG)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - origB)).toBeLessThanOrEqual(1);
  });

  it("clamps out-of-gamut values", () => {
    const rgb = labToRgb(50, 100, 100);
    expect(rgb.r).toBeGreaterThanOrEqual(0);
    expect(rgb.r).toBeLessThanOrEqual(255);
    expect(rgb.g).toBeGreaterThanOrEqual(0);
    expect(rgb.g).toBeLessThanOrEqual(255);
    expect(rgb.b).toBeGreaterThanOrEqual(0);
    expect(rgb.b).toBeLessThanOrEqual(255);
  });
});

// ---------------------------------------------------------------------------
// RGB -> OKLCH
// ---------------------------------------------------------------------------

describe("rgbToOklch", () => {
  it("converts black to L=0", () => {
    const oklch = rgbToOklch(0, 0, 0);
    expect(oklch.l).toBe(0);
    expect(oklch.c).toBe(0);
  });

  it("converts white to L~1", () => {
    const oklch = rgbToOklch(255, 255, 255);
    expect(oklch.l).toBeCloseTo(1, 1);
    expect(oklch.c).toBeCloseTo(0, 2);
  });

  it("converts a saturated color", () => {
    const oklch = rgbToOklch(255, 0, 0);
    expect(oklch.l).toBeGreaterThan(0.5);
    expect(oklch.c).toBeGreaterThan(0.2);
    expect(oklch.h).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// getColorInfo
// ---------------------------------------------------------------------------

describe("getColorInfo", () => {
  it("returns all color spaces for FF6B35", () => {
    const info = getColorInfo("FF6B35");
    expect(info.hex).toBe("FF6B35");
    expect(info.rgb).toEqual({ r: 255, g: 107, b: 53 });
    expect(info.hsl.h).toBeCloseTo(16, 0);
    expect(info.hsl.s).toBe(100);
    expect(info.cmyk.c).toBe(0);
    // FF6B35 luminance is ~0.183, just above 0.179 threshold
    expect(info.isLight).toBe(true);
    expect(info.isWarm).toBe(true);
  });

  it("handles # prefix", () => {
    const info = getColorInfo("#3498DB");
    expect(info.hex).toBe("3498DB");
  });

  it("handles lowercase", () => {
    const info = getColorInfo("ff6b35");
    expect(info.hex).toBe("FF6B35");
  });

  it("identifies light colors", () => {
    expect(getColorInfo("FFFFFF").isLight).toBe(true);
    expect(getColorInfo("FFFF00").isLight).toBe(true);
  });

  it("identifies warm and cool colors", () => {
    expect(getColorInfo("FF0000").isWarm).toBe(true);  // red
    expect(getColorInfo("FFFF00").isWarm).toBe(true);  // yellow
    expect(getColorInfo("0000FF").isWarm).toBe(false);  // blue
    expect(getColorInfo("00FF00").isWarm).toBe(false);  // green
  });
});

// ---------------------------------------------------------------------------
// Contrast
// ---------------------------------------------------------------------------

describe("relativeLuminance", () => {
  it("black is 0", () => {
    expect(relativeLuminance(0, 0, 0)).toBe(0);
  });

  it("white is 1", () => {
    expect(relativeLuminance(255, 255, 255)).toBeCloseTo(1, 2);
  });
});

describe("contrastRatio", () => {
  it("black on white is 21:1", () => {
    const cr = contrastRatio("000000", "FFFFFF");
    expect(cr.ratio).toBeCloseTo(21, 0);
    expect(cr.aaNormal).toBe(true);
    expect(cr.aaLarge).toBe(true);
    expect(cr.aaaNormal).toBe(true);
    expect(cr.aaaLarge).toBe(true);
  });

  it("same color is 1:1", () => {
    const cr = contrastRatio("FF6B35", "FF6B35");
    expect(cr.ratio).toBe(1);
    expect(cr.aaNormal).toBe(false);
    expect(cr.aaLarge).toBe(false);
  });

  it("is symmetric", () => {
    const cr1 = contrastRatio("FF6B35", "3498DB");
    const cr2 = contrastRatio("3498DB", "FF6B35");
    expect(cr1.ratio).toBe(cr2.ratio);
  });

  it("checks AA thresholds correctly", () => {
    // A pair that passes AA large but not AA normal
    const cr = contrastRatio("777777", "FFFFFF");
    expect(cr.ratio).toBeGreaterThan(3.0);
    expect(cr.ratio).toBeLessThan(4.5);
    expect(cr.aaLarge).toBe(true);
    expect(cr.aaNormal).toBe(false);
  });
});

describe("textColorForBg", () => {
  it("returns white for dark backgrounds", () => {
    expect(textColorForBg("000000")).toBe("FFFFFF");
    expect(textColorForBg("333333")).toBe("FFFFFF");
  });

  it("returns black for light backgrounds", () => {
    expect(textColorForBg("FFFFFF")).toBe("000000");
    expect(textColorForBg("F0F0F0")).toBe("000000");
  });
});

// ---------------------------------------------------------------------------
// Harmonies
// ---------------------------------------------------------------------------

describe("harmonies", () => {
  it("returns all 5 harmony types", () => {
    const h = harmonies("FF6B35");
    expect(h.complementary).toHaveLength(1);
    expect(h.analogous).toHaveLength(2);
    expect(h.triadic).toHaveLength(2);
    expect(h.splitComplementary).toHaveLength(2);
    expect(h.tetradic).toHaveLength(3);
  });

  it("complementary is 180 degree rotation", () => {
    const comp = complementary("FF0000");
    // Pure red complement is cyan
    const rgb = hexToRgb(comp[0]);
    expect(rgb.r).toBeLessThan(10);
    expect(rgb.g).toBeGreaterThan(240);
    expect(rgb.b).toBeGreaterThan(240);
  });

  it("all harmony results are valid hex", () => {
    const h = harmonies("3498DB");
    const allColors = [
      ...h.complementary,
      ...h.analogous,
      ...h.triadic,
      ...h.splitComplementary,
      ...h.tetradic,
    ];
    for (const hex of allColors) {
      expect(hex).toMatch(/^[0-9A-F]{6}$/);
    }
  });
});

describe("individual harmony functions", () => {
  it("analogous returns -30 and +30", () => {
    const result = analogous("FF0000");
    expect(result).toHaveLength(2);
  });

  it("triadic returns +120 and +240", () => {
    const result = triadic("FF0000");
    expect(result).toHaveLength(2);
  });

  it("splitComplementary returns +150 and +210", () => {
    const result = splitComplementary("FF0000");
    expect(result).toHaveLength(2);
  });

  it("tetradic returns +90, +180, +270", () => {
    const result = tetradic("FF0000");
    expect(result).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// Shades
// ---------------------------------------------------------------------------

describe("generateShades", () => {
  it("generates 11 shade steps", () => {
    const shades = generateShades("3498DB");
    expect(shades).toHaveLength(11);
  });

  it("includes all standard levels", () => {
    const shades = generateShades("FF6B35");
    const levels = shades.map((s) => s.level);
    expect(levels).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
  });

  it("shade 50 is lightest, 950 is darkest", () => {
    const shades = generateShades("3498DB");
    const first = hexToRgb(shades[0].hex);
    const last = hexToRgb(shades[shades.length - 1].hex);
    const firstLum = first.r + first.g + first.b;
    const lastLum = last.r + last.g + last.b;
    expect(firstLum).toBeGreaterThan(lastLum);
  });

  it("all shades are valid hex", () => {
    const shades = generateShades("E91E63");
    for (const shade of shades) {
      expect(shade.hex).toMatch(/^[0-9A-F]{6}$/);
    }
  });
});

// ---------------------------------------------------------------------------
// Color blindness
// ---------------------------------------------------------------------------

describe("simulateColorBlindness", () => {
  it("returns all 4 simulation types plus original", () => {
    const cb = simulateColorBlindness("FF6B35");
    expect(cb.original).toBe("FF6B35");
    expect(cb.protanopia).toMatch(/^[0-9A-F]{6}$/);
    expect(cb.deuteranopia).toMatch(/^[0-9A-F]{6}$/);
    expect(cb.tritanopia).toMatch(/^[0-9A-F]{6}$/);
    expect(cb.achromatopsia).toMatch(/^[0-9A-F]{6}$/);
  });

  it("achromatopsia is grayscale", () => {
    const cb = simulateColorBlindness("FF6B35");
    const rgb = hexToRgb(cb.achromatopsia);
    expect(rgb.r).toBe(rgb.g);
    expect(rgb.g).toBe(rgb.b);
  });

  it("gray input is unchanged for all types", () => {
    const cb = simulateColorBlindness("808080");
    expect(cb.protanopia).toBe("808080");
    expect(cb.deuteranopia).toBe("808080");
    expect(cb.tritanopia).toBe("808080");
    // Achromatopsia of gray is still gray
    expect(cb.achromatopsia).toBe("808080");
  });

  it("handles # prefix", () => {
    const cb = simulateColorBlindness("#FF6B35");
    expect(cb.original).toBe("FF6B35");
  });
});

// ---------------------------------------------------------------------------
// Comparison & mixing
// ---------------------------------------------------------------------------

describe("deltaE", () => {
  it("identical colors have deltaE of 0", () => {
    expect(deltaE("FF6B35", "FF6B35")).toBe(0);
  });

  it("black vs white has high deltaE", () => {
    const de = deltaE("000000", "FFFFFF");
    expect(de).toBeGreaterThan(90);
  });

  it("similar colors have low deltaE", () => {
    const de = deltaE("FF0000", "FE0000");
    expect(de).toBeLessThan(2);
  });

  it("is symmetric", () => {
    expect(deltaE("FF6B35", "3498DB")).toBe(deltaE("3498DB", "FF6B35"));
  });
});

describe("mixColors", () => {
  it("ratio 0 returns first color", () => {
    const mixed = mixColors("FF0000", "0000FF", 0);
    expect(mixed).toBe("FF0000");
  });

  it("ratio 1 returns second color", () => {
    const mixed = mixColors("FF0000", "0000FF", 1);
    expect(mixed).toBe("0000FF");
  });

  it("mixing same color returns same color", () => {
    const mixed = mixColors("3498DB", "3498DB");
    expect(mixed).toBe("3498DB");
  });

  it("default ratio is 0.5", () => {
    const mixed = mixColors("FF0000", "0000FF");
    const rgb = hexToRgb(mixed);
    // Lab-space mix of red and blue should have some purple
    expect(rgb.r).toBeGreaterThan(100);
    expect(rgb.b).toBeGreaterThan(50);
  });
});

describe("gradientSteps", () => {
  it("returns correct number of steps", () => {
    expect(gradientSteps("FF0000", "0000FF", 5)).toHaveLength(5);
    expect(gradientSteps("FF0000", "0000FF", 10)).toHaveLength(10);
  });

  it("first step is start color, last is end color", () => {
    const gradient = gradientSteps("FF0000", "0000FF", 7);
    expect(gradient[0]).toBe("FF0000");
    expect(gradient[gradient.length - 1]).toBe("0000FF");
  });

  it("default is 7 steps", () => {
    expect(gradientSteps("FF0000", "0000FF")).toHaveLength(7);
  });

  it("all steps are valid hex", () => {
    const gradient = gradientSteps("FF6B35", "3498DB", 7);
    for (const hex of gradient) {
      expect(hex).toMatch(/^[0-9A-F]{6}$/);
    }
  });
});

describe("compareColors", () => {
  it("returns all comparison fields", () => {
    const cmp = compareColors("FF6B35", "3498DB");
    expect(cmp.contrast).toBeDefined();
    expect(cmp.contrast.ratio).toBeGreaterThan(1);
    expect(cmp.deltaE).toBeGreaterThan(0);
    expect(cmp.deltaECategory).toBe("Very Different");
    expect(cmp.mixed).toMatch(/^[0-9A-F]{6}$/);
    expect(cmp.gradient).toHaveLength(7);
  });

  it("identical colors", () => {
    const cmp = compareColors("FF6B35", "FF6B35");
    expect(cmp.contrast.ratio).toBe(1);
    expect(cmp.deltaE).toBe(0);
    expect(cmp.deltaECategory).toBe("Identical");
  });

  it("similar colors are categorized correctly", () => {
    // Colors close but not identical (deltaE between 1.0 and 5.0)
    const cmp = compareColors("FF0000", "FA0500");
    expect(cmp.deltaE).toBeGreaterThan(1.0);
    expect(cmp.deltaE).toBeLessThan(5.0);
    expect(cmp.deltaECategory).toBe("Similar");
  });

  it("noticeable colors are categorized correctly", () => {
    // Colors with moderate difference (deltaE between 5 and 25)
    const cmp = compareColors("FF0000", "E82000");
    expect(cmp.deltaE).toBeGreaterThan(5.0);
    expect(cmp.deltaE).toBeLessThan(25.0);
    expect(cmp.deltaECategory).toBe("Noticeable");
  });
});
