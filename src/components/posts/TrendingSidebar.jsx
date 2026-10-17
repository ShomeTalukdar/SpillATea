import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTodayStats, checkBackendStatus } from '../../services/db';
import { IconLock } from '../icons/Icons';

/**
 * TrendingSidebar — Right Panel (320px)
 * 
 * 1. "Today so far": total confessions, total likes, most liked confession with link
 * 2. "Categories": clean topic links
 * 3. "Anonymous by design": privacy guarantee with lock icon
 * 4. Keyboard shortcuts guide
 */
export default function TrendingSidebar({ onSelectConfession = null }) {
  const [stats, setStats] = useState({
    totalConfessions: 8,
    totalLikes: 609,
    mostLiked: null
  });
  const [dbStatus, setDbStatus] = useState({ isAvailable: false, isDbConnected: false });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchTodayStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load today stats', e);
      }
    }
    async function loadDbStatus() {
      try {
        const status = await checkBackendStatus();
        setDbStatus(status);
      } catch (e) {}
    }
    loadStats();
    loadDbStatus();
  }, []);

  const categories = [
    { name: 'Crushes', count: 3 },
    { name: 'Confessions', count: 2 },
    { name: 'Lost & Found', count: 1 },
    { name: 'Late Night', count: 1 },
    { name: 'Academics', count: 1 }
  ];

  const getShortenedQuote = (text, maxLength = 95) => {
    if (!text) return '';
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) return trimmed;
    const sub = trimmed.slice(0, maxLength);
    const lastSpace = sub.lastIndexOf(' ');
    return (lastSpace > 50 ? sub.slice(0, lastSpace) : sub).trim() + '…';
  };

  return (
    <aside 
      className="hidden lg:flex flex-col w-[320px] h-screen sticky top-0 px-5 py-6 border-l shrink-0 overflow-hidden text-left select-none justify-between"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      
      {/* Top Container */}
      <div className="flex flex-col">
        {/* SECTION 1: TODAY SO FAR / STATS */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span 
              className="font-mono text-[11px] uppercase tracking-[0.08em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Today so far
            </span>
            <span 
              className="font-mono text-[11px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Daily overview
            </span>
          </div>

          <div className="flex items-center gap-6 py-2">
            <div>
              <div 
                className="font-sans text-[28px] font-semibold tabular-nums leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {stats.totalConfessions}
              </div>
              <div 
                className="font-mono text-[11px] uppercase tracking-wider mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Confessions
              </div>
            </div>
            <div className="w-[1px] h-8" style={{ backgroundColor: 'var(--border)' }} />
            <div>
              <div 
                className="font-sans text-[28px] font-semibold tabular-nums leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {stats.totalLikes}
              </div>
              <div 
                className="font-mono text-[11px] uppercase tracking-wider mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Total Likes
              </div>
            </div>
          </div>

          {/* Most liked today */}
          {stats.mostLiked && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span 
                className="font-mono text-[11px] uppercase tracking-wider block mb-1.5"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Most liked today ({stats.mostLiked.likes} likes)
              </span>
              <Link
                to={`/post/${stats.mostLiked.id}`}
                onClick={(e) => {
                  if (onSelectConfession) {
                    e.preventDefault();
                    onSelectConfession(stats.mostLiked.id);
                  }
                }}
                className="font-confession text-[14px] leading-[1.45] block transition-colors group cursor-pointer"
                style={{ 
                  color: 'var(--text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.textUnderlineOffset = '3px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.textDecoration = 'none';
                }}
                title="View most liked confession"
              >
                "{getShortenedQuote(stats.mostLiked.body || stats.mostLiked.content, 95)}"
              </Link>
            </div>
          )}
        </div>

        {/* SECTION 2: CATEGORIES (24px spacing, plain rows 40px high) */}
        <div className="flex flex-col mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span 
              className="font-mono text-[11px] uppercase tracking-[0.08em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Categories
            </span>
            <span 
              className="font-mono text-[11px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              today
            </span>
          </div>

          <div className="flex flex-col">
            {categories.map((cat, idx) => (
              <Link
                key={cat.name}
                to={`/search?q=${cat.name}`}
                className={`h-[40px] px-2 flex items-center justify-between transition-colors rounded-[6px] ${
                  idx === categories.length - 1 ? '' : 'border-b'
                }`}
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span 
                  className="font-sans text-[14px]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {cat.name}
                </span>
                <span 
                  className="font-mono text-[13px] tabular-nums"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: ANONYMOUS BY DESIGN (24px spacing) */}
        <div className="flex flex-col mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <IconLock size={14} className="shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <span 
              className="font-sans text-[14px] font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Anonymous by design
            </span>
          </div>
          <p 
            className="text-[13px] leading-[1.6] font-sans"
            style={{ color: 'var(--text-secondary)' }}
          >
            SpillATea never exposes real student names, emails, or account IDs to other students. All confessions are strictly anonymous to ensure open campus conversation.
          </p>
        </div>

        {/* DATABASE ENGINE STATUS */}
        <div 
          className="mt-4 px-3 py-2 rounded-md border flex items-center justify-between text-[11px] font-mono"
          style={{ 
            backgroundColor: 'var(--surface-sunken)', 
            borderColor: 'var(--border)' 
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className={`w-1.5 h-1.5 rounded-full ${dbStatus.isDbConnected ? 'bg-[#10B981]' : 'bg-[#F06A3A]'}`} 
            />
            <span style={{ color: 'var(--text-secondary)' }}>ENGINE</span>
          </div>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {dbStatus.isDbConnected ? 'MongoDB Atlas' : dbStatus.isAvailable ? 'Express (Connecting)' : 'MongoDB Ready'}
          </span>
        </div>
      </div>

      {/* KEYBOARD SHORTCUTS HINT: pinned to the bottom with a 1px --border above */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <div className="flex items-center gap-2">
            <kbd 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border"
              style={{ 
                backgroundColor: 'var(--surface-sunken)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
            >
              J / K
            </kbd>
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-tertiary)' }}>next / prev</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border"
              style={{ 
                backgroundColor: 'var(--surface-sunken)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
            >
              L
            </kbd>
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-tertiary)' }}>like</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border"
              style={{ 
                backgroundColor: 'var(--surface-sunken)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
            >
              C
            </kbd>
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-tertiary)' }}>comment</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border"
              style={{ 
                backgroundColor: 'var(--surface-sunken)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
            >
              N
            </kbd>
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-tertiary)' }}>new spill</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border"
              style={{ 
                backgroundColor: 'var(--surface-sunken)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
            >
              /
            </kbd>
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-tertiary)' }}>search</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd 
              className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border"
              style={{ 
                backgroundColor: 'var(--surface-sunken)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
            >
              ⌘K
            </kbd>
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-tertiary)' }}>palette</span>
          </div>
        </div>
      </div>

    </aside>
  );
}
