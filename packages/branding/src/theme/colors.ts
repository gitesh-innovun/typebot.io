/**
 * Brand Color System
 *
 * This file defines the color palette for the application.
 * Colors can be customized via environment variables or by modifying this file.
 */

import { brandConfig } from "../config";

/**
 * Get the primary color from brand config
 */
export const getPrimaryColor = () => brandConfig.colors.primary;

/**
 * Get the secondary color from brand config
 */
export const getSecondaryColor = () =>
  brandConfig.colors.secondary || brandConfig.colors.primary;

/**
 * Get the accent color from brand config
 */
export const getAccentColor = () =>
  brandConfig.colors.accent || brandConfig.colors.primary;

/**
 * Generate color variations from a base hex color
 * This is useful for creating hover states, borders, etc.
 */
export const generateColorShades = (hexColor: string) => {
  // Simple implementation - in production, you might want to use a library like chroma-js
  return {
    50: hexColor + "0D", // 5% opacity
    100: hexColor + "1A", // 10% opacity
    200: hexColor + "33", // 20% opacity
    300: hexColor + "4D", // 30% opacity
    400: hexColor + "66", // 40% opacity
    500: hexColor, // Base color
    600: hexColor + "CC", // Slightly darker
    700: hexColor + "B3", // Darker
    800: hexColor + "99", // Even darker
    900: hexColor + "80", // Darkest
  };
};

/**
 * Brand colors object
 */
export const brandColors = {
  primary: getPrimaryColor(),
  secondary: getSecondaryColor(),
  accent: getAccentColor(),
} as const;

/**
 * Helper to convert hex to RGB
 */
export const hexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Helper to get RGB string from hex
 */
export const hexToRgbString = (hex: string): string => {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "0, 0, 0";
};
