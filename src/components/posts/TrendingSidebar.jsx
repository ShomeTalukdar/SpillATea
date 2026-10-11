import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../services/db';
import { IconAlert, IconLock } from '../icons/Icons';

export default function TrendingSidebar() {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    async function loadTrending() {
      try {
        const posts = await fetchPosts({ sort: 'trending_today' });
        setTrendingPosts(posts.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    }
    loadTrending();
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 p-4 border-l border-[#2A2A2F] bg-[#151518]/50 gap-5 shrink-0 overflow-y-auto text-left select-none">
      {/* Trending Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A8]">
            Trending on Campus
          </h3>
          <span className="text-[10px] text-[#777780]">Today</span>
        </div>

        <div className="flex flex-col gap-2">
          {trendingPosts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.post_number}`}
              className="p-2.5 rounded-lg bg-[#151518] border border-[#2A2A2F] hover:border-[#3A3A42] hover:bg-[#1C1C20] transition-smooth flex flex-col gap-1 text-left"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#F07845] font-mono font-medium">{post.post_number_formatted}</span>
                <span className="text-[#777780]">{post.category}</span>
              </div>
              <p className="text-xs font-medium text-[#F0F0F2] line-clamp-2 leading-snug">
                {post.title}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#777780] mt-1">
                <span>{post.likes} upvotes</span>
                <span>&bull;</span>
                <span>{post.comment_count} replies</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Safety Reminder */}
      <div className="p-3.5 rounded-xl bg-[#1C1C20] border border-[#2A2A2F] flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#F0F0F2]">
          <IconLock size={15} className="text-[#F07845]" />
          <span>Anonymous by Design</span>
        </div>
        <p className="text-[11px] text-[#A0A0A8] leading-relaxed">
          Your student identity is kept private from peers on anonymous posts. Content is moderated to keep our campus community safe and civil.
        </p>
        <Link
          to="/terms"
          className="text-[11px] font-medium text-[#F07845] hover:underline mt-1"
        >
          Community Guidelines &rarr;
        </Link>
      </div>

      {/* Footer info */}
      <div className="text-[11px] text-[#777780] flex flex-col gap-1 mt-auto pt-4 border-t border-[#2A2A2F]">
        <p>CampusEcho Platform</p>
        <div className="flex items-center gap-2">
          <Link to="/terms" className="hover:text-[#A0A0A8]">Terms</Link>
          <span>&bull;</span>
          <Link to="/privacy" className="hover:text-[#A0A0A8]">Privacy Policy</Link>
        </div>
      </div>
    </aside>
  );
}
