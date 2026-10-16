import React from 'react';

/**
 * 16px stroke icons (1.5px stroke, clean Lucide style)
 * Deterministic avatars and brand wordmark for SpillATea.
 */

export function BrandLogo({ size = 24, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      className={`shrink-0 ${className}`} 
      aria-label="SpillATea Logo"
    >
      <path 
        d="M 9.04 5.95 C 9.74 5.86 10.68 5.86 11.54 5.95 C 12.39 6.04 13.03 6.12 14.17 6.47 C 15.31 6.82 17.52 7.68 18.37 8.05 C 19.22 8.42 19.14 8.49 19.29 8.71 C 19.44 8.93 19.36 9.19 19.29 9.36 C 19.22 9.54 19.03 9.69 18.89 9.76 C 18.76 9.82 19.09 10.00 18.50 9.76 C 17.91 9.52 16.36 8.68 15.35 8.31 C 14.34 7.94 13.46 7.68 12.46 7.52 C 11.45 7.37 10.05 7.31 9.31 7.39 C 8.56 7.48 8.26 7.83 7.99 8.05 C 7.73 8.27 7.75 8.49 7.73 8.71 C 7.71 8.93 7.73 9.08 7.86 9.36 C 7.99 9.65 7.97 9.82 8.52 10.42 C 9.07 11.01 10.20 12.17 11.14 12.91 C 12.09 13.65 12.81 14.18 14.17 14.88 C 15.52 15.58 18.06 16.65 19.29 17.11 C 20.52 17.58 20.80 17.55 21.52 17.64 C 22.25 17.73 23.16 17.68 23.62 17.64 C 24.08 17.60 24.06 17.58 24.28 17.38 C 24.50 17.18 24.85 16.77 24.94 16.46 C 25.02 16.15 25.05 16.02 24.81 15.54 C 24.57 15.06 23.69 13.98 23.49 13.57 C 23.30 13.15 23.51 13.20 23.62 13.04 C 23.73 12.89 23.97 12.69 24.15 12.65 C 24.33 12.60 24.39 12.50 24.68 12.78 C 24.96 13.06 25.55 13.81 25.86 14.36 C 26.16 14.90 26.40 15.56 26.51 16.06 C 26.62 16.57 26.71 16.57 26.51 17.38 C 26.32 18.19 25.88 19.59 25.33 20.92 C 24.78 22.26 23.78 24.43 23.23 25.39 C 22.68 26.35 22.46 26.33 22.05 26.71 C 21.63 27.08 21.37 27.34 20.73 27.62 C 20.10 27.91 18.94 28.28 18.24 28.41 C 17.54 28.54 17.14 28.48 16.53 28.41 C 15.92 28.34 15.37 28.28 14.56 28.02 C 13.75 27.75 12.26 27.03 11.67 26.84 C 11.08 26.64 11.45 26.64 11.01 26.84 C 10.57 27.03 9.63 27.73 9.04 28.02 C 8.45 28.30 8.04 28.43 7.47 28.54 C 6.90 28.65 5.63 28.67 5.63 28.67 C 5.63 28.67 5.36 28.41 5.36 28.41 C 5.36 28.41 5.36 28.02 5.36 28.02 C 5.36 28.02 6.52 26.51 6.81 25.92 C 7.09 25.32 7.34 25.00 7.07 24.47 C 6.81 23.95 5.78 23.37 5.23 22.76 C 4.69 22.15 4.16 21.52 3.79 20.79 C 3.42 20.07 3.13 19.22 3.00 18.43 C 2.87 17.64 2.80 17.11 3.00 16.06 C 3.20 15.01 3.66 13.55 4.18 12.12 C 4.71 10.70 5.63 8.46 6.15 7.52 C 6.68 6.58 6.85 6.73 7.33 6.47 C 7.82 6.21 8.34 6.04 9.04 5.95 Z" 
        fill="currentColor" 
      />
      <circle cx="22.97" cy="9.17" r="1.58" fill="#FF5A1F" />
    </svg>
  );
}

export function BrandWordmark({ className = "", size = 22, textSize = "text-[16px]", gap = "gap-2.5" }) {
  return (
    <div className={`flex items-center ${gap} select-none ${className}`}>
      <BrandLogo size={size} />
      <span 
        className={`font-semibold ${textSize} tracking-tight`}
        style={{ color: 'var(--text-primary)' }}
      >
        Spill<span className="text-[#FF5A1F]">A</span>Tea
      </span>
    </div>
  );
}

// 16px / 1.5px stroke icons
export function IconHome({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 6.5L8 2l5.5 4.5V13a1 1 0 01-1 1h-3.5v-4h-2v4H3.5a1 1 0 01-1-1V6.5z" />
    </svg>
  );
}

