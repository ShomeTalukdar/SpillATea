import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { 
  IconHeart, 
  IconShare, 
  IconBookmark, 
  IconCheck, 
  IconLock, 
  IconReport, 
  IconClose,
  IconTrash
} from '../components/icons/Icons';

import { fetchPostById, fetchComments, addComment, toggleLikeConfession, toggleSaveConfession, deleteConfession } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function PostPage() {
  const { postNumber } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const commentInputRef = useRef(null);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeScale, setLikeScale] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals & palette
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // New comment
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPostAndComments() {
      setIsLoading(true);
      try {
        const found = await fetchPostById(postNumber);
        if (found) {
          setPost(found);
          setLikesCount(found.likes || 0);
          setIsLiked(Boolean(found.is_liked));
          setIsSaved(Boolean(found.is_saved));
          const comms = await fetchComments(found.id);
          setComments(comms || []);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Failed to load confession', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPostAndComments();
  }, [postNumber, isAdmin]);

  // Automatically scroll and focus the comment input when opened from comment button
  useEffect(() => {
    if (!isLoading && post) {
      const shouldComment = searchParams.get('comment') === 'true' || location.state?.focusComment;
      if (shouldComment && commentInputRef.current) {
        setTimeout(() => {
          commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          commentInputRef.current?.focus();
        }, 120);
      }
    }
  }, [isLoading, post, searchParams, location]);

  const handleSave = async () => {
    if (!post) return;
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    const res = await toggleSaveConfession(post.id);
    if (!res.success) {
      setIsSaved(!nextSaved);
    } else {
      addToast(nextSaved ? 'Saved to your collection' : 'Removed from collection', 'success');
    }
  };

  const handleLike = async () => {
    if (!post) return;
    setLikeScale(true);
    setTimeout(() => setLikeScale(false), 200);

    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    const res = await toggleLikeConfession(post.id);
    if (!res.success) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      addToast('sharable link copied to clipboard', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await addComment({
        postId: post.id,
        content: replyText.trim(),
        is_anonymous: true
      });

      if (res.success) {
        setComments(prev => [...prev, res.comment]);
        setReplyText('');
        addToast('anonymous reply posted', 'success');
      } else {
        addToast(res.error || 'failed to post reply', 'error');
      }
    } catch (err) {
      addToast('error posting reply', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canDelete = Boolean(post?.can_delete || isAdmin || post?.is_own);

  const handleDeletePost = async () => {
    setIsDeleting(true);
    const res = await deleteConfession(post.id);
    setIsDeleting(false);
    if (res && res.success) {
      addToast('Confession deleted', 'success');
      navigate('/');
    } else {
      addToast(res?.error || 'Failed to delete confession', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
        <Sidebar onOpenCreateModal={() => setIsCreateOpen(true)} onOpenCommandPalette={() => setIsCommandOpen(true)} />
        <div className="flex-1 flex justify-center items-center font-mono text-[13px] text-[#6B6B6B]">
          loading confession...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
        <Sidebar onOpenCreateModal={() => setIsCreateOpen(true)} onOpenCommandPalette={() => setIsCommandOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-[16px] text-[#EDEDED] font-medium mb-1">Confession not found</span>
          <span className="text-[13px] text-[#6B6B6B] mb-5 font-mono">
            Confession #{postNumber} does not exist or was deleted.
          </span>
          <Link to="/" className="text-[13px] text-[#FF5A1F] hover:underline font-mono">
            ← Return to Today's confessions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <Sidebar 
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-[560px] flex flex-col gap-6 text-left">
            
            {/* Top Navigation & Share Link Row */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-[12px] font-mono transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <span>←</span>
                <span>Today's confessions</span>
              </Link>

              {/* Sharable link button */}
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] border text-[11px] font-mono transition-colors cursor-pointer"
                style={{ 
                  backgroundColor: copiedLink ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                  borderColor: copiedLink ? '#10B981' : 'var(--border)',
                  color: copiedLink ? '#10B981' : 'var(--text-secondary)'
                }}
                title="Copy sharable page URL"
              >
                {copiedLink ? <IconCheck size={12} /> : <IconShare size={12} />}
                <span>{copiedLink ? 'Link copied' : 'Share link'}</span>
              </button>
            </div>

            {/* Confession Hero Card */}
            <article 
              className="w-full rounded-[12px] p-6 sm:p-8 border shadow-none"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {/* Meta row */}
              <div 
                className="flex items-center justify-between text-[12px] font-mono mb-5 pb-1 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-medium tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    {post.confession_number}
                  </span>
                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                  <span className="uppercase tracking-wider text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    {post.category}
                  </span>
                </div>

                <span style={{ color: 'var(--text-tertiary)' }}>
                  {post.time_formatted || post.exact_time}
                </span>
              </div>

              {/* Automatic Moderator Identity Visibility */}
              {isAdmin && (post.real_author_name || post.real_author_email) && (
                <div 
                  className="mb-4 px-3.5 py-2.5 rounded-[6px] border flex items-center justify-between text-[11.5px] font-mono"
                  style={{ 
                    backgroundColor: 'var(--surface-sunken)', 
                    borderColor: 'var(--border-strong)' 
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    <span style={{ color: 'var(--text-tertiary)' }}>Poster:</span>
                    <span className="font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{post.real_author_name}</span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{post.real_author_email}</span>
                  </div>
                  <span 
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: 'var(--accent-text)' }}
                  >
                    MOD VIEW
                  </span>
                </div>
              )}

              {/* Target Line */}
              {post.to_target && (
                <div className="mb-4">
                  <span 
                    className="font-mono text-[13px] tracking-wide inline-block border-l-2 pl-2.5"
                    style={{ borderColor: 'var(--accent)', color: 'var(--text-secondary)' }}
                  >
                    {post.to_target}
                  </span>
                </div>
              )}

              {/* Confession Body */}
              <div className="mb-6">
                <p 
                  className="font-confession text-[20px] sm:text-[21px] leading-[1.6] font-normal whitespace-pre-line tracking-[-0.01em]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {post.body || post.content}
                </p>
              </div>

              {/* Hairline Separator */}
              <div className="h-[1px] w-full mb-4" style={{ backgroundColor: 'var(--border)' }} />

              {/* Action row */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={handleLike}
                    className="flex items-center gap-2 py-1 px-2 -ml-2 rounded-[6px] transition-colors cursor-pointer"
                    style={{ color: isLiked ? 'var(--accent)' : 'var(--text-secondary)' }}
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

                  <div className="text-[12px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    {comments.length} responses
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
                    style={{ color: isSaved ? 'var(--accent)' : 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => { if (!isSaved) e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { if (!isSaved) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                    title={isSaved ? "Saved to your collection" : "Save confession"}
                  >
                    <IconBookmark size={18} filled={isSaved} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    title="Copy link"
                  >
                    <IconShare size={18} />
                  </button>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(true)}
                      className="w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      title={isAdmin && !post.is_own ? "Delete confession (Campus Moderator action)" : "Delete your confession"}
                    >
                      <IconTrash size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Delete Confirmation */}
              {showConfirmDelete && (
                <div 
                  className="mt-4 p-3.5 rounded-[8px] border flex items-center justify-between text-[12px] font-mono animate-fadeIn"
                  style={{ 
                    backgroundColor: 'var(--surface-sunken)', 
                    borderColor: 'var(--border-strong)' 
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>
                    {isAdmin && !post.is_own ? 'Moderator action: Delete this confession?' : 'Delete your confession permanently?'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
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
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className="px-2.5 py-1 rounded bg-[#EF4444] hover:bg-[#dc2626] text-white font-medium text-[11px] disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </article>

            {/* Discussion & Responses Section */}
            <section className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Discussion ({comments.length})
                </span>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <span 
                      className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1"
                      style={{ 
                        backgroundColor: 'rgba(255, 90, 31, 0.1)', 
                        borderColor: 'rgba(255, 90, 31, 0.25)',
                        color: 'var(--accent)' 
                      }}
                    >
                      <IconLock size={10} />
                      <span>Mod Identities Revealed</span>
                    </span>
                  )}
                  <span className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    Anonymous replies
                  </span>
                </div>
              </div>

              {/* Add Reply Form */}
              <form 
                onSubmit={handleAddReply} 
                className="flex flex-col gap-2 p-4 rounded-[8px] border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <textarea
                  ref={commentInputRef}
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Leave an anonymous reply..."
                  className="w-full rounded-[6px] p-3 text-[13px] border focus:outline-none resize-none transition-colors"
                  style={{ 
                    backgroundColor: 'var(--surface-sunken)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    Replies are completely anonymous
                  </span>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSubmitting}
                    className="px-4 py-1.5 font-medium text-[12px] rounded-[6px] disabled:opacity-40 transition-opacity cursor-pointer"
                    style={{ backgroundColor: 'var(--accent)', color: '#141414' }}
                  >
                    {isSubmitting ? 'Posting...' : 'Reply'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="flex flex-col divide-y mt-2" style={{ borderColor: 'var(--border)' }}>
                {comments.length === 0 ? (
                  <div className="py-12 text-center text-[13px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    No responses yet. Be the first to reply.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="py-4 flex flex-col gap-2 text-left border-b last:border-b-0"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {/* Comment Meta Row */}
                      <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{comment.author_name}</span>
                        <span className="whitespace-nowrap shrink-0">{comment.created_at}</span>
                      </div>

                      {/* Moderator Reveal: Always below Anonymous Student */}
                      {isAdmin && (comment.real_author_name || comment.real_author_email) && (
                        <div className="flex items-center">
                          <span 
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border"
                            style={{ 
                              backgroundColor: 'rgba(255, 90, 31, 0.08)', 
                              borderColor: 'rgba(255, 90, 31, 0.25)',
                              color: 'var(--accent)'
                            }}
                            title="Campus Moderator confidential identity reveal"
                          >
                            <IconLock size={10} />
                            <span>mod reveal:</span>
                            <strong className="text-[11.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {comment.real_author_name}
                            </strong>
                            {comment.real_author_email && (
                              <span style={{ color: 'var(--text-secondary)' }}>
                                ({comment.real_author_email})
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>
        </main>
      </div>

      <TrendingSidebar />
      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={(newC) => {
          if (newC) window.location.href = `/post/${newC.id}`;
        }}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
