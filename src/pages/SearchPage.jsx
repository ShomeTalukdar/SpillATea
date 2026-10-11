import React, { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import PostCard from '../components/posts/PostCard';
import { IconSearch, IconClose, EmptyStateIllustration, IconFilter } from '../components/icons/Icons';
import { fetchPosts } from '../services/db';

const CATEGORIES = [
  'All',
  'Confessions',
  'College Life',
  'Academics',
  'Relationships',
  'Rants',
  'Memes and Fun',
  'Advice'
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('for_you');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search input by 220ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 220);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute real search
  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      try {
        const posts = await fetchPosts({
          category: selectedCategory,
          sort: sortBy,
          searchQuery: debouncedQuery
        });
        setResults(posts);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery, selectedCategory, sortBy]);

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-3 sm:px-6 py-6">
          <div className="w-full max-w-2xl flex flex-col gap-5 text-left">
            {/* Header */}
            <div className="flex flex-col gap-1 pb-2 border-b border-[#2A2A2F]">
              <h1 className="text-lg font-semibold text-[#F0F0F2]">
                Explore & Search
              </h1>
              <p className="text-xs text-[#777780]">
                Search confessions, course feedback, housing questions, and campus discussions.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative flex items-center">
              <IconSearch size={18} className="absolute left-3.5 text-[#777780] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, courses, keywords, or confessions..."
                className="w-full bg-[#151518] border border-[#2A2A2F] rounded-xl pl-10 pr-10 py-3 text-sm text-[#F0F0F2] placeholder-[#777780] focus:border-[#F07845] outline-none transition-smooth"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 text-[#777780] hover:text-[#F0F0F2] p-1 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <IconClose size={16} />
                </button>
              )}
            </div>

            {/* Filter and Sorting Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151518] border border-[#2A2A2F] p-3 rounded-xl">
              {/* Category selector */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
                <span className="text-xs text-[#777780] shrink-0 font-medium">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#1C1C20] border border-[#2A2A2F] text-xs text-[#F0F0F2] rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c === 'All' ? 'all' : c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#777780] font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#1C1C20] border border-[#2A2A2F] text-xs text-[#F0F0F2] rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="for_you">Recommended</option>
                  <option value="most_recent">Most Recent</option>
                  <option value="trending_today">Trending Today</option>
                </select>
              </div>
            </div>

            {/* Results Metadata */}
            <div className="flex items-center justify-between text-xs text-[#777780] px-1">
              <span>
                {debouncedQuery ? `Results for "${debouncedQuery}"` : 'All discussions'}
              </span>
              <span>{results.length} found</span>
            </div>

            {/* Results List */}
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((n) => (
                  <div key={n} className="w-full h-36 bg-[#151518] border border-[#2A2A2F] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-[#151518] border border-[#2A2A2F] rounded-xl">
                <EmptyStateIllustration size={72} className="mb-4 text-[#777780]" />
                <h3 className="text-sm font-semibold text-[#F0F0F2] mb-1">
                  No matching posts found
                </h3>
                <p className="text-xs text-[#777780] max-w-xs leading-relaxed">
                  Try searching for different keywords, phrases, or change your selected category filter.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {results.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpdate={(updated) => {
                      setResults((prev) =>
                        prev.map((p) => (p.id === updated.id ? updated : p))
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
