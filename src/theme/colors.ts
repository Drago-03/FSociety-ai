export const colors = {
  // Primary/Security Colors
  primary: {
    deep: '#2C3E50',    // Deep Blue for primary backgrounds and headers
    light: '#3498DB',   // Light Blue for interactive elements
    DEFAULT: '#2C3E50'  // Default primary color
  },

  // Alert Colors
  alert: {
    critical: '#E74C3C', // Red for critical alerts
    warning: '#F39C12',  // Orange for warnings
    success: '#2ECC71'   // Green for success
  },

  // Neutral/Data Colors
  neutral: {
    dark: '#34495E',     // Dark Gray for text
    light: '#ECF0F1',    // Light Gray for backgrounds
    DEFAULT: '#34495E'   // Default neutral color
  },

  // Data Visualization
  data: {
    teal: '#008080',     // Teal for data visualization
    cyan: '#00BCD4',     // Cyan for interactive elements
    blue: '#3498DB'      // Blue for charts
  },

  // Background Gradients
  gradients: {
    primary: 'from-[#2C3E50] to-[#34495E]',
    success: 'from-[#27AE60] to-[#2ECC71]',
    warning: 'from-[#F39C12] to-[#F1C40F]',
    danger: 'from-[#E74C3C] to-[#C0392B]'
  },

  // Component States
  states: {
    hover: {
      primary: '#3498DB',
      success: '#27AE60',
      warning: '#E67E22',
      danger: '#C0392B'
    },
    focus: {
      ring: '#3498DB',
      offset: '#ECF0F1'
    }
  },

  // Text Colors
  text: {
    primary: '#2C3E50',
    secondary: '#34495E',
    light: '#ECF0F1',
    muted: '#95A5A6'
  },

  // Border Colors
  border: {
    light: '#ECF0F1',
    DEFAULT: '#BDC3C7',
    dark: '#34495E'
  },

  // Overlay/Background Colors
  overlay: {
    light: 'rgba(236, 240, 241, 0.95)',
    dark: 'rgba(44, 62, 80, 0.95)'
  }
} as const;

// Common UI Component Themes
export const componentThemes = {
  button: {
    primary: `bg-[#3498DB] hover:bg-[#2C3E50] text-white`,
    secondary: `bg-[#34495E] hover:bg-[#2C3E50] text-white`,
    success: `bg-[#2ECC71] hover:bg-[#27AE60] text-white`,
    warning: `bg-[#F39C12] hover:bg-[#E67E22] text-white`,
    danger: `bg-[#E74C3C] hover:bg-[#C0392B] text-white`,
    ghost: `bg-transparent hover:bg-[#ECF0F1] text-[#34495E]`
  },

  input: {
    default: `border-[#BDC3C7] focus:border-[#3498DB] focus:ring-[#3498DB]`,
    error: `border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]`
  },

  card: {
    default: `bg-white border border-[#ECF0F1] shadow-sm`,
    hover: `hover:border-[#3498DB] hover:shadow-md transition-all duration-200`
  },

  alert: {
    success: `bg-[#2ECC71]/10 border-[#2ECC71]/20 text-[#27AE60]`,
    warning: `bg-[#F39C12]/10 border-[#F39C12]/20 text-[#E67E22]`,
    error: `bg-[#E74C3C]/10 border-[#E74C3C]/20 text-[#C0392B]`,
    info: `bg-[#3498DB]/10 border-[#3498DB]/20 text-[#2980B9]`
  }
} as const;

// Gradient Backgrounds
export const gradients = {
  primary: `bg-gradient-to-br from-[#2C3E50] to-[#34495E]`,
  success: `bg-gradient-to-br from-[#27AE60] to-[#2ECC71]`,
  warning: `bg-gradient-to-br from-[#F39C12] to-[#F1C40F]`,
  danger: `bg-gradient-to-br from-[#E74C3C] to-[#C0392B]`,
  blue: `bg-gradient-to-r from-[#2C3E50] to-[#3498DB]`
} as const;

// Data Visualization Colors
export const chartColors = [
  '#3498DB', // Blue
  '#2ECC71', // Green
  '#F39C12', // Orange
  '#E74C3C', // Red
  '#9B59B6', // Purple
  '#008080', // Teal
  '#00BCD4', // Cyan
  '#34495E'  // Dark Gray
] as const; 