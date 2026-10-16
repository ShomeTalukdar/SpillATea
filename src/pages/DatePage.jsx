import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import ConfessionCard from '../components/confessions/ConfessionCard';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { IconCalendar, IconBack } from '../components/icons/Icons';
import { fetchConfessions } from '../services/db';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * DatePage — Dedicated Archive Page for a Picked Calendar Date (/date/:dateKey)
 * 
 * - Shows confessions dropped on the chosen date
 * - Direct back navigation to calendar
 */
export default function DatePage() {
  const { dateKey } = useParams();
  const navigate = useNavigate();

  const [confessions, setConfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    async function loadDateConfessions() {
      setIsLoading(true);
      try {
        const data = await fetchConfessions({ date: dateKey });
        setConfessions(data || []);
      } catch (err) {
        console.error('Failed to load confessions for date', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDateConfessions();
  }, [dateKey]);

  // Format date display (e.g. Wednesday, 14 October 2026)
  const formatDateLabel = (str) => {
    try {
      const parts = (str || '').split('-');
      if (parts.length < 3) return str;
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
      const day = d.getDate();
      const month = MONTH_NAMES[d.getMonth()];
      const year = d.getFullYear();
      return `${weekday}, ${day} ${month} ${year}`;
    } catch (e) {
      return str;
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
            
            {/* Back button to calendar */}
            <div className="mb-4">
              <Link
                to="/?tab=pick_date"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#A1A1A1] hover:text-[#EDEDED] transition-colors"
              >
                <IconBack size={14} />
                <span>Back to calendar</span>
              </Link>
            </div>

            {/* Header */}
            <header className="mb-8 pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                  {formatDateLabel(dateKey)}
                </h1>
              </div>
              <div className="font-mono text-[12px] text-[#6B6B6B] flex items-center gap-2">
                <span>Campus confessions</span>
                <span className="text-[#262626]">·</span>
                <span className="text-[#A1A1A1] tabular-nums">
                  {confessions.length} {confessions.length === 1 ? 'confession' : 'confessions'} archived
                </span>
              </div>
            </header>

            {/* Confessions Feed */}
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
            ) : confessions.length > 0 ? (
              <div className="flex flex-col gap-[40px]">
                {confessions.map((confession) => (
                  <ConfessionCard
                    key={confession.id}
                    confession={confession}
                    onUpdate={(updated) => {
                      setConfessions(prev => prev.map(c => c.id === updated.id ? updated : c));
                    }}
                    onDelete={(deletedId) => {
                      setConfessions(prev => prev.filter(c => c.id !== deletedId));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 px-6 text-center border border-dashed border-[#262626] rounded-[12px] bg-[#111111]/40 flex flex-col items-center justify-center gap-3">
                <span className="p-3 rounded-full bg-[#161616] text-[#6B6B6B]">
                  <IconCalendar size={24} />
                </span>
                <h3 className="text-[17px] font-semibold text-[#EDEDED]">
                  No confessions on this date
                </h3>
                <p className="text-[13px] text-[#A1A1A1] max-w-[340px] leading-relaxed">
                  No confessions were recorded on {formatDateLabel(dateKey)}. The campus board was quiet.
                </p>
                <Link
                  to="/?tab=pick_date"
                  className="mt-3 px-4 py-2 rounded-[6px] bg-[#161616] hover:bg-[#202020] border border-[#262626] text-[13px] font-mono text-[#EDEDED] transition-colors"
                >
                  ← Choose another date
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
