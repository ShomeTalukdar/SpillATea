import React, { useState, useRef, useEffect } from 'react';
import { IconClose, IconLock } from '../icons/Icons';
import { createConfession } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Crushes',
  'Confessions',
  'Lost & Found',
  'Late Night',
  'Academics',
  'Advice'
];

/**
 * CreatePostModal — 560px Daily Confession Composer
 * 
 * - 20px serif textarea matching published confession
 * - Optional "To:" target line
 * - Character count in mono
 * - Live Card Preview mode so the author feels the weight of posting
 * - Calm confirmation: "Posted. It will appear in tonight's drop."
 */
export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [toTarget, setToTarget] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Confessions');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    }
    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createConfession({
        body: body.trim(),
        to_target: toTarget.trim() || null,
        category,
        is_anonymous: isAnonymous
      });

      if (res && res.success) {
        if (onPostCreated) onPostCreated(res.confession);
        addToast('Confession posted live', 'success');
        onClose();
        setToTarget('');
        setBody('');
        setPreviewMode(false);
      } else {
        addToast(res?.error || 'failed to publish', 'error');
      }
    } catch (_err) {
      addToast('error submitting confession', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-[560px] bg-[#111111] border border-[#262626] rounded-[12px] p-6 flex flex-col gap-4 text-left shadow-2xl relative"
      >
        {/* Header line with Write / Preview toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-mono text-[#EDEDED] uppercase tracking-wider font-medium">
                  Spill
                </span>
                <div className="flex items-center border border-[#262626] rounded-[6px] overflow-hidden text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-2.5 py-0.5 transition-colors ${
                      !previewMode ? 'bg-[#262626] text-[#EDEDED]' : 'text-[#6B6B6B] hover:text-[#A1A1A1]'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-2.5 py-0.5 transition-colors ${
                      previewMode ? 'bg-[#262626] text-[#EDEDED]' : 'text-[#6B6B6B] hover:text-[#A1A1A1]'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-[#6B6B6B] hover:text-[#EDEDED] transition-colors"
              >
                <IconClose size={16} />
              </button>
            </div>

            {/* PREVIEW MODE */}
            {previewMode ? (
              <div className="p-6 rounded-[12px] border border-[#3A3A3A] bg-[#0A0A0A] flex flex-col gap-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B6B] border-b border-[#262626] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EDEDED]">No. PREVIEW</span>
                    <span>·</span>
                    <span className="uppercase text-[#A1A1A1]">{category}</span>
                  </div>
                  <span>Live immediately</span>
                </div>

                {toTarget && (
                  <div className="border-l-2 border-[#FF5A1F] pl-2 text-[12px] font-mono text-[#A1A1A1]">
                    {toTarget.startsWith('To:') ? toTarget : `To: ${toTarget}`}
                  </div>
                )}

                <p className="font-confession text-[20px] leading-[1.55] text-[#EDEDED] font-normal whitespace-pre-line min-h-[120px]">
                  {body || <span className="text-[#6B6B6B] italic">Start typing your confession to preview...</span>}
                </p>

                <div className="text-[11px] font-mono text-[#6B6B6B] pt-2 border-t border-[#262626] flex items-center justify-between">
                  <span>{isAnonymous ? 'Posted anonymously' : `Posted as ${user.name}`}</span>
                  <span>0 likes · 0 signals</span>
                </div>
              </div>
            ) : (
              /* WRITE MODE */
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Optional "To:" field */}
                <div>
                  <input
                    type="text"
                    value={toTarget}
                    onChange={(e) => setToTarget(e.target.value)}
                    placeholder="To: (e.g. the guy in the blue hoodie, Organic Chem)"
                    maxLength={90}
                    className="w-full bg-[#161616] border border-[#262626] rounded-[6px] px-3 py-2 text-[13px] font-mono text-[#EDEDED] placeholder-[#6B6B6B] focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                {/* Main Confession Textarea: 20px serif text */}
                <div className="relative">
                  <textarea
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What happened?"
                    maxLength={1000}
                    autoFocus
                    className="w-full bg-[#161616] border border-[#262626] rounded-[8px] p-4 font-confession text-[20px] leading-[1.55] text-[#EDEDED] placeholder-[#6B6B6B] focus:outline-none focus:border-[#FF5A1F] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 font-mono text-[11px] text-[#6B6B6B] tabular-nums">
                    {body.length} / 1000
                  </div>
                </div>

                {/* Controls: Category, Anonymous Toggle */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-mono border transition-colors ${
                      isAnonymous
                        ? 'border-[#3A3A3A] text-[#EDEDED] bg-[#161616]'
                        : 'border-[#262626] text-[#A1A1A1] hover:text-[#EDEDED]'
                    }`}
                  >
                    <IconLock size={12} className={isAnonymous ? 'text-[#FF5A1F]' : 'text-[#6B6B6B]'} />
                    <span>{isAnonymous ? 'Anonymous' : user.name}</span>
                  </button>

                  {/* Custom Category Dropdown: Light orange border, blue active/hover item */}
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-[6px] text-[13px] font-mono transition-all cursor-pointer select-none"
                      style={{
                        backgroundColor: 'var(--surface-sunken)',
                        border: '1.5px solid #FF5A1F',
                        color: 'var(--text-primary)',
                        boxShadow: isCategoryOpen ? '0 0 10px rgba(255, 90, 31, 0.4)' : 'none'
                      }}
                      title="Select category"
                    >
                      <span>{category}</span>
                      <svg 
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${isCategoryOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Options Popup */}
                    {isCategoryOpen && (
                      <div 
                        className="absolute right-0 top-full mt-1.5 w-[165px] rounded-[6px] border py-1 z-30 shadow-2xl animate-fadeIn"
                        style={{
                          backgroundColor: '#111114',
                          borderColor: 'rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        {CATEGORIES.map((cat) => {
                          const isSelected = cat === category;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setCategory(cat);
                                setIsCategoryOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-1.5 text-[13px] font-mono cursor-pointer transition-colors block select-none"
                              style={{
                                backgroundColor: isSelected ? '#FF5A1F' : 'transparent',
                                color: isSelected ? '#0A0A0A' : '#EDEDED',
                                fontWeight: isSelected ? 600 : 400
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = '#FF5A1F';
                                  e.currentTarget.style.color = '#0A0A0A';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#EDEDED';
                                }
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action: Spill Confession button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={!body.trim() || isSubmitting}
                    className="btn-spill-tea h-[38px] px-6 text-[13px] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <span>{isSubmitting ? 'Posting...' : 'Spill Confession'}</span>
                  </button>
                </div>
              </form>
            )}
      </div>
    </div>
  );
}
