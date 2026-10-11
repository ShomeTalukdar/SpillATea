import React, { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import CategoryBar from '../components/posts/CategoryBar';
import PostCard from '../components/posts/PostCard';
import { EmptyStateIllustration } from '../components/icons/Icons';
import { fetchPosts } from '../services/db';

const FEED_FILTERS = [
  { id: 'for_you', label: 'For You' },
  { id: 'most_recent', label: 'Most Recent' },
  { id: 'trending_today', label: 'Trending Today' },
  { id: 'trending_week', label: 'Trending This Week' },
  { id: 'trending_month', label: 'Trending This Month' },
];

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState('for_you');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      setIsLoading(true);
      try {
        const data = await fetchPosts({
          category: selectedCategory,
          sort: selectedFilter
        });
        setPosts(data);
      } catch (err) {
        console.error('Failed to load feed', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeed();
  }, [selectedFilter, selectedCategory]);

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Mobile Header */}
        <MobileHeader />

        <main className="flex-1 flex justify-center px-3 sm:px-6 py-4 sm:py-6">
          <div className="w-full max-w-2xl flex flex-col">
            {/* Filter Tabs Header */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2F]">
                <h1 className="text-base sm:text-lg font-semibold text-[#F0F0F2] tracking-tight">
                  Campus Feed
                </h1>
                <span className="text-xs text-[#777780]">
                  {posts.length} {posts.length === 1 ? 'discussion' : 'discussions'}
                </span>
              </div>

              {/* Segmented Filter Controls */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 select-none">
                {FEED_FILTERS.map((f) => {
                  const isActive = selectedFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-smooth cursor-pointer ${
                        isActive
                          ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#2A2A2F]'
                          : 'text-[#777780] hover:text-[#A0A0A8] hover:bg-[#151518]'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Category Filter Pills */}
              <CategoryBar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="flex flex-col gap-3 py-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-full h-44 bg-[#151518] border border-[#2A2A2F] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-[#151518] border border-[#2A2A2F] rounded-xl my-4">
                <EmptyStateIllustration size={72} className="mb-4 text-[#777780]" />
                <h3 className="text-sm font-semibold text-[#F0F0F2] mb-1">
                  No discussions found
                </h3>
                <p className="text-xs text-[#777780] max-w-xs leading-relaxed">
                  There are no posts in this category yet. Be the first to start a conversation.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpdate={(updated) => {
                      setPosts((prev) =>
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

      {/* Desktop Right Sidebar */}
      <TrendingSidebar />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
