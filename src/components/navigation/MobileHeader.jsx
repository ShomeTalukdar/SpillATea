import React from 'react';
import { Link } from 'react-router-dom';
import { BrandWordmark, IconSearch, IconNotifications } from '../icons/Icons';

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-[#151518]/95 backdrop-blur-md border-b border-[#2A2A2F] px-4 py-3 flex items-center justify-between">
      <Link to="/" className="outline-none">
        <BrandWordmark />
      </Link>
      <div className="flex items-center gap-3">
        <Link 
          to="/search" 
          className="text-[#A0A0A8] hover:text-[#F0F0F2] p-1.5 rounded-md hover:bg-[#1C1C20] transition-smooth"
          aria-label="Search"
        >
          <IconSearch size={19} />
        </Link>
        <Link 
          to="/notifications" 
          className="text-[#A0A0A8] hover:text-[#F0F0F2] p-1.5 rounded-md hover:bg-[#1C1C20] transition-smooth relative"
          aria-label="Notifications"
        >
          <IconNotifications size={19} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F07845]" />
        </Link>
      </div>
    </header>
  );
}
