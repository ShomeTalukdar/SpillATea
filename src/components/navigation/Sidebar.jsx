import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  BrandWordmark, 
  IconHome, 
  IconSearch, 
  IconCreatePost, 
  IconNotifications, 
  IconProfile, 
  IconAdmin,
  AnonymousAvatar,
  PublicAvatar
} from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, isAdmin, toggleAdminRole } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', icon: IconHome },
    { to: '/search', label: 'Search', icon: IconSearch },
    { to: '/create', label: 'Create Post', icon: IconCreatePost, highlight: true },
    { to: '/notifications', label: 'Notifications', icon: IconNotifications, badge: 2 },
    { to: '/profile', label: 'Profile', icon: IconProfile },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Moderation', icon: IconAdmin });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#151518] border-r border-[#2A2A2F] p-4 shrink-0 select-none justify-between z-20">
      <div className="flex flex-col gap-6">
        {/* Brand wordmark */}
        <Link to="/" className="px-2 py-1 outline-none">
          <BrandWordmark />
        </Link>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-smooth
                  ${isActive 
                    ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#2A2A2F]' 
                    : 'text-[#A0A0A8] hover:text-[#F0F0F2] hover:bg-[#1C1C20]/50 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} className="shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[11px] font-semibold bg-[#2A2A2F] text-[#F07845] px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Create post action button */}
        <button
          onClick={() => navigate('/create')}
          className="w-full py-2.5 px-4 bg-[#F07845] hover:bg-[#e06b3a] text-[#0D0D0F] font-semibold rounded-lg text-sm transition-smooth flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <IconCreatePost size={17} />
          <span>New Post</span>
        </button>
      </div>

      {/* Bottom controls: User card & legal links */}
      <div className="flex flex-col gap-4 border-t border-[#2A2A2F] pt-4">
        {/* Role toggle pill for reviewer demonstration */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1C1C20] border border-[#2A2A2F] rounded-lg text-xs">
          <span className="text-[#A0A0A8]">Role:</span>
          <button
            onClick={toggleAdminRole}
            className="flex items-center gap-1.5 font-medium text-[#F0F0F2] hover:text-[#F07845] cursor-pointer transition-smooth"
            title="Click to toggle between Student and Moderator Admin role"
          >
            <span>{isAdmin ? 'Moderator Admin' : 'Student'}</span>
            <span className="text-[10px] text-[#777780] border border-[#2A2A2F] px-1 rounded bg-[#151518]">
              Switch
            </span>
          </button>
        </div>

        {/* User preview */}
        <Link 
          to="/profile" 
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#1C1C20] transition-smooth text-left"
        >
          <PublicAvatar name={user.name} size={32} />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[#F0F0F2] truncate">{user.name}</span>
            <span className="text-[11px] text-[#777780] truncate">{user.email}</span>
          </div>
        </Link>

        {/* Legal links */}
        <div className="flex items-center justify-between px-2 text-[11px] text-[#777780]">
          <Link to="/terms" className="hover:text-[#A0A0A8] transition-smooth">Terms</Link>
          <span>&bull;</span>
          <Link to="/privacy" className="hover:text-[#A0A0A8] transition-smooth">Privacy</Link>
          <span>&bull;</span>
          <span>v1.0</span>
        </div>
      </div>
    </aside>
  );
}
