import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AnonymousAvatar, 
  PublicAvatar, 
  IconLike, 
  IconDislike, 
  IconComment, 
  IconShare, 
  IconReport 
} from '../icons/Icons';
import { reactToPost, recordPostShare } from '../../services/db';
import { formatRelativeTime } from '../../utils/time';
import { useToast } from '../../context/ToastContext';
import ReportModal from '../modals/ReportModal';

export default function PostCard({ post, onUpdate }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [userReaction, setUserReaction] = useState(post.user_reaction || null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const isLongContent = post.content && post.content.length > 280;
  const displayContent = isLongContent && !isExpanded 
    ? post.content.substring(0, 280) + '...' 
    : post.content;

  const handleCardClick = () => {
    navigate(`/post/${post.post_number}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isReacting) return;
    setIsReacting(true);

    try {
      const res = await reactToPost(post.id, 'like');
      if (res.success) {
        setLikes(res.likes);
        setDislikes(res.dislikes);
        setUserReaction(res.user_reaction);
        if (onUpdate) onUpdate({ ...post, likes: res.likes, dislikes: res.dislikes, user_reaction: res.user_reaction });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReacting(false);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (isReacting) return;
    setIsReacting(true);

    try {
      const res = await reactToPost(post.id, 'dislike');
      if (res.success) {
        setLikes(res.likes);
        setDislikes(res.dislikes);
        setUserReaction(res.user_reaction);
        if (onUpdate) onUpdate({ ...post, likes: res.likes, dislikes: res.dislikes, user_reaction: res.user_reaction });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReacting(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/post/${post.post_number}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        addToast(`Post link copied: /post/${post.post_number}`, 'success');
      } else {
        addToast(`Post link: ${shareUrl}`, 'info');
      }
      recordPostShare(post.id);
    } catch (err) {
      addToast('Could not copy link to clipboard.', 'error');
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setIsReportOpen(true);
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        className="w-full bg-[#151518] hover:bg-[#18181C] border border-[#2A2A2F] rounded-xl p-4 sm:p-5 transition-smooth cursor-pointer text-left select-none group"
      >
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {post.is_anonymous ? (
              <AnonymousAvatar size={34} />
            ) : (
              <PublicAvatar name={post.author_name} size={34} />
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#F0F0F2]">
                  {post.is_anonymous ? 'Anonymous Student' : post.author_name}
                </span>
                <span className="text-[11px] font-mono font-medium text-[#F07845] bg-[#1C1C20] px-1.5 py-0.5 rounded border border-[#2A2A2F]">
                  {post.post_number_formatted}
                </span>
              </div>
              <span className="text-[11px] text-[#777780]">
                {formatRelativeTime(post.created_at)}
              </span>
            </div>
          </div>

          {/* Category badge */}
          <span className="text-xs font-medium text-[#A0A0A8] bg-[#1C1C20] border border-[#2A2A2F] px-2.5 py-1 rounded-full shrink-0">
            {post.category}
          </span>
        </div>

        {/* Post title */}
        <h2 className="text-[15px] sm:text-base font-semibold text-[#F0F0F2] mb-2 leading-snug group-hover:text-white transition-smooth">
          {post.title}
        </h2>

        {/* Post content */}
        <div className="text-[13px] sm:text-sm text-[#A0A0A8] leading-relaxed mb-4 whitespace-pre-line font-normal">
          {displayContent}
          {isLongContent && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="ml-1 text-xs font-medium text-[#F07845] hover:underline cursor-pointer inline-block"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2F] text-xs text-[#777780]">
          {/* Reaction controls */}
          <div className="flex items-center gap-1 bg-[#1C1C20] border border-[#2A2A2F] rounded-lg p-1">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-smooth cursor-pointer ${
                userReaction === 'like' 
                  ? 'text-[#F07845] bg-[#2A2A2F]/60' 
                  : 'hover:text-[#F0F0F2] hover:bg-[#2A2A2F]/30'
              }`}
              aria-label="Upvote post"
            >
              <IconLike size={16} active={userReaction === 'like'} />
              <span className="font-medium text-xs text-[#F0F0F2]">{likes}</span>
            </button>
            <div className="w-[1px] h-3.5 bg-[#2A2A2F]" />
            <button
              type="button"
              onClick={handleDislike}
              className={`flex items-center gap-1 px-1.5 py-1 rounded transition-smooth cursor-pointer ${
                userReaction === 'dislike' 
                  ? 'text-[#A0A0A8] bg-[#2A2A2F]/60' 
                  : 'hover:text-[#F0F0F2] hover:bg-[#2A2A2F]/30'
              }`}
              aria-label="Downvote post"
            >
              <IconDislike size={16} active={userReaction === 'dislike'} />
            </button>
          </div>

          {/* Right actions: comments, share, report */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${post.post_number}`);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#1C1C20] hover:text-[#F0F0F2] transition-smooth cursor-pointer"
            >
              <IconComment size={16} />
              <span className="text-xs font-medium text-[#A0A0A8]">{post.comment_count || 0}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-[#1C1C20] hover:text-[#F0F0F2] transition-smooth cursor-pointer"
              title="Copy share link"
              aria-label="Share post"
            >
              <IconShare size={16} />
            </button>

            <button
              type="button"
              onClick={handleReport}
              className="p-1.5 rounded-lg hover:bg-[#1C1C20] hover:text-[#E36B73] transition-smooth cursor-pointer"
              title="Report post"
              aria-label="Report post"
            >
              <IconReport size={16} />
            </button>
          </div>
        </div>
      </article>

      {/* Report Modal */}
      <ReportModal
        post={post}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
}
