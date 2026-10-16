import React, { useState } from 'react';
import { IconClose, IconAlert, IconCheck } from '../icons/Icons';
import { submitReport } from '../../services/db';
import { useToast } from '../../context/ToastContext';

const REPORT_REASONS = [
  'Harassment or Bullying',
  'Hate Speech',
  'Exposed Personal Information',
  'Threat or Violence',
  'Spam or Commercial Promotion',
  'Academic Dishonesty'
];

export default function ReportModal({ post, isOpen, onClose }) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !post) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitReport({
        postId: post.id,
        reason: selectedReason,
        details: details.trim()
      });

      addToast('Report submitted for moderator review.', 'success');
      onClose();
    } catch (err) {
      addToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#0D0D10] border border-white/[0.08] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 text-left text-[#F5F5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <IconAlert size={18} className="text-[#E06C75]" />
            <h2 className="text-base font-semibold text-[#F5F5F5]">Report Post {post.post_number_formatted}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#777780] hover:text-[#F0F0F2] p-1 rounded transition-smooth cursor-pointer"
            aria-label="Close dialog"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Content Preview */}
        <div className="bg-[#1C1C20] border border-[#2A2A2F] p-3 rounded-lg text-xs">
          <span className="text-[#777780] block mb-1">Post title:</span>
          <p className="font-medium text-[#F0F0F2] line-clamp-1">{post.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Reason selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A0A0A8]">
              Select violation reason:
            </label>
            <div className="flex flex-col gap-1.5">
              {REPORT_REASONS.map((reason) => (
                <label 
                  key={reason} 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-smooth ${
                    selectedReason === reason 
                      ? 'bg-[#1C1C20] border-[#F07845] text-[#F0F0F2]' 
                      : 'border-[#2A2A2F] text-[#A0A0A8] hover:border-[#3A3A42]'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-[#F07845]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional details */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="report-details" className="text-xs font-medium text-[#A0A0A8]">
              Optional notes for moderation:
            </label>
            <textarea
              id="report-details"
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context or specify violating sentences..."
              className="w-full bg-[#1C1C20] border border-[#2A2A2F] rounded-lg p-2.5 text-xs text-[#F0F0F2] placeholder-[#777780] focus:border-[#F07845] outline-none resize-none transition-smooth"
            />
          </div>

          <p className="text-[11px] text-[#777780] leading-relaxed">
            Reports are verified by university moderators. Repeated bad-faith reporting may result in account warnings.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2F]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-[#A0A0A8] hover:text-[#F0F0F2] rounded-lg transition-smooth cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-[#E36B73] hover:bg-[#c95b63] text-white rounded-lg transition-smooth cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
