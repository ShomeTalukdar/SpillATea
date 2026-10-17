/**
 * SpillATea Design Tokens — Daily Confession Board
 * 
 * Calm, intimate, editorial notebook aesthetic.
 * Flat surfaces, hairline borders (#262626), 12px radius confession panels,
 * 32px padding, Newsreader editorial serif for confessions, and restrained #FF5A1F accent.
 */

export const tokens = {
  colors: {
    dark: {
      bg: '#0A0A0A',
      surface: '#111111',
      surfaceHover: '#161616',
      surfaceSunken: '#161616',
      border: '#262626',
      borderStrong: '#3A3A3A',
      textPrimary: '#EDEDED',
      textSecondary: '#A1A1A1',
      textTertiary: '#6B6B6B',
      accent: '#FF5A1F',
      accentText: '#FF5A1F',
      focusRing: '#FF5A1F',
      sidebarHover: '#161616',
      sidebarActive: '#111111',
      danger: '#EF4444',
      success: '#10B981'
    },
    light: {
      bg: '#F3F2EF',
      surface: '#FFFFFF',
      surfaceHover: '#FAF9F7',
      surfaceSunken: '#ECEAE6',
      border: '#E2DFD9',
      borderStrong: '#C9C5BC',
      textPrimary: '#141414',
      textSecondary: '#4A4742',
      textTertiary: '#6F6B65',
      accent: '#FF5A1F',
      accentText: '#C93A08',
      focusRing: '#FF5A1F',
      sidebarHover: 'rgba(20,20,20,0.04)',
      sidebarActive: 'rgba(20,20,20,0.06)',
      danger: '#DC2626',
      success: '#059669'
    },
    // Default fallback pointing to dark values
    bg: '#0A0A0A',
    surface: '#111111',
    surfaceHover: '#161616',
    surfaceSunken: '#161616',
    border: '#262626',
    borderStrong: '#3A3A3A',
    textPrimary: '#EDEDED',
    textSecondary: '#A1A1A1',
    textTertiary: '#6B6B6B',
    accent: '#FF5A1F',
    accentText: '#FF5A1F',
    focusRing: '#FF5A1F',
    danger: '#EF4444',
    success: '#10B981'
  },
  typography: {
    fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSerif: "'Newsreader', Georgia, 'Times New Roman', serif",
    fontMono: "'IBM Plex Mono', 'Geist Mono', monospace",
    scale: {
      monoLabel: '11px',
      xs: '12px',
      meta: '13px',
      uiText: '14px',
      subhead: '16px',
      confessionBody: '20px',
      display: '28px',
      dayHeader: '32px'
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600
    }
  },
  spacing: {
    baseUnit: 4,
    rhythm: 8,
    cardPadding: '32px',
    cardGap: '40px',
    dayGap: '64px'
  },
  radii: {
    card: '12px',
    button: '6px',
    input: '6px',
    modal: '8px',
    media: '8px',
    chip: '9999px'
  }
};

export default tokens;
