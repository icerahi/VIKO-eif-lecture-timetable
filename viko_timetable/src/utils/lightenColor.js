export function lightenHexToRgb(originalHex, percent) {
  // Remove '#' if it exists
  originalHex = originalHex.replace("#", "");

  // Convert hex to RGB
  let r = parseInt(originalHex.substring(0, 2), 16);
  let g = parseInt(originalHex.substring(2, 4), 16);
  let b = parseInt(originalHex.substring(4, 6), 16);

  // Lighten the color by the percentage towards white (rgb(255, 255, 255))
  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));

  // Return the new color in RGB format
  return `rgb(${r}, ${g}, ${b})`;
}
