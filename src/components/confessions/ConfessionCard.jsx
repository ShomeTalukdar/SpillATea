import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconHeart, 
  IconComment, 
  IconShare, 
  IconBookmark,
  IconReport, 
  IconCheck, 
  IconLock,
  IconClose,
  IconTrash
} from '../icons/Icons';
import { toggleLikeConfession, toggleSaveConfession, addComment, fetchComments, deleteConfession } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

/**
 * ConfessionCard — Single Spacious Daily Notebook Unit
 * 
 * - 560px max width, 32px padding, 12px radius, 1px #262626 border
 * - Clicking the card navigates to its separate, sharable page (/post/:id)
 * - Automatic, prominent real author reveal for moderators (no verify modal required)
 * - Newsreader editorial serif 20px body
 * - Like with 160ms scale + double-click
 * - Instagram-style Bookmark/Save to private collection
 * - Previews first comments with slide-over drawer / direct page link
 */
export default function ConfessionCard({ 
  confession, 
  isActive = false, 
  onOpenComments = null,
  onUpdate = null,
  onDelete = null
}) {
  const navigate = useNavigate();
  const { user, isAdmin, openAuthModal } = useAuth();

  const [isLiked, setIsLiked] = useState(Boolean(confession.is_liked));
  const [isSaved, setIsSaved] = useState(Boolean(confession.is_saved));
  const [savedFeedback, setSavedFeedback] = useState(false);

  const [likesCount, setLikesCount] = useState(confession.likes || 0);
  const [commentCount, setCommentCount] = useState(confession.comment_count || 0);
  const [likeScale, setLikeScale] = useState(false);

  useEffect(() => {
    setCommentCount(confession.comment_count || 0);
  }, [confession.comment_count]);

  const [expanded, setExpanded] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(Boolean(confession.is_deleted));

  const canDelete = Boolean(confession.can_delete || isAdmin || confession.is_own);

  const handleDeleteClick = (e) => {
    if (e) e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async (e) => {
    if (e) e.stopPropagation();
    setIsDeleting(true);
    const res = await deleteConfession(confession.id);
    setIsDeleting(false);
    setShowConfirmDelete(false);
    if (res && res.success) {
      setIsDeleted(true);
      if (onDelete) {
        onDelete(confession.id);
      } else if (onUpdate) {
        onUpdate({ ...confession, is_deleted: true });
      }
    } else {
      alert(res?.error || 'Failed to delete confession.');
    }
  };

  // Handle Save (Instagram style bookmark)
  const handleSave = async (e) => {
    if (e) e.stopPropagation();
    if (!user) {
      openAuthModal('Please sign in with your college email to bookmark confessions.');
      return;
    }
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);

    const res = await toggleSaveConfession(confession.id);
    if (!res.success) {
      setIsSaved(!nextSaved);
    } else if (onUpdate) {
      onUpdate({ ...confession, is_saved: res.is_saved });
    }
  };

  // Handle Like
  const handleLike = async (e) => {
    if (e) e.stopPropagation();
    if (!user) {
      openAuthModal('Please sign in with your college email to like confessions.');
      return;
    }
    setLikeScale(true);
    setTimeout(() => setLikeScale(false), 200);

    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    const res = await toggleLikeConfession(confession.id);
    if (!res.success) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } else if (onUpdate) {
      onUpdate({ ...confession, is_liked: res.is_liked, likes: res.likes });
    }
  };

  // Clicking on card navigates to separate sharable page
  const handleCardClick = (e) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      openAuthModal('Sign in with your student email to read full confessions and join discussions.');
      return;
    }
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;

    if (e.detail === 2) {
      handleLike(e);
      return;
    }

    navigate(`/post/${confession.id}`);
  };

  // Share link
  const handleShare = (e) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/post/${confession.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Open post full page directly with comment autofocus
  const openComments = (e) => {
    if (e) e.stopPropagation();
    if (!user) {
      openAuthModal('Please sign in with your college email to read and post comments.');
      return;
    }
    navigate(`/post/${confession.id}?comment=true`);
  };

  // Submit comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || submittingComment) return;
    setSubmittingComment(true);
    const res = await addComment({
      postId: confession.id,
      content: commentInput,
      is_anonymous: true
    });
    setSubmittingComment(false);
    if (res.success) {
      setCommentsList(prev => [...prev, res.comment]);
      setCommentInput('');
      setCommentCount(prev => prev + 1);
      if (onUpdate) {
        onUpdate({ ...confession, comment_count: (commentCount + 1) });
      }
    }
  };

  // Derive title for preview
  const postTitle = confession.title || confession.to_target || (
    confession.body ? confession.body.split('\n')[0].slice(0, 80) + (confession.body.length > 80 ? '...' : '') : 'Campus Confession'
  );

  // Clamp check for long confessions
  const isLong = confession.body.length > 280 || (confession.body.match(/\n/g) || []).length > 2;

  if (isDeleted) return null;

  return (
    <>
      <article 
        id={`confession-${confession.id}`}
        onClick={handleCardClick}
        className="w-full max-w-[560px] mx-auto rounded-[12px] p-8 transition-colors duration-150 cursor-pointer select-text group shadow-none"
        style={{
          backgroundColor: 'var(--surface)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isActive ? 'var(--text-primary)' : 'var(--border)',
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.borderColor = 'var(--border-strong)';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Header row: "No. 001" mono 12px --text-primary, category mono 11px uppercase --text-tertiary, time mono 12px --text-tertiary */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span 
              className="font-mono text-[12px] tracking-wide"
              style={{ color: 'var(--text-primary)' }}
            >
              {confession.confession_number}
            </span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span 
              className="font-mono text-[11px] uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {confession.category}
            </span>
          </div>

          <span 
            className="font-mono text-[12px] cursor-help"
            style={{ color: 'var(--text-tertiary)' }}
            title={confession.exact_time}
          >
            {confession.time_formatted}
          </span>
        </div>

        {/* Automatic Moderator Identity Visibility */}
        {isAdmin && (confession.real_author_name || confession.real_author_email) && (
          <div 
            className="mb-5 px-3.5 py-2 rounded-[6px] border flex items-center justify-between text-[11.5px] font-mono"
            style={{ 
              backgroundColor: 'var(--surface-sunken)', 
              borderColor: 'var(--border-strong)' 
            }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>Poster:</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{confession.real_author_name}</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span style={{ color: 'var(--text-secondary)' }}>{confession.real_author_email}</span>
            </div>
            <span 
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: 'var(--accent-text)' }}
            >
              MOD VIEW
            </span>
          </div>
        )}

        {/* GUEST / NOT LOGGED IN: Show title and locked teaser box only */}
        {!user ? (
          <div>
            <div className="mb-4">
              <h3 className="text-[17px] sm:text-[18px] font-semibold text-[var(--text-primary)] font-sans leading-snug">
                {postTitle}
              </h3>
            </div>

            {/* Locked Content Teaser */}
            <div className="relative overflow-hidden rounded-[10px] p-5 text-center border border-white/[0.06] bg-[#0E0E12] group-hover:border-[#F06A3A]/40 transition-colors mb-4">
              <div className="select-none pointer-events-none filter blur-[5px] opacity-15 text-left font-confession text-[16px] leading-[1.6]">
                {confession.body ? confession.body.slice(0, 160) : 'Full confession text locked for verified university students.'}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-gradient-to-t from-[#0D0D10]/95 via-[#0D0D10]/80 to-transparent">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F06A3A]/15 border border-[#F06A3A]/30 text-[#F06A3A] font-mono text-[11px] font-medium mb-1.5">
                  <span>🔒</span>
                  <span>STUDENT LOGIN REQUIRED</span>
                </div>
                <p className="text-[13px] text-white font-medium mb-0.5">
                  Sign in to read this full confession
                </p>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Click post to sign in with your college email
                </span>
              </div>
            </div>

            {/* Single Hairline Divider */}
            <div className="h-[1px] w-full mb-3" style={{ backgroundColor: 'var(--border)' }} />

            {/* Unauthenticated Quick Stats Footer */}
            <div className="flex items-center justify-between text-[12px] font-mono text-[var(--text-tertiary)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">🔒 {likesCount} likes</span>
                <span>·</span>
                <span>{commentCount} responses</span>
              </div>
              <span className="text-[#F06A3A] group-hover:underline flex items-center gap-1 font-sans text-[12px] font-medium">
                <span>Unlock Spill</span>
                <span>→</span>
              </span>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED: Full Confession Content */
          <>
            {/* Optional Target Line ("To: the guy in the blue hoodie..."): 2px --accent left bar, mono 13px, --text-secondary, 12px left padding */}
            {confession.to_target && (
              <div className="mb-5">
                <span 
                  className="font-mono text-[13px] inline-block border-l-2 pl-3"
                  style={{ 
                    borderColor: 'var(--accent)', 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  {confession.to_target}
                </span>
              </div>
            )}

            {/* Confession Body: Serif, 20px, line-height 1.6, --text-primary */}
            <div className="mb-6">
              <p 
                className={`font-confession text-[20px] leading-[1.6] font-normal whitespace-pre-line tracking-[-0.01em] ${
                  !expanded && isLong ? 'line-clamp-8' : ''
                }`}
                style={{ color: 'var(--text-primary)' }}
              >
                {confession.body}
              </p>

              {isLong && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="mt-2.5 text-[13px] font-sans underline underline-offset-4 transition-colors cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {expanded ? 'Show less' : 'Continue reading'}
                </button>
              )}
            </div>

            {/* EXACTLY ONE DIVIDER: 1px --border above action row */}
            <div 
              className="h-[1px] w-full mb-4" 
              style={{ backgroundColor: 'var(--border)' }} 
            />

        {/* Footer Action Row: like/comment left (mono 13px count), save/share/report right (18px icons, 36px hit area) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* 1. Like Action */}
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-2 py-1 px-1.5 -ml-1.5 rounded-[6px] transition-colors cursor-pointer"
              style={{ color: isLiked ? 'var(--accent)' : 'var(--text-secondary)' }}
              title="Like confession (Double click on card also likes)"
            >
              <span className={`inline-block transition-transform duration-160 ${likeScale ? 'scale-125' : 'scale-100'}`}>
                <IconHeart size={18} filled={isLiked} />
              </span>
              <span 
                className="font-mono tabular-nums text-[13px]"
                style={{ color: isLiked ? 'var(--accent-text)' : 'var(--text-secondary)' }}
              >
                {likesCount}
              </span>
            </button>

            {/* 2. Comment Trigger */}
            <button
              type="button"
              onClick={openComments}
              className="flex items-center gap-2 py-1 px-1.5 rounded-[6px] transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <IconComment size={18} />
              <span className="font-mono tabular-nums text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {commentCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark / Save (18px icon, 36px hit area) */}
            <button
              type="button"
              onClick={handleSave}
              className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors relative cursor-pointer"
              style={{ color: isSaved ? 'var(--accent)' : 'var(--text-tertiary)' }}
              onMouseEnter={(e) => {
                if (!isSaved) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                if (!isSaved) e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
              title={isSaved ? "Saved to your collection" : "Save confession"}
            >
              <IconBookmark size={18} filled={isSaved} />
              {savedFeedback && (
                <span 
                  className="absolute -top-7 right-0 text-[10px] font-mono px-2 py-0.5 rounded border shadow-sm whitespace-nowrap z-10"
                  style={{ 
                    backgroundColor: 'var(--surface-sunken)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                >
                  {isSaved ? 'Saved' : 'Removed'}
                </span>
              )}
            </button>

            {/* Sharable Link (18px icon, 36px hit area) */}
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors relative cursor-pointer"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              title="Copy sharable confession link"
            >
              {copiedShare ? <IconCheck size={18} className="text-[#10B981]" /> : <IconShare size={18} />}
              {copiedShare && (
                <span 
                  className="absolute -top-7 right-0 text-[10px] font-mono px-2 py-0.5 rounded border shadow-sm whitespace-nowrap z-10"
                  style={{ 
                    backgroundColor: 'var(--surface-sunken)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                >
                  Link copied
                </span>
              )}
            </button>

            {/* Report (18px icon, 36px hit area) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                alert('Confession reported for campus moderator review.');
              }}
              className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              title="Report confession"
            >
              <IconReport size={18} />
            </button>

            {/* Delete button (Author or Moderator) (18px icon, 36px hit area) */}
            {canDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                title={isAdmin && !confession.is_own ? "Delete confession (Campus Moderator action)" : "Delete your confession"}
              >
                <IconTrash size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Inline Delete Confirmation */}
        {showConfirmDelete && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="mt-4 p-3.5 rounded-[8px] border flex items-center justify-between text-[12px] font-mono animate-fadeIn"
            style={{ 
              backgroundColor: 'var(--surface-sunken)', 
              borderColor: 'var(--border-strong)' 
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>
              {isAdmin && !confession.is_own ? 'Moderator action: Delete this confession?' : 'Delete your confession permanently?'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                }}
                className="px-2.5 py-1 rounded border text-[11px] cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-secondary)' 
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-2.5 py-1 rounded bg-[#EF4444] hover:bg-[#dc2626] text-white font-medium text-[11px] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}

        {/* View discussion: sans 14px weight 500, --text-secondary, small arrow, 12px below action row, NO rule, hover to --text-primary */}
        {commentCount > 0 && (
          <div className="mt-3">
            <button
              type="button"
              onClick={openComments}
              className="text-[14px] font-sans font-medium text-left w-full flex items-center justify-between transition-colors cursor-pointer group"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <span>View discussion ({commentCount} {commentCount === 1 ? 'comment' : 'comments'})</span>
              <span className="text-[14px] group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--text-tertiary)' }}>→</span>
            </button>
          </div>
        )}
          </>
        )}
      </article>
    </>
  );
}
