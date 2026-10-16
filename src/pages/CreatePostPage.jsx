import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { 
  IconBack, 
  IconLock, 
  DeterministicAvatar, 
  IconAlert
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
  'Memes & Fun',
  'Advice'
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Confessions');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const TITLE_MAX = 120;
  const CONTENT_MAX = 5000;

  const isFormValid = title.trim().length >= 3 && content.trim().length > 0 && !isSubmitting;

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
        setErrorMessage(res.error || 'failed to publish post.');
        setIsSubmitting(false);
        return;
      }

      addToast(`spilled as ${res.post.post_number_formatted}`, 'success');
      navigate(`/post/${res.post.post_number}`);
    } catch (_err) {
      setErrorMessage('error submitting. your content has been preserved.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <Sidebar onOpenCommandPalette={() => setIsCommandOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-0 sm:px-6 py-0 sm:py-6">
          <div className="w-full max-w-[640px] flex flex-col border-x border-[#232323] min-h-screen text-left">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#232323] flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-[12px] font-mono text-[#6B6B6B] hover:text-[#EDEDED] transition-fast"
              >
                <IconBack size={14} />
                <span>feed</span>
              </Link>
              <span className="font-mono text-[11px] text-[#6B6B6B]">
                NEW SPILL
              </span>
            </div>

            <div className="p-4 border-b border-[#232323] flex flex-col gap-1">
              <h1 className="text-[24px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                Spill Something
              </h1>
              <p className="text-[13px] text-[#A1A1A1]">
                share a confession, opinion, or question anonymously with campus.
              </p>
            </div>

            {errorMessage && (
              <div className="m-4 p-3 bg-[#161616] border border-[#EF4444]/40 rounded-[6px] flex items-center gap-2 text-[12px] text-[#EF4444]">
                <IconAlert size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              {/* Identity toggle card */}
              <div className="bg-[#111111] p-3 rounded-[6px] border border-[#232323] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DeterministicAvatar isAnonymous={isAnonymous} name={user.name} size={28} />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-[#EDEDED]">
                      {isAnonymous ? 'Posting Anonymously' : `Posting as ${user.name}`}
                    </span>
                    <span className="text-[11px] text-[#6B6B6B]">
                      {isAnonymous ? 'identity is private from other students' : 'name will appear publicly'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`px-2.5 py-1 rounded-[6px] text-[12px] font-mono border transition-fast cursor-pointer ${
                    isAnonymous
                      ? 'border-[#333333] text-[#EDEDED] bg-[#161616]'
                      : 'border-[#232323] text-[#A1A1A1]'
                  }`}
                >
                  {isAnonymous ? 'anonymous' : 'public'}
                </button>
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Category
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`h-[28px] px-3 rounded-[9999px] text-[12px] font-medium shrink-0 transition-fast cursor-pointer border ${
                        category === cat
                          ? 'bg-[#EDEDED] text-[#0A0A0A] border-[#EDEDED] font-semibold'
                          : 'bg-transparent text-[#6B6B6B] hover:text-[#EDEDED] border-[#232323]'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B6B]">
                  <span>TITLE</span>
                  <span className="tabular-nums">{title.length}/{TITLE_MAX}</span>
                </div>
                <input
                  type="text"
                  maxLength={TITLE_MAX}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Headline (concise summary)"
                  className="w-full bg-[#111111] border border-[#232323] focus:border-[#333333] rounded-[6px] px-3 py-2 text-[14px] text-[#EDEDED] placeholder-[#6B6B6B] outline-none font-medium"
                />
              </div>

              {/* Content textarea with dry placeholder */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B6B]">
                  <span>BODY</span>
                  <span className="tabular-nums">{content.length}/{CONTENT_MAX}</span>
                </div>
                <textarea
                  rows={6}
                  maxLength={CONTENT_MAX}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What happened?"
                  className="w-full bg-[#111111] border border-[#232323] focus:border-[#333333] rounded-[6px] p-3 text-[14px] text-[#EDEDED] placeholder-[#6B6B6B] outline-none resize-y leading-[1.55]"
                />
              </div>

              {/* Submit Row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#232323]">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6B6B6B]">
                  <IconLock size={12} className="text-[#FF5A1F]" />
                  <span>moderation guidelines active</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    className="px-3 py-1.5 text-[13px] text-[#A1A1A1] hover:text-[#EDEDED]"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="btn-spill-tea h-[38px] px-6 text-[13px] disabled:opacity-40"
                  >
                    <span>{isSubmitting ? 'Spilling...' : 'Spill Something'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      <MobileNav onOpenCreate={() => {}} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onOpenCreate={() => {}} />
    </div>
  );
}
