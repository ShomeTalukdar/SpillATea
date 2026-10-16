import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import ConfessionCard from '../components/confessions/ConfessionCard';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { IconBookmark } from '../components/icons/Icons';
import { fetchSavedConfessions } from '../services/db';

/**
 * SavedPage — Private Instagram-Style Saved Confessions Collection
 * 
 * - Separate from public likes
 * - Private bookmarking for students
 * - Quick unsave and instant card updates
 */
export default function SavedPage() {
  const [savedConfessions, setSavedConfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    async function loadSaved() {
      setIsLoading(true);
      try {
        const data = await fetchSavedConfessions();
        setSavedConfessions(data || []);
      } catch (err) {
        console.error('Failed to load saved confessions', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleUpdate = (updatedConfession) => {
    // If unsaved, remove from this view
    if (!updatedConfession.is_saved) {
      setSavedConfessions(prev => prev.filter(c => c.id !== updatedConfession.id));
    } else {
      setSavedConfessions(prev => prev.map(c => c.id === updatedConfession.id ? updatedConfession : c));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <Sidebar 
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-16">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-[560px] flex flex-col">
            
            {/* Header */}
            <header className="mb-8 pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 rounded-[6px] bg-[#161616] border border-[#262626] text-[#FF5A1F]">
                  <IconBookmark size={18} filled={true} />
                </span>
                <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                  Saved Confessions
                </h1>
              </div>
              <div className="font-mono text-[12px] text-[#6B6B6B] flex items-center gap-2">
                <span>Your private saved collection</span>
                <span className="text-[#262626]">·</span>
                <span className="text-[#A1A1A1] tabular-nums">
                  {savedConfessions.length} saved
                </span>
              </div>
            </header>

            {/* Content List */}
            {isLoading ? (
              <div className="flex flex-col gap-[36px]">
                {[1, 2].map((n) => (
                  <div 
                    key={n} 
                    className="w-full bg-[#111111] border border-[#262626] rounded-[12px] p-8 flex flex-col gap-4 animate-pulse"
                  >
                    <div className="w-32 h-3 bg-[#161616] rounded" />
                    <div className="w-full h-12 bg-[#161616] rounded" />
                    <div className="w-2/3 h-4 bg-[#161616] rounded" />
                  </div>
                ))}
              </div>
            ) : savedConfessions.length > 0 ? (
              <div className="flex flex-col gap-[40px]">
                {savedConfessions.map((confession) => (
                  <ConfessionCard
                    key={confession.id}
                    confession={confession}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 px-6 text-center border border-dashed border-[#262626] rounded-[12px] bg-[#111111]/40 flex flex-col items-center justify-center gap-3">
                <span className="p-3 rounded-full bg-[#161616] text-[#6B6B6B] mb-1">
                  <IconBookmark size={24} />
                </span>
                <h3 className="text-[17px] font-semibold text-[#EDEDED]">
                  No saved confessions yet
                </h3>
                <p className="text-[13px] text-[#A1A1A1] max-w-[340px] leading-relaxed">
                  Tap the bookmark icon on any confession card to save it here for later. Your saved collection is completely private.
                </p>
                <Link
                  to="/"
                  className="mt-3 px-4 py-2 rounded-[6px] bg-[#161616] hover:bg-[#202020] border border-[#262626] text-[13px] font-mono text-[#EDEDED] transition-colors"
                >
                  Browse today's board →
                </Link>
              </div>
            )}

          </div>
        </main>
      </div>

      <TrendingSidebar />

      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
