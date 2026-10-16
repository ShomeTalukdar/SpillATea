import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  IconHome, 
  IconSearch, 
  IconBookmark, 
  IconActivity,
  IconAdmin 
} from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav({ onOpenCreate }) {
  const { isAdmin } = useAuth();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t px-3 h-[52px] flex items-center justify-around select-none"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <NavLink
        to="/"
        className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[6px] transition-fast"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'
        })}
        aria-label="Home"
      >
        <IconHome size={18} />
      </NavLink>

      <NavLink
        to="/search"
        className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[6px] transition-fast"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'
        })}
        aria-label="Search"
      >
        <IconSearch size={18} />
      </NavLink>

      {/* Center "Spill" action in minimalist black glass capsule with orange glow */}
      <button
        type="button"
        onClick={onOpenCreate}
        className="btn-spill-tea flex items-center justify-center min-w-[42px] min-h-[42px] w-[42px] h-[42px] p-0"
        aria-label="Spill Something"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 shrink-0" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <NavLink
        to="/saved"
        className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[6px] transition-fast relative"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'
        })}
        aria-label="Saved Confessions"
      >
        <IconBookmark size={18} />
      </NavLink>

      <NavLink
        to={isAdmin ? "/admin" : "/activity"}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[6px] transition-fast"
        style={({ isActive }) => ({
          color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'
        })}
        aria-label={isAdmin ? "Admin" : "Activity"}
      >
        {isAdmin ? <IconAdmin size={18} /> : <IconActivity size={18} />}
      </NavLink>
    </nav>
  );
}

