import React, { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import PostRow from '../components/posts/PostRow';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { IconSearch, IconClose } from '../components/icons/Icons';
import { fetchPosts } from '../services/db';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'Confessions',
  'College Life',
  'Academics',
  'Relationships',
  'Rants',
  'Memes & Fun',
  'Advice'
];

const DISCOVERY_TAGS = [
  'midterms',
  'professors',
  'library',
  'dininghall',
  'roommates',
  'finals'
];

export default function SearchPage() {
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('for_you');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Debounce search input by 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute search
  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      try {
        const posts = await fetchPosts({
          category: selectedCategory,
          sort: sortBy,
          searchQuery: debouncedQuery
        });
        setResults(posts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery, selectedCategory, sortBy, isAdmin]);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <Sidebar 
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-0 sm:px-6 py-0 sm:py-6">
          <div className="w-full max-w-[640px] flex flex-col border-x border-[#232323] min-h-screen">
            {/* Header */}
            <div className="p-4 border-b border-[#232323] flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B6B]">
                02 / Search
              </span>
              <h1 className="text-[28px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                Search
              </h1>
              <p className="text-[13px] text-[#A1A1A1]">
                find campus discussions, opinions, and study notes.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#232323] flex flex-col gap-3">
              <div className="relative flex items-center">
                <IconSearch size={15} className="absolute left-3 text-[#6B6B6B] pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search campus discussions..."
                  className="w-full bg-[#111111] border border-[#232323] focus:border-[#333333] rounded-[6px] pl-9 pr-9 py-2 text-[14px] text-[#EDEDED] placeholder-[#6B6B6B] outline-none transition-fast font-normal"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 text-[#6B6B6B] hover:text-[#EDEDED] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <IconClose size={14} />
                  </button>
                )}
              </div>

              {/* Quick Discovery Tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="font-mono text-[11px] text-[#6B6B6B] shrink-0">Tags:</span>
                {DISCOVERY_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2 py-0.5 rounded-[4px] bg-[#111111] hover:bg-[#161616] text-[11.5px] font-mono text-[#A1A1A1] hover:text-[#EDEDED] transition-fast shrink-0 cursor-pointer border border-[#232323]"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Filter and Sorting Options */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#6B6B6B]">category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#161616] border border-[#232323] text-[12px] font-mono text-[#EDEDED] rounded-[4px] px-2 py-1 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c === 'All' ? 'all' : c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#6B6B6B]">sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#161616] border border-[#232323] text-[12px] font-mono text-[#EDEDED] rounded-[4px] px-2 py-1 outline-none cursor-pointer"
                  >
                    <option value="for_you">Recommended</option>
                    <option value="most_recent">Most Recent</option>
                    <option value="trending_today">Trending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Metadata */}
            <div className="px-4 py-2 border-b border-[#232323] flex items-center justify-between font-mono text-[11px] text-[#6B6B6B]">
              <span>{debouncedQuery ? `filter: "${debouncedQuery}"` : 'all campus discussions'}</span>
              <span className="tabular-nums">{results.length} found</span>
            </div>

            {/* Results Rows */}
            {isLoading ? (
              <div className="flex flex-col divide-y divide-[#232323]">
                {[1, 2].map((n) => (
                  <div key={n} className="p-4 flex gap-3 animate-pulse">
                    <div className="w-[40px] h-14 bg-[#161616] rounded-[4px]" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="w-40 h-3 bg-[#161616] rounded" />
                      <div className="w-full h-4 bg-[#161616] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-1 text-[13px] text-[#6B6B6B]">
                <span>no discussions matching your search.</span>
                <span className="text-[12px]">try searching for different keywords or select a category.</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {results.map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    onUpdate={(updated) => {
                      setResults(prev => prev.map(p => p.id === updated.id ? updated : p));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={(newPost) => setResults(prev => [newPost, ...prev])}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
