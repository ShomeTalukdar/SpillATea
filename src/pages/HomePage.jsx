import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import ConfessionCard from '../components/confessions/ConfessionCard';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { 
  fetchConfessions, 
  fetchConfessionsGroupedByWeek,
  markConfessionRead, 
  fetchReadConfessionIds,
  toggleLikeConfession,
  toggleSaveConfession 
} from '../services/db';
import { IconCalendar } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';

const DAY_TABS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This week' },
  { id: 'pick_date', label: 'Pick a date' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  const tabFromUrl = searchParams.get('tab');
  const [selectedDayTab, setSelectedDayTab] = useState(tabFromUrl || 'today');
  const [todayConfessions, setTodayConfessions] = useState([]);
  const [yesterdayConfessions, setYesterdayConfessions] = useState([]);
  const [weekGroups, setWeekGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pick a date calendar state
  const [calendarMonth, setCalendarMonth] = useState(9); // 0-indexed: 9 = October
  const [calendarYear, setCalendarYear] = useState(2026);

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== selectedDayTab) {
      setSelectedDayTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Read progress tracking
  const [readIds, setReadIds] = useState([]);

  // Keyboard navigation & modal state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const containerRef = useRef(null);

  // Load initial confessions
  useEffect(() => {
    async function loadBoard() {
      setIsLoading(true);
      try {
        const [todayData, yesterdayData, weekData] = await Promise.all([
          fetchConfessions({ day: 'today' }),
          fetchConfessions({ day: 'yesterday' }),
          fetchConfessionsGroupedByWeek()
        ]);
        const reads = fetchReadConfessionIds();

        setTodayConfessions(todayData || []);
        setYesterdayConfessions(yesterdayData || []);
        setWeekGroups(weekData || []);
        setReadIds(reads);
      } catch (err) {
        console.error('Failed to load confessions', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBoard();
  }, [isAdmin]);

  // Load week groups when This Week tab selected
  useEffect(() => {
    async function loadWeek() {
      if (selectedDayTab === 'this_week') {
        const data = await fetchConfessionsGroupedByWeek();
        setWeekGroups(data || []);
      }
    }
    loadWeek();
  }, [selectedDayTab]);



  // Intersection observer to mark confessions as read as user scrolls
  useEffect(() => {
    if (todayConfessions.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('confession-', '');
            if (id && !readIds.includes(id)) {
              markConfessionRead(id);
              setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll('article[id^="confession-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [todayConfessions, readIds]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
        return;
      }

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsCreateOpen(true);
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        navigate('/search');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleConfessionCreated = (newConfession) => {
    setTodayConfessions((prev) => [newConfession, ...prev]);
  };

  // Calculate read progress percentage
  const readProgress = todayConfessions.length > 0 
    ? Math.min(100, Math.round((readIds.length / todayConfessions.length) * 100))
    : 0;

  // Calendar helpers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Dates with confessions in October 2026
  const activeConfessionDates = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16'];

  const ARCHIVED_EDITIONS = [
    {
      key: '2026-10-16',
      dayLabel: 'Friday, 16 October 2026',
      badge: 'Today',
      count: 7,
      highlights: 'Crushes, Tisch library sketchbook, Organic Chem, Midnight study'
    },
    {
      key: '2026-10-15',
      dayLabel: 'Thursday, 15 October 2026',
      badge: 'Yesterday',
      count: 6,
      highlights: 'Midterm anxiety, Late night coffee runs, Dorm floor drama, Bio Lab'
    },
    {
      key: '2026-10-14',
      dayLabel: 'Wednesday, 14 October 2026',
      count: 6,
      highlights: 'Secret admirer notes, Dining hall encounters, Campus gossip'
    },
    {
      key: '2026-10-13',
      dayLabel: 'Tuesday, 13 October 2026',
      count: 6,
      highlights: 'Campus life, Missed connections, Gym crush, Chemistry finals'
    },
    {
      key: '2026-10-12',
      dayLabel: 'Monday, 12 October 2026',
      count: 6,
      highlights: 'Weekly kickoff, Commuter student life, Study cubicles, Roommates'
    }
  ];

  // Days in selected month
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  // First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  // Adjust so Monday is 0: (day + 6) % 7
  const startDayOffset = (firstDayIndex + 6) % 7;

  const handleDateSelect = (dayNum) => {
    const mm = String(calendarMonth + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    const dateKey = `${calendarYear}-${mm}-${dd}`;
    navigate(`/date/${dateKey}`);
  };

  return (
    <div 
      className="flex min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {/* 2px Thin Top Reading Progress Line: accent colored, transparent track, invisible at 0% */}
      {readProgress > 0 && (
        <div 
          className="fixed top-0 left-0 h-[2px] z-50 transition-all duration-300 pointer-events-none"
          style={{ width: `${readProgress}%`, backgroundColor: 'var(--accent)' }}
          title={`${readProgress}% of today's confessions read`}
        />
      )}

      {/* 240px Fixed Left Sidebar */}
      <Sidebar 
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      {/* Center Feed Column (560px Max Width Confessions) */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-16" ref={containerRef}>
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-[560px] flex flex-col">
            
            {/* Top Day Switcher Tabs: Sans 14px, weight 500, active underline 2px --text-primary */}
            <div 
              className="flex items-center pb-0 mb-6 border-b select-none"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-6 relative">
                {DAY_TABS.map((tab) => {
                  const isActive = selectedDayTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setSelectedDayTab(tab.id);
                        setSearchParams({ tab: tab.id });
                        if (tab.id === 'yesterday') setYesterdayExpanded(true);
                      }}
                      className="font-sans text-[14px] font-medium pb-2.5 relative transition-colors cursor-pointer"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <span 
                          className="absolute bottom-[-1px] left-0 right-0 h-[2px]" 
                          style={{ backgroundColor: 'var(--text-primary)' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: TODAY */}
            {selectedDayTab === 'today' && (
              <>
                {/* Header: Large display title, line under mono 12px in --text-tertiary */}
                <header className="mb-8 pt-2">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <h1 
                      className="text-[30px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-tight font-sans"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Friday, 16 October
                    </h1>
                  </div>

                  <div 
                    className="font-mono text-[12px] mt-1.5 flex items-center gap-2 flex-wrap"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <span>
                      {todayConfessions.length} confessions today
                    </span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span className="tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                      {readProgress}% read
                    </span>
                  </div>
                </header>

                {/* TODAY FEED */}
                {isLoading ? (
                  <div className="flex flex-col gap-[40px]">
                    {[1, 2, 3].map((n) => (
                      <div 
                        key={n} 
                        className="w-full rounded-[12px] p-8 animate-pulse border"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        <div className="w-32 h-3 rounded mb-4" style={{ backgroundColor: 'var(--surface-sunken)' }} />
                        <div className="w-full h-12 rounded" style={{ backgroundColor: 'var(--surface-sunken)' }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-[40px]">
                    {todayConfessions.map((confession, idx) => (
                      <ConfessionCard
                        key={confession.id}
                        confession={confession}
                        isActive={idx === selectedIndex}
                        onUpdate={(updated) => {
                          setTodayConfessions((prev) =>
                            prev.map((c) => (c.id === updated.id ? updated : c))
                          );
                        }}
                        onDelete={(deletedId) => {
                          setTodayConfessions((prev) => prev.filter((c) => c.id !== deletedId));
                        }}
                      />
                    ))}

                    {/* END OF DAY MARKER */}
                    <div 
                      className="mt-8 pt-10 pb-6 border-t text-center flex flex-col items-center justify-center gap-2 select-none"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <span className="font-confession text-[18px]" style={{ color: 'var(--text-primary)' }}>
                        That was everything from Friday.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDayTab('yesterday');
                          setYesterdayExpanded(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[12px] font-mono underline underline-offset-4 transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        View yesterday's confessions (3 confessions) →
                      </button>
                    </div>
                  </div>
                )}

              </>
            )}

            {/* TAB 2: YESTERDAY */}
            {selectedDayTab === 'yesterday' && (
              <>
                <header className="mb-8 pt-2">
                  <h1 className="text-[30px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-tight" style={{ color: 'var(--text-primary)' }}>
                    Thursday, 15 October
                  </h1>
                  <div className="font-mono text-[12px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    {yesterdayConfessions.length} confessions archived from Thursday
                  </div>
                </header>

                <div className="flex flex-col gap-[40px]">
                  {yesterdayConfessions.map((confession) => (
                    <ConfessionCard
                      key={confession.id}
                      confession={confession}
                      onUpdate={(updated) => {
                        setYesterdayConfessions((prev) =>
                          prev.map((c) => (c.id === updated.id ? updated : c))
                        );
                      }}
                      onDelete={(deletedId) => {
                        setYesterdayConfessions((prev) => prev.filter((c) => c.id !== deletedId));
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* TAB 3: THIS WEEK (Grouped by Friday, Thursday, Wednesday, Tuesday, Monday) */}
            {selectedDayTab === 'this_week' && (
              <>
                <header className="mb-8 pt-2">
                  <h1 className="text-[30px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-tight" style={{ color: 'var(--text-primary)' }}>
                    This Week's Confessions
                  </h1>
                  <div className="font-mono text-[12px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    All confessions posted Monday through Friday, organized day by day
                  </div>
                </header>

                {weekGroups.length === 0 ? (
                  <div className="py-12 text-center font-mono text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                    Loading this week's confessions...
                  </div>
                ) : (
                  <div className="flex flex-col gap-12">
                    {weekGroups.map((group) => (
                      <section key={group.date_key} className="flex flex-col">
                        {/* Day Section Header */}
                        <div 
                          className="flex items-baseline justify-between border-b pb-2.5 mb-6 sticky top-[52px] md:top-0 z-10 py-1"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                            <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                              {group.day_label}
                            </h2>
                          </div>
                          <span className="font-mono text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                            {group.confessions.length} confessions
                          </span>
                        </div>

                        {/* Confessions for this specific day */}
                        <div className="flex flex-col gap-[36px]">
                          {group.confessions.map((c) => (
                            <ConfessionCard 
                              key={c.id} 
                              confession={c} 
                              onDelete={(deletedId) => {
                                setWeekGroups((prev) =>
                                  prev.map((g) => ({
                                    ...g,
                                    confessions: g.confessions.filter((item) => item.id !== deletedId)
                                  }))
                                );
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* TAB 4: PICK A DATE (Interactive Calendar System) */}
            {selectedDayTab === 'pick_date' && (
              <>
                <header className="mb-6 pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span 
                      className="p-1 rounded-[4px] border"
                      style={{ 
                        backgroundColor: 'var(--surface-sunken)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)' 
                      }}
                    >
                      <IconCalendar size={18} />
                    </span>
                    <h1 className="text-[30px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-tight" style={{ color: 'var(--text-primary)' }}>
                      Pick a Date
                    </h1>
                  </div>
                  <div className="font-mono text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                    Select any calendar day to inspect that date's confessions
                  </div>
                </header>

                {/* Calendar Card Component */}
                <div 
                  className="rounded-[12px] p-5 sm:p-6 mb-8 select-none border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {monthNames[calendarMonth]} {calendarYear}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (calendarMonth === 0) {
                            setCalendarMonth(11);
                            setCalendarYear(y => y - 1);
                          } else {
                            setCalendarMonth(m => m - 1);
                          }
                        }}
                        className="px-2 py-1 rounded border transition-colors cursor-pointer"
                        style={{ 
                          backgroundColor: 'var(--surface-sunken)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--text-secondary)' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (calendarMonth === 11) {
                            setCalendarMonth(0);
                            setCalendarYear(y => y + 1);
                          } else {
                            setCalendarMonth(m => m + 1);
                          }
                        }}
                        className="px-2 py-1 rounded border transition-colors cursor-pointer"
                        style={{ 
                          backgroundColor: 'var(--surface-sunken)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--text-secondary)' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Labels (Mo, Tu, We, Th, Fr, Sa, Su) */}
                  <div 
                    className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] uppercase tracking-wider mb-2"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <div>Mo</div>
                    <div>Tu</div>
                    <div>We</div>
                    <div>Th</div>
                    <div>Fr</div>
                    <div>Sa</div>
                    <div>Su</div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[13px]">
                    {/* Empty cells before month start */}
                    {Array.from({ length: startDayOffset }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-9" />
                    ))}

                    {/* Month days */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const mm = String(calendarMonth + 1).padStart(2, '0');
                      const dd = String(dayNum).padStart(2, '0');
                      const dateKey = `${calendarYear}-${mm}-${dd}`;
                      const hasConfessions = activeConfessionDates.includes(dateKey);
                      const isToday = dateKey === '2026-10-16';

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => handleDateSelect(dayNum)}
                          className={`h-10 flex flex-col items-center justify-center rounded-[6px] transition-colors relative cursor-pointer group border ${
                            isToday ? 'ring-1' : ''
                          }`}
                          style={{
                            backgroundColor: hasConfessions ? 'var(--surface-sunken)' : 'transparent',
                            borderColor: hasConfessions ? 'var(--border)' : 'transparent',
                            color: hasConfessions ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            ...(isToday ? { ringColor: 'var(--accent)' } : {})
                          }}
                          onMouseEnter={(e) => {
                            if (hasConfessions) {
                              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                              e.currentTarget.style.borderColor = 'var(--border-strong)';
                            } else {
                              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (hasConfessions) {
                              e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
                              e.currentTarget.style.borderColor = 'var(--border)';
                            } else {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--text-tertiary)';
                            }
                          }}
                          title={hasConfessions ? `View confessions from ${dayNum} ${monthNames[calendarMonth]}` : `${dayNum} ${monthNames[calendarMonth]}`}
                        >
                          <span className={`text-[12.5px] ${hasConfessions ? 'font-medium' : ''}`}>{dayNum}</span>
                          {/* Dot indicator for dates with confessions */}
                          {hasConfessions && (
                            <span 
                              className="w-1.5 h-1.5 rounded-full absolute bottom-1" 
                              style={{ backgroundColor: 'var(--accent)' }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Campus Archives Directory */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Active Campus Editions
                      </span>
                    </div>
                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                      5 dates recorded
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {ARCHIVED_EDITIONS.map((item) => (
                      <Link
                        key={item.key}
                        to={`/date/${item.key}`}
                        className="group flex items-center justify-between p-3.5 rounded-[8px] border transition-all"
                        style={{ 
                          backgroundColor: 'var(--surface)', 
                          borderColor: 'var(--border)' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          e.currentTarget.style.borderColor = 'var(--border-strong)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span 
                                className="text-[14px] font-medium transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {item.dayLabel}
                              </span>
                              {item.badge && (
                                <span 
                                  className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                                  style={{ 
                                    backgroundColor: 'var(--surface-sunken)', 
                                    borderColor: 'var(--border)', 
                                    color: 'var(--text-secondary)' 
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[12px] truncate font-mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                              {item.highlights}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span 
                            className="font-mono text-[11px] tabular-nums px-2 py-1 rounded border"
                            style={{ 
                              backgroundColor: 'var(--surface-sunken)', 
                              borderColor: 'var(--border)', 
                              color: 'var(--text-secondary)' 
                            }}
                          >
                            {item.count} confessions
                          </span>
                          <span 
                            className="transition-all text-[14px]"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Archive Overview Stat Card */}
                  <div 
                    className="mt-2 p-3.5 rounded-[8px] border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] font-mono"
                    style={{ 
                      backgroundColor: 'var(--surface-sunken)', 
                      borderColor: 'var(--border)', 
                      color: 'var(--text-tertiary)' 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>31 confessions archived</span>
                      <span style={{ color: 'var(--border-strong)' }}>·</span>
                      <span>5 recorded days</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Clicking any date opens its full chronological feed
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>

      {/* 320px Right Panel */}
      <TrendingSidebar 
        onSelectConfession={(id) => {
          setSelectedDayTab('today');
          setSearchParams({ tab: 'today' });
          setTimeout(() => {
            const el = document.getElementById(`confession-${id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.style.borderColor = 'var(--text-primary)';
              setTimeout(() => {
                el.style.borderColor = 'var(--border)';
              }, 1200);
            }
          }, 80);
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      {/* Create Confession Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handleConfessionCreated}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
