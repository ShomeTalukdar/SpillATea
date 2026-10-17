import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import ConfessionCard from '../components/confessions/ConfessionCard';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { IconActivity, IconBookmark } from '../components/icons/Icons';
import { fetchUserAuthoredConfessions } from '../services/db';
import { useAuth } from '../context/AuthContext';

/**
 * ActivityPage — "My Activity" (User-Authored Confessions)
 * 
 * - Displays all confessions authored/published by the authenticated student
 * - Real-time update & deletion support
 * - Direct link to saved posts collection
 */
export default function ActivityPage() {
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function loadActivityData() {
      setIsLoading(true);
      try {
        const authored = await fetchUserAuthoredConfessions();
        setMyPosts(authored || []);
      } catch (err) {
        console.error('Failed to load activity', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadActivityData();
  }, []);

  const handleAuthoredUpdate = (updated) => {
    setMyPosts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  return (
    <div 
      className="min-h-screen w-full flex justify-center"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <div className="w-full max-w-[1200px] flex justify-center min-h-screen">
        <Sidebar 
          onOpenCreateModal={() => setIsCreateOpen(true)}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0 max-w-[640px] pb-20 md:pb-16">
          <MobileHeader />

          <main className="flex-1 flex flex-col px-4 sm:px-6 py-6 sm:py-10">
            <div className="w-full max-w-[560px] mx-auto flex flex-col">
              
              {/* Header */}
              <header className="mb-8 pb-4 border-b border-[#262626]">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-[6px] bg-[#161616] border border-[#262626] text-[#EDEDED]">
                      <IconActivity size={18} />
                    </span>
                    <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight font-sans">
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

                <div className="font-mono text-[12px] text-[#6B6B6B] flex items-center justify-between flex-wrap gap-2 pt-1">
                  <span>Confessions published by you on campus</span>
                  <span className="tabular-nums text-[#A1A1A1]">
                    {myPosts.length} {myPosts.length === 1 ? 'confession' : 'confessions'} published
                  </span>
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
              ) : myPosts.length > 0 ? (
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
                  <span className="p-3 rounded-full bg-[#161616] text-[#FF5A1F]">
                    <IconActivity size={24} />
                  </span>
                  <h3 className="text-[17px] font-semibold text-[#EDEDED]">
                    You haven't spilled yet
                  </h3>
                  <p className="text-[13px] text-[#A1A1A1] max-w-[340px] leading-relaxed">
                    Share an anonymous crush, academic stress, or late-night thought with your campus.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-spill-tea mt-3 h-[38px] px-5 text-[13px]"
                  >
                    <span>Spill Something Now</span>
                  </button>
                </div>
              )}

            </div>
          </main>
        </div>

        <TrendingSidebar />
      </div>

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
