export const colors = {
  // Background colors
  background: '#f8fafc',      // slate-50
  surface: '#ffffff',
  surfaceElevated: '#ffffff',

  // Primary palette (emerald)
  primary: '#059669',         // emerald-600
  primaryDark: '#047857',     // emerald-700
  primaryLight: '#d1fae5',    // emerald-100
  primaryMuted: '#a7f3d0',    // emerald-200

  // Accent palette (amber)
  accent: '#f59e0b',          // amber-500
  accentDark: '#d97706',      // amber-600
  accentLight: '#fef3c7',     // amber-100
  accentMuted: '#fde68a',     // amber-200

  // Text colors
  text: '#1e293b',            // slate-800
  textSecondary: '#475569',   // slate-600
  textMuted: '#64748b',       // slate-500
  textLight: '#94a3b8',       // slate-400
  textOnPrimary: '#ffffff',

  // Border colors
  border: '#e2e8f0',          // slate-200
  borderLight: '#f1f5f9',     // slate-100

  // Status colors
  success: '#10b981',         // emerald-500
  successLight: '#d1fae5',
  warning: '#f59e0b',         // amber-500
  warningLight: '#fef3c7',
  error: '#ef4444',           // red-500
  errorLight: '#fee2e2',
  info: '#3b82f6',            // blue-500
  infoLight: '#dbeafe',

  // Category colors
  categoryVeg: '#059669',     // emerald
  categoryHerb: '#8b5cf6',    // violet
  categoryFruit: '#f97316',   // orange
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const typography = {
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font weights (as strings for React Native)
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights (multipliers)
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Utility function to get category color
export function getCategoryColor(category: 'veg' | 'herb' | 'fruit'): string {
  switch (category) {
    case 'veg':
      return colors.categoryVeg;
    case 'herb':
      return colors.categoryHerb;
    case 'fruit':
      return colors.categoryFruit;
    default:
      return colors.primary;
  }
}

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
