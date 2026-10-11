import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  IconHome, 
  IconSearch, 
  IconCreatePost, 
  IconNotifications, 
  IconProfile, 
  IconAdmin 
} from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const { isAdmin } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#151518]/95 backdrop-blur-md border-t border-[#2A2A2F] px-3 py-2 flex items-center justify-around">
      <NavLink
        to="/"
        className={({ isActive }) => `
          flex flex-col items-center gap-1 p-1 text-xs font-medium transition-smooth
          ${isActive ? 'text-[#F07845]' : 'text-[#777780] hover:text-[#A0A0A8]'}
        `}
      >
        <IconHome size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) => `
          flex flex-col items-center gap-1 p-1 text-xs font-medium transition-smooth
          ${isActive ? 'text-[#F07845]' : 'text-[#777780] hover:text-[#A0A0A8]'}
        `}
      >
        <IconSearch size={20} />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/create"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F07845] text-[#0D0D0F] font-bold shadow-md -mt-3 border-2 border-[#151518] hover:bg-[#e06b3a] transition-smooth"
        aria-label="Create Post"
      >
        <IconCreatePost size={20} />
      </NavLink>

      <NavLink
        to="/notifications"
        className={({ isActive }) => `
          flex flex-col items-center gap-1 p-1 text-xs font-medium transition-smooth
          ${isActive ? 'text-[#F07845]' : 'text-[#777780] hover:text-[#A0A0A8]'}
        `}
      >
        <IconNotifications size={20} />
        <span>Inbox</span>
      </NavLink>

      {isAdmin ? (
        <NavLink
          to="/admin"
          className={({ isActive }) => `
            flex flex-col items-center gap-1 p-1 text-xs font-medium transition-smooth
            ${isActive ? 'text-[#F07845]' : 'text-[#777780] hover:text-[#A0A0A8]'}
          `}
        >
          <IconAdmin size={20} />
          <span>Admin</span>
        </NavLink>
      ) : (
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex flex-col items-center gap-1 p-1 text-xs font-medium transition-smooth
            ${isActive ? 'text-[#F07845]' : 'text-[#777780] hover:text-[#A0A0A8]'}
          `}
        >
          <IconProfile size={20} />
          <span>Profile</span>
        </NavLink>
      )}
    </nav>
  );
}
