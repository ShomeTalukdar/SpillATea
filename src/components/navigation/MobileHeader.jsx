import React from 'react';
import { Link } from 'react-router-dom';
import { BrandWordmark, IconSearch, IconSettings } from '../icons/Icons';

export default function MobileHeader() {
  return (
    <header 
      className="md:hidden sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <Link to="/" className="outline-none">
        <BrandWordmark size={22} />
      </Link>
      <div className="flex items-center gap-1">
        <Link 
          to="/search" 
          className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-fast"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          aria-label="Search"
        >
          <IconSearch size={18} />
        </Link>
        <Link 
          to="/settings" 
          className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-fast"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          aria-label="Settings"
        >
          <IconSettings size={18} />
        </Link>
      </div>
    </header>
  );
}
