interface RGBColor {
  r: number;
  g: number;
  b: number;
}

function normalizeHex(value: string) {
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }

  return value;
}

export function parseHexColor(value: string): RGBColor | null {
  if (!/^#([\da-f]{3}|[\da-f]{6})$/i.test(value)) {
    return null;
  }

  const normalized = normalizeHex(value);

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16)
  };
}

/**
 * 把十六进制主色转成 `"r, g, b"` 三元组，供 `rgba(var(--app-primary-rgb), α)` 着色使用。
 * 解析失败时回退到默认主色的三元组。
 */
export function toRgbTriple(hex: string): string {
  const parsed = parseHexColor(hex);

  if (!parsed) {
    return '22, 119, 255';
  }

  return `${parsed.r}, ${parsed.g}, ${parsed.b}`;
}
