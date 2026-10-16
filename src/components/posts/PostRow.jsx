import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DeterministicAvatar,
  IconArrowUp,
  IconArrowDown,
  IconComment,
  IconShare,
  IconBookmark,
  IconReport,
  IconLock,
  IconClose
} from '../icons/Icons';
import { reactToPost, recordPostShare, fetchComments, addComment } from '../../services/db';
import { formatRelativeTime } from '../../utils/time';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ReportModal from '../modals/ReportModal';
import ModeratorRevealModal from '../modals/ModeratorRevealModal';

export default function PostRow({ 
  post, 
  onUpdate,
  initiallyExpandedThread = false,
  isKeyboardSelected = false 
}) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [likes, setLikes] = useState(post.likes || 0);
  const [, setDislikes] = useState(post.dislikes || 0);
  const [userReaction, setUserReaction] = useState(post.user_reaction || null);
  const [isExpandedText, setIsExpandedText] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isVoteFlash, setIsVoteFlash] = useState(false);

  // Inline comment thread state
  const [isThreadOpen, setIsThreadOpen] = useState(initiallyExpandedThread);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [collapsedComments, setCollapsedComments] = useState({});
  const [replyText, setReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isRevealOpen, setIsRevealOpen] = useState(false);

  const isLongContent = post.content && post.content.length > 240;
  const displayContent = isLongContent && !isExpandedText
    ? post.content.substring(0, 240) + '...'
    : post.content;

  const handleUpvote = async (e) => {
    if (e) e.stopPropagation();
    setIsVoteFlash(true);
    setTimeout(() => setIsVoteFlash(false), 200);

    const isCurrentlyLiked = userReaction === 'like';
    const newReaction = isCurrentlyLiked ? null : 'like';
    const newLikes = isCurrentlyLiked ? likes - 1 : likes + 1;
    
    // Optimistic update
    setUserReaction(newReaction);
    setLikes(newLikes);

    try {
      const res = await reactToPost(post.id, 'like');
      if (res && res.success) {
        setLikes(res.likes);
        setDislikes(res.dislikes);
        setUserReaction(res.user_reaction);
        if (onUpdate) onUpdate({ ...post, likes: res.likes, dislikes: res.dislikes, user_reaction: res.user_reaction });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async (e) => {
    if (e) e.stopPropagation();
    const isCurrentlyDisliked = userReaction === 'dislike';
    const newReaction = isCurrentlyDisliked ? null : 'dislike';
    const newLikes = userReaction === 'like' ? likes - 1 : likes;

    setUserReaction(newReaction);
    setLikes(newLikes);

    try {
      const res = await reactToPost(post.id, 'dislike');
      if (res && res.success) {
        setLikes(res.likes);
        setDislikes(res.dislikes);
        setUserReaction(res.user_reaction);
        if (onUpdate) onUpdate({ ...post, likes: res.likes, dislikes: res.dislikes, user_reaction: res.user_reaction });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    handleUpvote();
  };

  const handleToggleThread = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id || post.post_number}?comment=true`);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/post/${post.post_number}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        addToast(`link copied: /post/${post.post_number}`, 'success');
      } else {
        addToast(`post link: ${shareUrl}`, 'info');
      }
      recordPostShare(post.id);
    } catch (_err) {
      addToast('could not copy link', 'error');
    }
  };

  const handleToggleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    addToast(isSaved ? 'post unsaved' : 'post saved', 'info');
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const res = await addComment({
        postId: post.id,
        content: replyText.trim(),
        isAnonymous: true,
        replyToCommentId: replyingToId
      });

      if (res && res.success) {
        setComments(prev => [...prev, res.comment]);
        setReplyText('');
        setReplyingToId(null);
        post.comment_count = (post.comment_count || 0) + 1;
        addToast('reply posted', 'success');
      }
    } catch (err) {
      addToast('failed to post reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const toggleCollapseComment = (commentId) => {
    setCollapsedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Build tree structure for comments
  const rootComments = comments.filter(c => !c.parent_id);
  const getChildReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  return (
    <article
      onClick={() => navigate(`/post/${post.post_number}`)}
      onDoubleClick={handleDoubleClick}
      className={`group w-full text-left select-none border-b border-[#232323] transition-fast cursor-pointer px-4 py-4 flex gap-3 ${
        isKeyboardSelected ? 'bg-[#161616]' : 'bg-[#0A0A0A] hover:bg-[#111111]'
      }`}
    >
      {/* Left: Compact Reddit-style Vote Column (40px) */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-[40px] shrink-0 flex flex-col items-center pt-0.5 select-none"
      >
        <button
          type="button"
          onClick={handleUpvote}
          aria-label="Upvote"
          className={`p-1 rounded-[4px] transition-fast cursor-pointer ${
            userReaction === 'like'
              ? 'text-[#FF5A1F] scale-105'
              : 'text-[#6B6B6B] hover:text-[#EDEDED] hover:bg-[#161616]'
          }`}
        >
          <IconArrowUp size={15} />
        </button>

        <span 
          className={`font-mono text-[12px] font-semibold tabular-nums my-0.5 transition-fast ${
            userReaction === 'like'
              ? 'text-[#FF5A1F]'
              : userReaction === 'dislike'
              ? 'text-[#6B6B6B]'
              : 'text-[#A1A1A1]'
          } ${isVoteFlash ? 'scale-110' : ''}`}
        >
          {likes}
        </span>

        <button
          type="button"
          onClick={handleDownvote}
          aria-label="Downvote"
          className={`p-1 rounded-[4px] transition-fast cursor-pointer ${
            userReaction === 'dislike'
              ? 'text-[#EDEDED]'
              : 'text-[#6B6B6B] hover:text-[#EDEDED] hover:bg-[#161616]'
          }`}
        >
          <IconArrowDown size={15} />
        </button>
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Line: Avatar + Anonymous handle · dot category · relative time */}
        <div className="flex items-center gap-2 text-[13px] text-[#A1A1A1] leading-none mb-1.5 flex-wrap">
          <DeterministicAvatar 
            id={post.id} 
            name={post.author_name} 
            isAnonymous={post.is_anonymous} 
            size={22} 
          />

          <span className="font-medium text-[#EDEDED]">
            {post.is_anonymous ? 'Anonymous Student' : post.author_name}
          </span>

          <span className="text-[#6B6B6B]">&middot;</span>

          <span className="flex items-center gap-1 text-[#A1A1A1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B6B6B]" />
            <span>{post.category}</span>
          </span>

          <span className="text-[#6B6B6B]">&middot;</span>

          <span 
            className="text-[#6B6B6B] font-mono text-[12px]" 
            title={new Date(post.created_at).toLocaleString()}
          >
            {formatRelativeTime(post.created_at)}
          </span>

          <span className="font-mono text-[11px] text-[#6B6B6B] ml-auto">
            {post.post_number_formatted}
          </span>
        </div>

        {/* Verified Moderator Real Author Line (Only when isAdmin) */}
        {isAdmin && post.is_anonymous && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="mb-2 py-1 px-2 rounded-[4px] bg-[#161616] border border-[#333333] flex items-center justify-between text-[11px] font-mono"
          >
            <div className="flex items-center gap-1.5 text-[#FF5A1F]">
              <IconLock size={11} />
              <span>[mod reveal]: <strong>{post.real_author_name}</strong> ({post.real_author_email})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsRevealOpen(true)}
              className="text-[#6B6B6B] hover:text-[#EDEDED] underline cursor-pointer"
            >
              audit dossier
            </button>
          </div>
        )}

        {/* Title: 20px, weight 600, letter-spacing -0.02em */}
        <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#EDEDED] leading-[1.3] tracking-[-0.02em] mb-1.5">
          {post.title}
        </h2>

        {/* Body Text: 14px text-secondary, 1.55 line-height */}
        <div className="text-[14px] text-[#A1A1A1] leading-[1.55] font-normal mb-3 whitespace-pre-line">
          {displayContent}
          {isLongContent && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpandedText(!isExpandedText);
              }}
              className="ml-1 text-[13px] text-[#EDEDED] underline hover:text-[#FF5A1F] cursor-pointer inline transition-fast font-medium"
            >
              {isExpandedText ? 'show less' : 'Read more'}
            </button>
          )}
        </div>



        {/* Action Row: reply count, share, save, report */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="flex items-center gap-4 text-[13px] text-[#6B6B6B] pt-1"
        >
          <button
            type="button"
            onClick={handleToggleThread}
            className={`flex items-center gap-1.5 transition-fast cursor-pointer ${
              isThreadOpen ? 'text-[#EDEDED]' : 'hover:text-[#EDEDED]'
            }`}
          >
            <IconComment size={14} />
            <span className="font-mono text-[12px] tabular-nums">{post.comment_count || 0}</span>
            <span className="hidden sm:inline">replies</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-[#EDEDED] transition-fast cursor-pointer"
            title="Copy share link"
          >
            <IconShare size={14} />
            <span className="hidden sm:inline">share</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex items-center gap-1.5 transition-fast cursor-pointer ${
              isSaved ? 'text-[#FF5A1F]' : 'hover:text-[#EDEDED]'
            }`}
            title="Save post"
          >
            <IconBookmark size={14} />
            <span className="hidden sm:inline">{isSaved ? 'saved' : 'save'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1.5 hover:text-[#EF4444] transition-fast cursor-pointer ml-auto"
            title="Report post"
          >
            <IconReport size={14} />
            <span className="hidden sm:inline">report</span>
          </button>
        </div>

        {/* Expanded Discussion Thread (Reddit-style with 1px vertical guide line) */}
        {isThreadOpen && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="mt-4 pt-3 border-t border-[#232323] flex flex-col gap-3"
          >
            {/* Inline Reply Form */}
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-2 bg-[#111111] border border-[#232323] rounded-[6px] p-2.5">
              {replyingToId && (
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B6B]">
                  <span>replying to comment...</span>
                  <button type="button" onClick={() => setReplyingToId(null)} className="hover:text-[#EDEDED]">
                    <IconClose size={12} />
                  </button>
                </div>
              )}
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What happened? (reply anonymously)"
                className="w-full bg-transparent text-[#EDEDED] text-[13px] placeholder-[#6B6B6B] outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between pt-1.5 border-t border-[#232323]">
                <span className="text-[11px] font-mono text-[#6B6B6B] flex items-center gap-1">
                  <IconLock size={11} className="text-[#FF5A1F]" />
                  <span>anonymous</span>
                </span>
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="px-3 py-1 bg-[#FF5A1F] hover:bg-[#ff6e38] text-[#0A0A0A] font-semibold text-[12px] rounded-[4px] transition-fast cursor-pointer disabled:opacity-40"
                >
                  {isSubmittingReply ? 'sending...' : 'reply'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="py-4 text-center font-mono text-[12px] text-[#6B6B6B]">
                loading replies...
              </div>
            ) : rootComments.length === 0 ? (
              <div className="py-3 text-center text-[13px] text-[#6B6B6B]">
                no replies yet. be the first to participate.
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                {rootComments.map(comment => renderCommentThread(comment, getChildReplies, collapsedComments, toggleCollapseComment, setReplyingToId, 0, isAdmin))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Privileged Mod Reveal Modal */}
      <ModeratorRevealModal
        post={post}
        isOpen={isRevealOpen}
        onClose={() => setIsRevealOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        post={post}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </article>
  );
}

// Recursive Reddit-style comment renderer with 1px vertical guide lines per depth level
function renderCommentThread(comment, getChildReplies, collapsedComments, onToggleCollapse, onSetReplyTo, depth = 0, isAdmin = false) {
  const isCollapsed = collapsedComments[comment.id];
  const children = getChildReplies(comment.id);

  return (
    <div key={comment.id} className={`flex flex-col ${depth > 0 ? 'ml-3 pl-3 border-l border-[#232323]' : ''}`}>
      <div className="flex items-start gap-2 py-1.5 group/comment">
        {/* Clickable 1px vertical guide line collapse */}
        <button
          type="button"
          onClick={() => onToggleCollapse(comment.id)}
          className="mt-1 w-2 flex justify-center text-[#6B6B6B] hover:text-[#FF5A1F] cursor-pointer"
          title={isCollapsed ? 'Expand comment' : 'Collapse thread'}
        >
          <span className="w-[1px] h-3 bg-[#333333] hover:bg-[#FF5A1F]" />
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between text-[12px] text-[#A1A1A1] leading-none mb-1">
            <span className="font-medium text-[#EDEDED]">
              {comment.is_anonymous ? 'Anonymous Student' : comment.author_name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#6B6B6B] font-mono text-[11px] whitespace-nowrap">
                {formatRelativeTime(comment.created_at)}
              </span>
              {isCollapsed && (
                <span className="font-mono text-[11px] text-[#6B6B6B]">
                  [{children.length + 1} hidden]
                </span>
              )}
            </div>
          </div>

          {/* Moderator Reveal: Always below Anonymous Student */}
          {isAdmin && (comment.real_author_name || comment.real_author_email) && (
            <div className="flex items-center mb-1.5">
              <span 
                className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10.5px] font-mono border bg-[#FF5A1F]/10 border-[#FF5A1F]/30 text-[#FF5A1F]"
                title="Campus Moderator confidential identity reveal"
              >
                <IconLock size={9} />
                <span>mod reveal:</span>
                <strong className="text-[#EDEDED] font-semibold">{comment.real_author_name}</strong>
                {comment.real_author_email && (
                  <span className="text-[#6B6B6B]">({comment.real_author_email})</span>
                )}
              </span>
            </div>
          )}

          {!isCollapsed && (
            <>
              <p className="text-[13px] text-[#A1A1A1] leading-relaxed">
                {comment.content}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-[#6B6B6B]">
                <button
                  type="button"
                  onClick={() => onSetReplyTo(comment.id)}
                  className="hover:text-[#EDEDED] transition-fast cursor-pointer"
                >
                  reply
                </button>
              </div>

              {/* Nested Children Replies */}
              {children.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {children.map(child => renderCommentThread(child, getChildReplies, collapsedComments, onToggleCollapse, onSetReplyTo, depth + 1, isAdmin))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
