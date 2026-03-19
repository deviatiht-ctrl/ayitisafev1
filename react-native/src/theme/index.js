// AyitiSafe Theme Configuration

export const colors = {
  // Primary colors
  primary: '#1B2A4A',      // Deep Navy Blue
  accent: '#F97316',       // Vibrant Orange
  background: '#F4F6F9',   // Light Gray
  
  // Risk colors
  danger: '#EF4444',       // Danger Red
  safe: '#22C55E',         // Safe Green
  warning: '#F59E0B',      // Warning Yellow
  
  // Dark cards
  cardDark: '#243452',
  
  // Text colors
  text: '#1B2A4A',
  textLight: '#6B7280',
  textWhite: '#FFFFFF',
  
  // UI colors
  border: '#E5E7EB',
  inputBg: '#F4F6F9',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Gradient helpers
  gradientDanger: ['#EF4444', '#DC2626'],
  gradientWarning: ['#F59E0B', '#D97706'],
  gradientPrimary: ['#1B2A4A', '#2D4A7C'],
};

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
};
