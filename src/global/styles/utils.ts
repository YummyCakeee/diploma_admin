export const getColorWithOpacity = (
  color: string,
  opacity: number = 1.0
): string => {
  const opacityConverted = Number((opacity * 256).toFixed()).toString(16)
  return color + opacityConverted
}

export const hslToHex = (h: number, s: number, l: number, o: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  const opacity = Math.round(255 * o).toString(16).padStart(2, '0')
  return `#${f(0)}${f(8)}${f(4)}${opacity}`;
}

export const hexToHSL = (hex: string): {h: number, s: number, l: number, o: number} => {
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0, o: 1 }
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b);
  let h = 0
  let s = 0
  let l = (max + min) / 2;
  let o = 1
  if (result[4]) {
     o = parseInt(result[4], 16) / 255
  }

  if (max !== min) {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), o }
}