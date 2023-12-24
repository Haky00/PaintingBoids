function rainbowColor(value) {
    // Ensure value is between 0 and 1
    value = Math.max(0, Math.min(1, value));
  
    // Convert value to hue (from red to violet in the rainbow)
    const hue = value * 300; // Adjusted to avoid very dark colors in the blue-violet range
  
    // Set saturation and lightness to fixed values for a vibrant color
    const saturation = 100;
    const lightness = 50; // Initial lightness
  
    // Adjust lightness to maintain similar brightness for all hues
    const adjustedLightness = (lightness + ((value < 0.5) ? value * 40 : (1 - value) * 40)) % 100;
  
    // Convert HSL to RGB
    const rgbColor = hslToRgb(hue, saturation, adjustedLightness);
  
    // Convert RGB to hexadecimal color representation
    const hexColor = rgbToHex(rgbColor);
  
    return hexColor;
  }
  
  // Function to convert HSL to RGB
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
  
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  // Function to convert RGB to hexadecimal color representation
  function rgbToHex(rgb) {
    return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
  }