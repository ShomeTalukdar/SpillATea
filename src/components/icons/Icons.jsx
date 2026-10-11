import React from 'react';

// Original custom SVG icons for CampusEcho
// Designed with a unified 20x20 / 24x24 geometric language, 1.75px stroke width.

export function BrandLogo({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-label="CampusEcho Logo">
      <rect width="32" height="32" rx="8" fill="#151518" stroke="#2A2A2F" strokeWidth="1" />
      <rect x="7" y="12" width="3" height="8" rx="1.5" fill="#F07845" />
      <rect x="12" y="8" width="3" height="16" rx="1.5" fill="#F0F0F2" />
      <rect x="17" y="10" width="3" height="12" rx="1.5" fill="#F0F0F2" />
      <rect x="22" y="13" width="3" height="6" rx="1.5" fill="#A0A0A8" />
    </svg>
  );
}

export function BrandWordmark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <BrandLogo size={28} />
      <div className="flex flex-col">
        <span className="font-semibold tracking-tight text-[17px] text-[#F0F0F2] leading-none">
          Campus<span className="text-[#F07845]">Echo</span>
        </span>
        <span className="text-[10px] text-[#777780] tracking-wider uppercase mt-0.5 font-medium">
          College Community
        </span>
      </div>
    </div>
  );
}

export function IconHome({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

export function IconSearch({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

export function IconCreatePost({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconNotifications({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function IconProfile({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 20.5a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function IconComment({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H8l-5 4v-15.5z" />
    </svg>
  );
}

export function IconShare({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

export function IconLike({ size = 20, active = false, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={active ? "#F07845" : "none"} 
      stroke={active ? "#F07845" : "currentColor"} 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 4.5l-6 6.5h4v8.5h4V11h4l-6-6.5z" />
    </svg>
  );
}

export function IconDislike({ size = 20, active = false, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={active ? "#777780" : "none"} 
      stroke={active ? "#A0A0A8" : "currentColor"} 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 19.5l6-6.5h-4V4.5h-4V13H6l6 6.5z" />
    </svg>
  );
}

export function IconReport({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 21V4" />
      <path d="M5 4h12.5l-2 5 2 5H5" />
    </svg>
  );
}

export function IconAdmin({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3L4 6.5v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10v-6L12 3z" />
      <path d="M9.5 12l2 2 3.5-3.5" />
    </svg>
  );
}

export function IconSettings({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function IconBack({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export function IconClose({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function IconCheck({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconCopy({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function IconLock({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IconAlert({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function IconEye({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconTrash({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

export function IconFilter({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 5h18" />
      <path d="M6 12h12" />
      <path d="M10 19h4" />
    </svg>
  );
}

export function IconMore({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  );
}

// Consistent Avatar Placeholders
export function AnonymousAvatar({ size = 36, className = "" }) {
  return (
    <div 
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#1C1C20] border border-[#2A2A2F] flex items-center justify-center shrink-0 ${className}`}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
        <path d="M10 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill="#777780" />
        <path d="M4 17.5c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#777780" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="6" r="1" fill="#0D0D0F" />
      </svg>
    </div>
  );
}

export function PublicAvatar({ name = "Student", size = 36, className = "" }) {
  const initial = name ? name.charAt(0).toUpperCase() : "S";
  return (
    <div 
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#2A2A2F] border border-[#3A3A42] flex items-center justify-center text-[#F0F0F2] font-semibold text-xs shrink-0 select-none ${className}`}
    >
      {initial}
    </div>
  );
}

// Empty state line illustration (no emojis, restrained geometric shapes)
export function EmptyStateIllustration({ size = 80, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="15" y="20" width="50" height="40" rx="8" stroke="#2A2A2F" strokeWidth="1.5" />
      <line x1="25" y1="32" x2="55" y2="32" stroke="#2A2A2F" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25" y1="40" x2="45" y2="40" stroke="#2A2A2F" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25" y1="48" x2="35" y2="48" stroke="#2A2A2F" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="55" cy="48" r="4" stroke="#F07845" strokeWidth="1.5" />
    </svg>
  );
}
