import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import { 
  IconBack, 
  AnonymousAvatar, 
  PublicAvatar, 
  IconLike, 
  IconDislike, 
  IconShare, 
  IconReport,
  IconComment,
  IconClose
} from '../components/icons/Icons';
import { fetchPostById, fetchComments, addComment, reactToPost, recordPostShare } from '../services/db';
import { formatRelativeTime } from '../utils/time';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ReportModal from '../components/modals/ReportModal';

export default function PostPage() {
  const { postNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New comment states
  const [newCommentText, setNewCommentText] = useState('');
  const [isAnonComment, setIsAnonComment] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  // Report modal
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    async function loadPostAndComments() {
      setIsLoading(true);
      try {
        const foundPost = await fetchPostById(postNumber);
        if (foundPost) {
          setPost(foundPost);
          const comms = await fetchComments(foundPost.id);
          setComments(comms);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPostAndComments();
  }, [postNumber]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const res = await reactToPost(post.id, 'like');
      if (res.success) {
        setPost(prev => ({
          ...prev,
          likes: res.likes,
          dislikes: res.dislikes,
          user_reaction: res.user_reaction
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDislike = async () => {
    if (!post) return;
    try {
      const res = await reactToPost(post.id, 'dislike');
      if (res.success) {
        setPost(prev => ({
          ...prev,
          likes: res.likes,
          dislikes: res.dislikes,
          user_reaction: res.user_reaction
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        addToast(`Canonical link copied to clipboard.`, 'success');
      } else {
        addToast(`Link: ${url}`, 'info');
      }
      recordPostShare(post.id);
    } catch (e) {
      addToast('Failed to copy link.', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmittingComment || !post) return;

    setIsSubmittingComment(true);
    try {
      const res = await addComment({
        postId: post.id,
        content: newCommentText.trim(),
        is_anonymous: isAnonComment,
        parent_id: replyingToCommentId
      });

      if (res.success) {
        setComments(prev => [...prev, res.comment]);
        setNewCommentText('');
        setReplyingToCommentId(null);
        setPost(prev => ({ ...prev, comment_count: (prev.comment_count || 0) + 1 }));
        addToast('Comment added.', 'success');
      } else {
        addToast(res.error || 'Failed to post comment.', 'error');
      }
    } catch (err) {
      addToast('Error posting comment.', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="w-8 h-8 border-2 border-[#F07845] border-t-transparent rounded-full animate-spin" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Discussion Not Found</h2>
          <p className="text-xs text-[#777780] mb-4">Post #{postNumber} does not exist or may have been removed.</p>
          <Link to="/" className="px-4 py-2 bg-[#1C1C20] border border-[#2A2A2F] text-xs font-medium rounded-lg hover:text-[#F07845] transition-smooth">
            Return to Community Feed
          </Link>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-3 sm:px-6 py-6">
          <div className="w-full max-w-2xl flex flex-col gap-6 text-left">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2F]">
              <Link
                to="/"
                className="flex items-center gap-2 text-xs font-medium text-[#A0A0A8] hover:text-[#F0F0F2] transition-smooth"
              >
                <IconBack size={16} />
                <span>Back to Feed</span>
              </Link>
              <span className="text-xs font-mono font-medium text-[#F07845] bg-[#1C1C20] px-2 py-0.5 rounded border border-[#2A2A2F]">
                {post.post_number_formatted}
              </span>
            </div>

            {/* Post Detail Card */}
            <article className="bg-[#151518] border border-[#2A2A2F] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
              {/* Meta row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {post.is_anonymous ? (
                    <AnonymousAvatar size={38} />
                  ) : (
                    <PublicAvatar name={post.author_name} size={38} />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#F0F0F2]">
                      {post.is_anonymous ? 'Anonymous Student' : post.author_name}
                    </span>
                    <span className="text-xs text-[#777780]">
                      {formatRelativeTime(post.created_at)}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-medium text-[#A0A0A8] bg-[#1C1C20] border border-[#2A2A2F] px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Title & Content */}
              <div className="flex flex-col gap-3">
                <h1 className="text-lg sm:text-xl font-semibold text-[#F0F0F2] leading-snug">
                  {post.title}
                </h1>
                <div className="text-sm text-[#F0F0F2]/90 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2F] text-xs text-[#777780]">
                {/* Reaction controls */}
                <div className="flex items-center gap-1 bg-[#1C1C20] border border-[#2A2A2F] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-smooth cursor-pointer ${
                      post.user_reaction === 'like'
                        ? 'text-[#F07845] bg-[#2A2A2F]/60'
                        : 'hover:text-[#F0F0F2] hover:bg-[#2A2A2F]/30'
                    }`}
                  >
                    <IconLike size={16} active={post.user_reaction === 'like'} />
                    <span className="font-semibold text-xs text-[#F0F0F2]">{post.likes}</span>
                  </button>
                  <div className="w-[1px] h-3.5 bg-[#2A2A2F]" />
                  <button
                    type="button"
                    onClick={handleDislike}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-smooth cursor-pointer ${
                      post.user_reaction === 'dislike'
                        ? 'text-[#A0A0A8] bg-[#2A2A2F]/60'
                        : 'hover:text-[#F0F0F2] hover:bg-[#2A2A2F]/30'
                    }`}
                  >
                    <IconDislike size={16} active={post.user_reaction === 'dislike'} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C20] border border-[#2A2A2F] text-[#A0A0A8] hover:text-[#F0F0F2] transition-smooth cursor-pointer"
                  >
                    <IconShare size={15} />
                    <span>Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="p-2 rounded-lg bg-[#1C1C20] border border-[#2A2A2F] text-[#777780] hover:text-[#E36B73] transition-smooth cursor-pointer"
                    title="Report discussion"
                  >
                    <IconReport size={15} />
                  </button>
                </div>
              </div>
            </article>

            {/* Comment Section Header */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-sm font-semibold text-[#F0F0F2] flex items-center gap-2">
                <IconComment size={16} className="text-[#F07845]" />
                <span>Discussion ({comments.length})</span>
              </h2>
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-3 bg-[#151518] border border-[#2A2A2F] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#2A2A2F]">
                <div className="flex items-center gap-2">
                  {isAnonComment ? <AnonymousAvatar size={24} /> : <PublicAvatar name={user.name} size={24} />}
                  <span className="text-[#A0A0A8]">
                    Commenting as: <span className="text-[#F0F0F2] font-medium">{isAnonComment ? 'Anonymous Student' : user.name}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonComment(!isAnonComment)}
                  className="text-[11px] text-[#F07845] hover:underline cursor-pointer"
                >
                  Switch to {isAnonComment ? 'Public Name' : 'Anonymous'}
                </button>
              </div>

              {replyingToCommentId && (
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#1C1C20] rounded text-xs text-[#A0A0A8]">
                  <span>Replying to comment thread</span>
                  <button
                    type="button"
                    onClick={() => setReplyingToCommentId(null)}
                    className="text-[#777780] hover:text-[#F0F0F2]"
                  >
                    <IconClose size={13} />
                  </button>
                </div>
              )}

              <textarea
                rows={3}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Join the discussion... (Profanity is masked automatically)"
                className="w-full bg-[#1C1C20] border border-[#2A2A2F] rounded-lg p-3 text-xs text-[#F0F0F2] placeholder-[#777780] focus:border-[#F07845] outline-none resize-none transition-smooth leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim() || isSubmittingComment}
                  className="px-4 py-2 bg-[#F07845] hover:bg-[#e06b3a] disabled:opacity-40 disabled:cursor-not-allowed text-[#0D0D0F] font-semibold text-xs rounded-lg transition-smooth cursor-pointer"
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>

            {/* Comment Thread List */}
            <div className="flex flex-col gap-3">
              {comments.length === 0 ? (
                <div className="p-8 text-center bg-[#151518] border border-[#2A2A2F] rounded-xl text-xs text-[#777780]">
                  No replies yet. Be the first to share your perspective.
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-[#151518] border border-[#2A2A2F] rounded-xl flex flex-col gap-2.5 text-left"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {comment.is_anonymous ? (
                          <AnonymousAvatar size={26} />
                        ) : (
                          <PublicAvatar name={comment.author_name} size={26} />
                        )}
                        <span className="font-semibold text-[#F0F0F2]">
                          {comment.is_anonymous ? 'Anonymous Student' : comment.author_name}
                        </span>
                        <span className="text-[#777780] text-[11px]">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#A0A0A8] leading-relaxed pl-8">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 pl-8 pt-1 text-[11px] text-[#777780]">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingToCommentId(comment.id);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="hover:text-[#F0F0F2] transition-smooth cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <TrendingSidebar />
      <MobileNav />

      {/* Report Modal */}
      <ReportModal
        post={post}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