export function IconSearch({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}

export function IconNotifications({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6a4 4 0 018 0c0 4 1.5 5 1.5 5H2.5S4 10 4 6z" />
      <path d="M6.5 13a1.5 1.5 0 003 0" />
    </svg>
  );
}

export function IconProfile({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="5" r="3" />
      <path d="M3 13.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
    </svg>
  );
}

export function IconAdmin({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 1.5l5 2.5v4.5c0 3.5-3 5.5-5 6-2-.5-5-2.5-5-6V4l5-2.5z" />
      <path d="M6 7.5l1.5 1.5L10 6" />
    </svg>
  );
}

export function IconArrowUp({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
    </svg>
  );
}

export function IconArrowDown({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
    </svg>
  );
}

export function IconComment({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 3h11a1 1 0 011 1v7a1 1 0 01-1 1h-6.5L4 14.5V12H2.5a1 1 0 01-1-1V4a1 1 0 011-1z" />
    </svg>
  );
}

export function IconShare({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.5 8.5v4a1 1 0 001 1h7a1 1 0 001-1v-4" />
      <path d="M8 2v7.5M5.5 4.5L8 2l2.5 2.5" />
    </svg>
  );
}

export function IconBookmark({ size = 16, filled = false, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth={filled ? "0" : "1.5"} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 2.5h8a1 1 0 011 1v10.5l-5-3-5 3V3.5a1 1 0 011-1z" />
    </svg>
  );
}

export function IconSettings({ size = 16, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a7 7 0 0 1 0 .255c-.007.38.138.75.431.992l1.003.827c.424.35.534.955.26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.241.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-1.002l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

export function IconActivity({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 8.5h3l2-5 3 9 2-4h3" />
    </svg>
  );
}

export function IconCalendar({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" />
    </svg>
  );
}

export function IconReport({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v12M3 3h9l-2 3.5 2 3.5H3" />
    </svg>
  );
}

export function IconHeart({ size = 16, filled = false, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth={filled ? "0" : "1.5"} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M8 13.8l-1.15-1.05C2.8 9.05 1 7.4 1 5.35 1 3.7 2.3 2.4 3.95 2.4c.95 0 1.85.45 2.45 1.15.6-.7 1.5-1.15 2.45-1.15 1.65 0 2.95 1.3 2.95 2.95 0 2.05-1.8 3.7-5.85 7.4L8 13.8z" />
    </svg>
  );
}

export function IconMaybeMe({ size = 16, active = false, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="6.5" cy="5" r="2.5" />
      <path d="M2 13.5v-1a3.5 3.5 0 017 0v1" />
      <circle cx="12.5" cy="5" r="1.5" fill={active ? "currentColor" : "#FF5A1F"} stroke="none" />
    </svg>
  );
}


export function IconLock({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="6.5" width="9" height="7.5" rx="1.5" />
      <path d="M5.5 6.5V4.5a2.5 2.5 0 015 0v2" />
    </svg>
  );
}

export function IconClose({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function IconCheck({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

export function IconBack({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 3.5L5.5 8 10 12.5" />
    </svg>
  );
}

export function IconAlert({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5M8 11h.01" />
    </svg>
  );
}

export function IconCommand({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5.5 5.5a2 2 0 10-2-2v7a2 2 0 102-2h5a2 2 0 102 2v-7a2 2 0 10-2 2h-5z" />
    </svg>
  );
}

export function IconLike({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13.8 4.8a3.2 3.2 0 00-4.6 0L8 6.1l-1.2-1.3a3.2 3.2 0 00-4.6 4.6l5.8 5.8 5.8-5.8a3.2 3.2 0 000-4.6z" />
    </svg>
  );
}

export function IconEye({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2.5" />
    </svg>
  );
}


// 6 deterministic muted tones for anonymous avatars
const AVATAR_TONES = [
  '#2C2C2E',
  '#3A3A3C',
  '#48484A',
  '#282E33',
  '#352D28',
  '#2E2A36'
];

/**
 * Deterministic anonymous avatar (24px)
 * Generates flat geometric shape from post/author id in neutral-plus-accent muted palette.
 * Verified or named users use initials in a 1px bordered circle.
 */
export function DeterministicAvatar({ id = "1", name = null, isAnonymous = true, size = 24 }) {
  if (!isAnonymous && name) {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return (
      <div 
        style={{ width: size, height: size }}
        className="rounded-full border border-[#333333] bg-[#161616] flex items-center justify-center text-[10px] font-mono font-medium text-[#EDEDED] shrink-0 select-none"
      >
        {initials}
      </div>
    );
  }

  // Deterministic index from string
  let hash = 0;
  for (let i = 0; i < (id || 'anon').length; i++) {
    hash = (hash << 5) - hash + (id || 'anon').charCodeAt(i);
    hash |= 0;
  }
  const toneIndex = Math.abs(hash) % AVATAR_TONES.length;
  const tone = AVATAR_TONES[toneIndex];
  const shapeType = Math.abs(hash >> 2) % 3; // 0: square, 1: circle, 2: diamond

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className="shrink-0 rounded-[4px] border border-[#232323] select-none"
      style={{ backgroundColor: tone }}
    >
      {shapeType === 0 && (
        <rect x="7" y="7" width="10" height="10" rx="1.5" fill="#6B6B6B" />
      )}
      {shapeType === 1 && (
        <circle cx="12" cy="12" r="5" fill="#6B6B6B" />
      )}
      {shapeType === 2 && (
        <polygon points="12,6 18,12 12,18 6,12" fill="#6B6B6B" />
      )}
    </svg>
  );
}

// Fallback compatibility avatars
export function AnonymousAvatar({ size = 24 }) {
  return <DeterministicAvatar id="anon" size={size} />;
}
export function PublicAvatar({ name, size = 24 }) {
  return <DeterministicAvatar isAnonymous={false} name={name} size={size} />;
}
export function EmptyStateIllustration({ size = 32, className = "" }) {
  return <IconComment size={size} className={className} />;
}

export function IconTrash({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 4h11" />
      <path d="M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4" />
      <path d="M12.5 4v9a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 013.5 13V4" />
      <path d="M6.5 7v4" />
      <path d="M9.5 7v4" />
    </svg>
  );
}

export function IconMoon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function IconSun({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

