import React, { useState } from 'react';
import { IconLock, IconCheck, IconClose, IconAlert, IconEye } from '../icons/Icons';
import { secureRevealAuthorIdentity } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ModeratorRevealModal({ post, isOpen, onClose, onRevealed }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [revealedData, setRevealedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !post) return null;

  const handleClose = () => {
    setHasConfirmed(false);
    setRevealedData(null);
    setErrorMsg('');
    onClose();
  };

  const handleConfirmAndReveal = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await secureRevealAuthorIdentity(post.id || post.post_number);
      if (res.success) {
        setRevealedData(res.data);
        setHasConfirmed(true);
        addToast(`Privileged access logged for ${post.post_number_formatted}`, 'info');
        if (onRevealed) onRevealed(res.data);
      } else {
        setErrorMsg(res.error || 'Privileged verification failed.');
      }
    } catch (err) {
      setErrorMsg('Server error during privileged identity lookup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md bg-[#0D0D10] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative flex flex-col gap-5 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#92929A] hover:text-[#F5F5F5] hover:bg-white/[0.05] transition-smooth cursor-pointer"
          aria-label="Close"
        >
          <IconClose size={18} />
        </button>

        {!hasConfirmed ? (
          // Confirmation Screen
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F06A3A]/15 border border-[#F06A3A]/30 flex items-center justify-center text-[#F06A3A] shrink-0">
                <IconLock size={18} />
              </div>
              <div>
                <span className="text-[10.5px] uppercase font-mono font-bold tracking-wider text-[#F06A3A]">
                  Privileged Moderation Action
                </span>
                <h3 className="text-[16px] font-bold text-[#F5F5F5]">
                  View Hidden Profile
                </h3>
              </div>
            </div>

            <div className="bg-[#111114] border border-white/[0.07] rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#92929A]">Target Discussion</span>
                <span className="font-mono font-bold text-[#F06A3A] bg-[#F06A3A]/10 px-2 py-0.5 rounded border border-[#F06A3A]/20">
                  {post.post_number_formatted}
                </span>
              </div>
              <p className="text-[12.5px] font-medium text-[#F5F5F5] line-clamp-2">
                "{post.title}"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111114] border border-[#F06A3A]/30 flex items-start gap-2.5">
              <IconAlert size={16} className="text-[#F06A3A] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#F5F5F5]/90 leading-relaxed font-normal">
                "Viewing hidden identity is a privileged moderation action. This action will be logged."
              </p>
            </div>

            <div className="text-[11.5px] text-[#92929A] leading-relaxed">
              Moderator on record: <strong className="text-[#F5F5F5] font-semibold">{user.name || 'Jordan Brooks'}</strong>. Your action will be permanently recorded in the immutable moderation audit trail.
            </div>

            {errorMsg && (
              <div className="text-xs text-[#E06C75] bg-[#E06C75]/10 border border-[#E06C75]/25 p-2.5 rounded-lg">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.07]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#92929A] hover:text-[#F5F5F5] hover:bg-white/[0.05] transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirmAndReveal}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F06A3A] hover:bg-[#d8582b] text-white transition-smooth flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <IconEye size={14} />
                <span>{isLoading ? 'Verifying...' : 'Confirm & View Identity'}</span>
              </button>
            </div>
          </div>
        ) : (
          // Revealed Hidden Profile Screen
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.07]">
              <div className="w-9 h-9 rounded-xl bg-[#67B591]/15 border border-[#67B591]/30 flex items-center justify-center text-[#67B591] shrink-0">
                <IconCheck size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#67B591]">
                  Confidential Moderator Disclosure
                </span>
                <h3 className="text-[16px] font-bold text-[#F5F5F5]">
                  Hidden Profile
                </h3>
              </div>
            </div>

            {/* Identity Details Card */}
            <div className="bg-[#111114] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase tracking-wider text-[#92929A] font-mono">
                  Hidden Identity
                </span>
                <span className="text-[16px] font-bold text-[#F5F5F5]">
                  {revealedData?.hidden_identity || 'Sam'}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase tracking-wider text-[#92929A] font-mono">
                  Registered Email
                </span>
                <span className="text-[13px] font-mono text-[#F5F5F5] select-all">
                  {revealedData?.registered_email || 'sam@student.college.edu'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.05]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#92929A] font-mono">
                    User ID
                  </span>
                  <span className="text-[11px] font-mono text-[#92929A] select-all truncate">
                    {revealedData?.user_id || 'uuid-anon-sam-828'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#92929A] font-mono">
                    Account Status
                  </span>
                  <span className="text-[12px] font-semibold text-[#67B591] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#67B591]" />
                    {revealedData?.account_status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Confirmation Tag */}
            <div className="p-3 rounded-xl bg-[#09090B] border border-white/[0.05] flex flex-col gap-1 text-[11px] text-[#92929A]">
              <div className="flex items-center justify-between">
                <span>Moderator: <strong className="text-[#F5F5F5]">{user.name || 'Jordan Brooks'}</strong></span>
                <span className="font-mono text-[10px]">{revealedData?.timestamp || 'Just now'}</span>
              </div>
              <div className="flex items-center justify-between text-[10.5px]">
                <span>Action: <strong className="text-[#F06A3A]">Viewed hidden identity</strong></span>
                <span>Post: <strong className="text-[#F5F5F5]">{post.post_number_formatted}</strong></span>
              </div>
              <span className="text-[10px] text-[#67B591] font-medium pt-1 border-t border-white/[0.05]">
                &bull; Immutable audit log entry created
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111114] hover:bg-white/[0.08] text-[#F5F5F5] border border-white/[0.07] transition-smooth cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
