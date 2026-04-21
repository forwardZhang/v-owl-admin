interface RGBColor {
  b: number;
  g: number;
  r: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHex(value: string) {
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }

  return value;
}

function parseHexColor(value: string): RGBColor | null {
  if (!/^#([\da-f]{3}|[\da-f]{6})$/i.test(value)) {
    return null;
  }

  const normalized = normalizeHex(value);

  return {
    b: Number.parseInt(normalized.slice(5, 7), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    r: Number.parseInt(normalized.slice(1, 3), 16)
  };
}

function parseRgbColor(value: string): RGBColor | null {
  const matched = value.match(
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)/i
  );

  if (!matched) {
    return null;
  }

  return {
    b: Number(matched[3]),
    g: Number(matched[2]),
    r: Number(matched[1])
  };
}

function parseColor(value: string): RGBColor | null {
  return parseHexColor(value) || parseRgbColor(value);
}

function toHex(value: number) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
}

function rgbToHex(color: RGBColor) {
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function mixColor(base: RGBColor, target: RGBColor, weight: number): RGBColor {
  return {
    b: base.b + (target.b - base.b) * weight,
    g: base.g + (target.g - base.g) * weight,
    r: base.r + (target.r - base.r) * weight
  };
}

export function deriveThemePalette(color: string) {
  const parsedColor = parseColor(color);

  if (!parsedColor) {
    return {
      primaryActiveColor: color,
      primaryColor: color,
      primaryHoverColor: color,
      primaryRgb: '22, 119, 255'
    };
  }

  const hoverColor = mixColor(parsedColor, { b: 255, g: 255, r: 255 }, 0.16);
  const activeColor = mixColor(parsedColor, { b: 0, g: 0, r: 0 }, 0.14);

  return {
    primaryActiveColor: rgbToHex(activeColor),
    primaryColor: rgbToHex(parsedColor),
    primaryHoverColor: rgbToHex(hoverColor),
    primaryRgb: `${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}`
  };
}
