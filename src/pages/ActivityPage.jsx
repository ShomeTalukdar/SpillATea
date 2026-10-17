import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import ConfessionCard from '../components/confessions/ConfessionCard';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { IconHeart, IconActivity, IconBookmark } from '../components/icons/Icons';
import { fetchLikedConfessions, fetchUserAuthoredConfessions } from '../services/db';
import { useAuth } from '../context/AuthContext';

/**
 * ActivityPage — "My Activity" (Liked Confessions & My Confessions)
 * 
 * - Tab 1: Liked Confessions (all posts the user liked with heart reactions)
 * - Tab 2: My Confessions (all posts authored by the user)
 */
export default function ActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'authored' ? 'authored' : 'liked';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [likedPosts, setLikedPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function loadActivityData() {
      setIsLoading(true);
      try {
        const [liked, authored] = await Promise.all([
          fetchLikedConfessions(),
          fetchUserAuthoredConfessions()
        ]);
        setLikedPosts(liked || []);
        setMyPosts(authored || []);
      } catch (err) {
        console.error('Failed to load activity', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadActivityData();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleLikedUpdate = (updated) => {
    if (!updated.is_liked) {
      setLikedPosts(prev => prev.filter(c => c.id !== updated.id));
    } else {
      setLikedPosts(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  };

  const handleAuthoredUpdate = (updated) => {
    setMyPosts(prev => prev.map(c => c.id === updated.id ? updated : c));
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
            <header className="mb-6 pb-4 border-b border-[#262626]">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-[6px] bg-[#161616] border border-[#262626] text-[#EDEDED]">
                    <IconActivity size={18} />
                  </span>
                  <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                    My Activity
                  </h1>
                </div>

                <Link
                  to="/saved"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#111111] hover:bg-[#161616] border border-[#262626] text-[12px] font-mono text-[#A1A1A1] hover:text-[#EDEDED] transition-colors"
                >
                  <IconBookmark size={14} />
                  <span>View Saved Posts →</span>
                </Link>
              </div>

              {/* Sub-tabs: Liked Confessions vs My Confessions */}
              <div className="flex items-center gap-6 mt-4 pt-2 font-mono text-[13px] border-t border-[#262626]/40">
                <button
                  type="button"
                  onClick={() => handleTabChange('liked')}
                  className={`relative pb-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'liked' ? 'text-[#EDEDED] font-medium' : 'text-[#6B6B6B] hover:text-[#A1A1A1]'
                  }`}
                >
                  <IconHeart size={14} filled={activeTab === 'liked'} className={activeTab === 'liked' ? 'text-[#FF5A1F]' : ''} />
                  <span>Liked Confessions</span>
                  <span className="tabular-nums px-1.5 py-0.2 rounded bg-[#161616] text-[11px] text-[#A1A1A1]">
                    {likedPosts.length}
                  </span>
                  {activeTab === 'liked' && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#EDEDED]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('authored')}
                  className={`relative pb-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'authored' ? 'text-[#EDEDED] font-medium' : 'text-[#6B6B6B] hover:text-[#A1A1A1]'
                  }`}
                >
                  <span>My Confessions</span>
                  <span className="tabular-nums px-1.5 py-0.2 rounded bg-[#161616] text-[11px] text-[#A1A1A1]">
                    {myPosts.length}
                  </span>
                  {activeTab === 'authored' && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#EDEDED]" />
                  )}
                </button>
              </div>
            </header>

            {/* List Content */}
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
            ) : activeTab === 'liked' ? (
              /* LIKED CONFESSIONS TAB */
              likedPosts.length > 0 ? (
                <div className="flex flex-col gap-[40px]">
                  {likedPosts.map((confession) => (
                    <ConfessionCard
                      key={confession.id}
                      confession={confession}
                      onUpdate={handleLikedUpdate}
                      onDelete={(deletedId) => setLikedPosts(prev => prev.filter(c => c.id !== deletedId))}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 px-6 text-center border border-dashed border-[#262626] rounded-[12px] bg-[#111111]/40 flex flex-col items-center justify-center gap-3">
                  <span className="p-3 rounded-full bg-[#161616] text-[#6B6B6B]">
                    <IconHeart size={24} />
                  </span>
                  <h3 className="text-[17px] font-semibold text-[#EDEDED]">
                    No liked confessions yet
                  </h3>
                  <p className="text-[13px] text-[#A1A1A1] max-w-[340px] leading-relaxed">
                    Double-click or tap the heart on any confession that resonates with you to find it saved here.
                  </p>
                  <Link
                    to="/"
                    className="mt-3 px-4 py-2 rounded-[6px] bg-[#161616] hover:bg-[#202020] border border-[#262626] text-[13px] font-mono text-[#EDEDED] transition-colors"
                  >
                    Explore confessions board →
                  </Link>
                </div>
              )
            ) : (
              /* MY CONFESSIONS TAB */
              myPosts.length > 0 ? (
                <div className="flex flex-col gap-[40px]">
                  {myPosts.map((confession) => (
                    <div key={confession.id} className="relative">
                      <div className="mb-2 px-1 flex items-center justify-between text-[11px] font-mono text-[#6B6B6B]">
                        <span className="text-[#FF5A1F]">● Published by you</span>
                        <span>{confession.day_label || confession.date_key}</span>
                      </div>
                      <ConfessionCard
                        confession={confession}
                        onUpdate={handleAuthoredUpdate}
                        onDelete={(deletedId) => setMyPosts(prev => prev.filter(c => c.id !== deletedId))}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 px-6 text-center border border-dashed border-[#262626] rounded-[12px] bg-[#111111]/40 flex flex-col items-center justify-center gap-3">
                  <h3 className="text-[17px] font-semibold text-[#EDEDED]">
                    You haven't spilled yet
                  </h3>
                  <p className="text-[13px] text-[#A1A1A1] max-w-[340px] leading-relaxed">
                    Share an anonymous crush, academic stress, or late-night thought with your campus.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-3 px-4 py-2 rounded-[6px] bg-[#FF5A1F] hover:bg-[#ff6e38] text-[13px] font-semibold text-[#0A0A0A] transition-colors"
                  >
                    Spill Something Now
                  </button>
                </div>
              )
            )}

          </div>
        </main>
      </div>

      <TrendingSidebar />

      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={(newPost) => setMyPosts(prev => [newPost, ...prev])}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
