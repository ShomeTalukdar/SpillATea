import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  BrandWordmark, 
  IconHome, 
  IconSearch, 
  IconBookmark,
  IconActivity,
  IconSettings,
  IconAdmin,
  IconCommand
} from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar (240px) — Daily Confession Board Left Nav
 * 
 * - Fixed 240px, clean monochrome
 * - Items: Today, Search, Saved, My Activity, Settings, (Moderation)
 * - Quick activity sub-links: "My confessions" & "Liked confessions"
 * - 2px accent indicator on left edge for active items
 * - Quiet user info & role toggle
 */
export default function Sidebar({ onOpenCreateModal, onOpenCommandPalette }) {
  const { user, isAdmin, toggleAdminRole, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const primaryNav = [
    { to: '/', label: 'Today', icon: IconHome },
    { to: '/search', label: 'Search', icon: IconSearch },
    { to: '/saved', label: 'Saved', icon: IconBookmark },
    { to: '/activity', label: 'My Activity', icon: IconActivity },
    { to: '/settings', label: 'Settings', icon: IconSettings },
  ];

  if (isAdmin) {
    primaryNav.push({ to: '/admin', label: 'Moderation', icon: IconAdmin });
  }

  return (
    <aside 
      className="hidden md:flex flex-col w-[240px] h-screen sticky top-0 border-r px-3.5 pt-5 pb-5 shrink-0 select-none justify-between z-20"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="flex flex-col gap-4">
        {/* Brand Header: Prominent logo and title with balanced spacing */}
        <div className="w-full pt-0.5 pb-1 flex items-center justify-center">
          <Link to="/" className="outline-none flex items-center justify-center transition-opacity hover:opacity-90">
            <BrandWordmark size={32} textSize="text-[24px] font-bold" />
          </Link>
        </div>

        {/* Primary Action Button: Filled orange capsule button */}
        <button
          type="button"
          onClick={() => {
            if (!user) {
              openAuthModal('Please sign in with your college email to spill a confession.');
              return;
            }
            if (onOpenCreateModal) onOpenCreateModal();
            else navigate('/create');
          }}
          className="btn-spill-tea w-full h-[42px] text-[14px]"
        >
          <span>Spill Something</span>
        </button>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-1 pt-1">
          <span 
            className="font-mono text-[11px] uppercase tracking-[0.08em] px-2.5 pb-1 select-none"
            style={{ color: 'var(--text-tertiary)' }}
          >
            MENU
          </span>

          <nav className="flex flex-col gap-1" aria-label="Main Navigation">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={(e) => {
                    if (item.to === '/settings' && !user) {
                      e.preventDefault();
                      openAuthModal('Please sign in with your college email to access account settings.');
                      return;
                    }
                    if ((item.to === '/saved' || item.to === '/activity') && !user) {
                      e.preventDefault();
                      openAuthModal(`Please sign in with your college email to view your ${item.label.toLowerCase()}.`);
                      return;
                    }
                  }}
                  className={({ isActive }) =>
                    `relative flex items-center justify-between h-[40px] px-3 rounded-[6px] text-[14px] font-sans transition-colors cursor-pointer ${
                      isActive ? 'font-medium' : 'font-normal'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                  })}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    if (!el.getAttribute('aria-current')) {
                      el.style.backgroundColor = 'var(--sidebar-hover)';
                      el.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    if (!el.getAttribute('aria-current')) {
                      el.style.backgroundColor = 'transparent';
                      el.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {/* 2px accent indicator on left edge for active item */}
                      {isActive && (
                        <span 
                          className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r-sm"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />
                      )}
                      <div className="flex items-center gap-2.5">
                        <Icon 
                          size={16} 
                          className="shrink-0"
                          style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }} 
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span 
                          className="font-mono text-[10.5px] tabular-nums px-1.5 py-0.5 rounded border"
                          style={{ 
                            backgroundColor: 'var(--surface-sunken)', 
                            borderColor: 'var(--border)', 
                            color: 'var(--text-secondary)' 
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

      </div>

      {/* User Footer: 20px bottom padding, sans 12px role line */}
      <div 
        className="pt-3 border-t flex items-center justify-between text-left"
        style={{ borderColor: 'var(--border)' }}
      >
        {user ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col min-w-0 leading-tight">
              <span 
                className="text-[13px] font-medium font-sans truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {user.displayName || user.name || 'Anonymous Student'}
              </span>
              <span 
                className="text-[11px] font-sans truncate mt-0.5"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {isAdmin ? 'Campus Moderator' : 'Verified Student'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleAdminRole}
                className="px-1.5 py-0.5 rounded-[4px] border font-mono text-[10px] transition-colors cursor-pointer"
                style={{ 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--surface-sunken)'
                }}
                title="Toggle Student / Moderator role"
              >
                {isAdmin ? 'MOD' : 'STU'}
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-1.5 py-0.5 rounded-[4px] border font-mono text-[10px] transition-colors cursor-pointer hover:text-red-400"
                style={{ 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--surface-sunken)'
                }}
                title="Sign out of account"
              >
                Exit
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal()}
            className="w-full py-2 px-3 rounded-lg border border-[#F06A3A]/40 bg-[#F06A3A]/10 text-[#F06A3A] hover:bg-[#F06A3A]/20 font-medium text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Spill</span>
          </button>
        )}
      </div>
    </aside>
  );
}
