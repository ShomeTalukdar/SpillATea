import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import PostCard from '../components/posts/PostCard';
import { 
  IconBack, 
  IconLock, 
  IconEye, 
  AnonymousAvatar, 
  PublicAvatar, 
  IconAlert,
  IconCheck
} from '../components/icons/Icons';
import { createPost } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'Confessions',
  'College Life',
  'Academics',
  'Relationships',
  'Rants',
  'Memes and Fun',
  'Advice'
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  // Form states
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Confessions');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Character limits
  const TITLE_MAX = 120;
  const CONTENT_MAX = 5000;

  const isTitleValid = title.trim().length >= 3 && title.trim().length <= TITLE_MAX;
  const isContentValid = content.trim().length > 0 && content.trim().length <= CONTENT_MAX;
  const isFormValid = isTitleValid && isContentValid && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        is_anonymous: isAnonymous
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to publish post.');
        setIsSubmitting(false);
        return;
      }

      if (res.requiresReview) {
        addToast(`Post submitted. Held for moderation review: ${res.reviewReason}`, 'info', 5000);
        navigate('/');
      } else {
        addToast(`Published as ${res.post.post_number_formatted}!`, 'success');
        navigate(`/post/${res.post.post_number}`);
      }
    } catch (err) {
      setErrorMessage('A network error occurred while submitting. Your content has been preserved.');
      setIsSubmitting(false);
    }
  };

  // Mock post object for live preview component
  const previewPost = {
    id: 'preview-draft',
    post_number: 99,
    post_number_formatted: '#--',
    is_anonymous: isAnonymous,
    author_name: isAnonymous ? 'Anonymous Student' : user.name,
    title: title.trim() || 'Your story title will appear here...',
    content: content.trim() || 'Your post narrative and campus discussion will be rendered here with formatting and preview.',
    category,
    created_at: new Date().toISOString(),
    likes: 1,
    dislikes: 0,
    comment_count: 0,
    share_count: 0,
    user_reaction: 'like'
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-xl flex flex-col gap-6 text-left">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2F]">
              <Link
                to="/"
                className="flex items-center gap-2 text-xs font-medium text-[#A0A0A8] hover:text-[#F0F0F2] transition-smooth"
              >
                <IconBack size={16} />
                <span>Back to Community</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="flex items-center gap-1.5 text-xs text-[#777780] hover:text-[#F0F0F2] transition-smooth cursor-pointer"
              >
                <IconEye size={15} />
                <span>{showLivePreview ? 'Hide preview' : 'Show preview'}</span>
              </button>
            </div>

            {/* Header Titles */}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-[#F0F0F2] tracking-tight">
                Create a Post
              </h1>
              <p className="text-xs text-[#777780]">
                Share your campus experience, confessions, questions, or rants with fellow students.
              </p>
            </div>

            {/* Error Message if present */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3.5 bg-[#1C1C20] border border-[#E36B73]/60 rounded-xl text-xs text-[#E36B73]">
                <IconAlert size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Field 1: Anonymous Identity Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#151518] border border-[#2A2A2F] rounded-xl">
                <div className="flex items-center gap-3">
                  {isAnonymous ? (
                    <AnonymousAvatar size={34} />
                  ) : (
                    <PublicAvatar name={user.name} size={34} />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#F0F0F2]">
                      Post anonymously
                    </span>
                    <span className="text-[11px] text-[#777780]">
                      {isAnonymous
                        ? 'Your name is hidden from peers. Account privately retained for moderation.'
                        : `Posting publicly as ${user.name}.`}
                    </span>
                  </div>
                </div>

                {/* Accessible switch toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-11 h-6 rounded-full transition-smooth relative cursor-pointer border ${
                    isAnonymous
                      ? 'bg-[#F07845] border-[#F07845]'
                      : 'bg-[#1C1C20] border-[#2A2A2F]'
                  }`}
                  aria-label="Toggle anonymous posting"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-smooth absolute top-0.5 ${
                      isAnonymous ? 'left-6 bg-[#0D0D0F]' : 'left-1 bg-[#A0A0A8]'
                    }`}
                  />
                </button>
              </div>

              {/* Field 4: Category Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A0A0A8]">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth cursor-pointer ${
                        category === cat
                          ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#F07845]'
                          : 'bg-[#151518] text-[#777780] border border-[#2A2A2F] hover:text-[#A0A0A8]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Post Title */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="post-title" className="text-xs font-medium text-[#A0A0A8]">
                    Post Title <span className="text-[#E36B73]">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${title.length > TITLE_MAX ? 'text-[#E36B73]' : 'text-[#777780]'}`}>
                    {title.length} / {TITLE_MAX}
                  </span>
                </div>
                <input
                  id="post-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your story a title..."
                  maxLength={TITLE_MAX}
                  className="w-full bg-[#151518] border border-[#2A2A2F] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F0F2] placeholder-[#777780] focus:border-[#F07845] outline-none transition-smooth"
                />
              </div>

              {/* Field 3: Post Content */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="post-content" className="text-xs font-medium text-[#A0A0A8]">
                    What's on your mind? <span className="text-[#E36B73]">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${content.length > CONTENT_MAX ? 'text-[#E36B73]' : 'text-[#777780]'}`}>
                    {content.length} / {CONTENT_MAX}
                  </span>
                </div>
                <textarea
                  id="post-content"
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write freely. Your fellow students are listening..."
                  maxLength={CONTENT_MAX}
                  className="w-full bg-[#151518] border border-[#2A2A2F] rounded-lg p-3.5 text-sm text-[#F0F0F2] placeholder-[#777780] focus:border-[#F07845] outline-none resize-y transition-smooth leading-relaxed"
                />
              </div>

              {/* Safety Information Box */}
              <div className="p-3 bg-[#1C1C20] border border-[#2A2A2F] rounded-lg flex items-start gap-2.5 text-xs text-[#777780] leading-relaxed">
                <IconLock size={15} className="shrink-0 mt-0.5 text-[#F07845]" />
                <span>
                  Posts undergo server-side moderation to mask profanity and safeguard against harassment or exposed private information. Please keep campus discussions respectful.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/"
                  className="px-4 py-2 text-xs font-medium text-[#A0A0A8] hover:text-[#F0F0F2] transition-smooth"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="px-6 py-2.5 bg-[#F07845] hover:bg-[#e06b3a] disabled:opacity-40 disabled:cursor-not-allowed text-[#0D0D0F] font-semibold text-xs rounded-lg transition-smooth cursor-pointer shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#0D0D0F] border-t-transparent rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Post</span>
                  )}
                </button>
              </div>
            </form>

            {/* Live Preview Section */}
            {showLivePreview && (
              <div className="flex flex-col gap-2.5 pt-6 border-t border-[#2A2A2F]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#777780]">
                    Feed Preview
                  </span>
                  <span className="text-[11px] text-[#777780]">
                    Real-time presentation
                  </span>
                </div>
                <div className="opacity-95 pointer-events-none">
                  <PostCard post={previewPost} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
