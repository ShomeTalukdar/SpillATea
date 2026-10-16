import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconClose } from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';

export default function CommandPalette({ isOpen, onClose, onOpenCreate }) {
  const navigate = useNavigate();
  const { isAdmin, toggleAdminRole } = useAuth();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { section: 'NAVIGATION', label: 'Go to Campus Feed', shortcut: 'G H', action: () => { navigate('/'); onClose(); } },
    { section: 'NAVIGATION', label: 'Go to Search', shortcut: '/', action: () => { navigate('/search'); onClose(); } },
    { section: 'NAVIGATION', label: 'Go to Profile', shortcut: 'G P', action: () => { navigate('/profile'); onClose(); } },
    { section: 'NAVIGATION', label: 'Open Moderation Console', shortcut: 'G M', action: () => { navigate('/admin'); onClose(); } },
    { section: 'ACTIONS', label: 'Create New Spill', shortcut: 'N', action: () => { onClose(); onOpenCreate(); } },
    { section: 'ACTIONS', label: `Toggle Role (Currently: ${isAdmin ? 'Moderator' : 'Student'})`, shortcut: 'T', action: () => { toggleAdminRole(); onClose(); } },
    { section: 'FILTER', label: 'Filter: Confessions', shortcut: '#C', action: () => { navigate('/search?category=Confessions'); onClose(); } },
    { section: 'FILTER', label: 'Filter: Academics', shortcut: '#A', action: () => { navigate('/search?category=Academics'); onClose(); } },
    { section: 'FILTER', label: 'Filter: Rants', shortcut: '#R', action: () => { navigate('/search?category=Rants'); onClose(); } },
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.section.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-[560px] bg-[#111111] border border-[#232323] rounded-[8px] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 py-3 border-b border-[#232323]">
          <IconSearch size={15} className="text-[#6B6B6B] mr-2.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-[14px] text-[#EDEDED] placeholder-[#6B6B6B] outline-none font-normal"
            autoFocus
          />
          <button 
            type="button" 
            onClick={onClose} 
            className="text-[#6B6B6B] hover:text-[#EDEDED] p-1 cursor-pointer"
          >
            <IconClose size={14} />
          </button>
        </div>

        {/* Results grouped with mono labels */}
        <div className="max-h-[320px] overflow-y-auto p-1.5 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-[13px] text-[#6B6B6B]">
              no matching commands.
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={cmd.action}
                className="w-full text-left px-2.5 py-2 rounded-[6px] hover:bg-[#161616] flex items-center justify-between transition-fast cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] w-20">
                    {cmd.section}
                  </span>
                  <span className="text-[13.5px] text-[#EDEDED] group-hover:text-white">
                    {cmd.label}
                  </span>
                </div>
                <kbd className="font-mono text-[10.5px] text-[#6B6B6B] bg-[#161616] border border-[#232323] px-1.5 py-0.5 rounded">
                  {cmd.shortcut}
                </kbd>
              </button>
            ))
          )}
        </div>

        {/* Bottom hints */}
        <div className="px-3.5 py-2 border-t border-[#232323] flex items-center justify-between text-[11px] font-mono text-[#6B6B6B]">
          <span>Navigation</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
