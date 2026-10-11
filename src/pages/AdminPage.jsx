import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import { 
  IconAdmin, 
  IconAlert, 
  IconCheck, 
  IconTrash, 
  IconLock, 
  IconEye, 
  EmptyStateIllustration 
} from '../components/icons/Icons';
import { 
  fetchAdminReportQueue, 
  adminTakeAction, 
  fetchAdminAuditLogs, 
  adminLookupAuthor 
} from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatRelativeTime } from '../utils/time';

export default function AdminPage() {
  const { user, isAdmin, toggleAdminRole } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'audit' | 'guidelines'
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moderatorNotes, setModeratorNotes] = useState({});
  const [revealedAuthors, setRevealedAuthors] = useState({});

  useEffect(() => {
    async function loadAdminData() {
      if (!isAdmin) return;
      setIsLoading(true);
      try {
        const queue = await fetchAdminReportQueue();
        const logs = await fetchAdminAuditLogs();
        setReports(queue);
        setAuditLogs(logs);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  const handleAction = async (reportId, action) => {
    const notes = moderatorNotes[reportId] || '';
    try {
      const res = await adminTakeAction({
        reportId,
        action,
        moderatorNotes: notes
      });

      if (res.success) {
        addToast(`Moderation action completed: ${action}`, 'success');
        const queue = await fetchAdminReportQueue();
        const logs = await fetchAdminAuditLogs();
        setReports(queue);
        setAuditLogs(logs);
      } else {
        addToast(res.error || 'Failed to complete action', 'error');
      }
    } catch (e) {
      addToast('Error performing moderation action', 'error');
    }
  };

  const handleLookupAuthor = async (postId) => {
    try {
      const res = await adminLookupAuthor(postId);
      if (res.success) {
        setRevealedAuthors(prev => ({
          ...prev,
          [postId]: res
        }));
        addToast('Author identity retrieved. Access logged to audit trail.', 'info');
        const logs = await fetchAdminAuditLogs();
        setAuditLogs(logs);
      } else {
        addToast(res.error || 'Failed to look up author', 'error');
      }
    } catch (e) {
      addToast('Error performing lookup', 'error');
    }
  };

  // If user is not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          <MobileHeader />
          <main className="flex-1 flex justify-center items-center px-4">
            <div className="max-w-md w-full bg-[#151518] border border-[#2A2A2F] rounded-xl p-6 text-center flex flex-col items-center gap-4">
              <IconLock size={36} className="text-[#F07845]" />
              <h1 className="text-base font-semibold text-[#F0F0F2]">Admin & Moderator Access Restricted</h1>
              <p className="text-xs text-[#777780] leading-relaxed">
                You are currently viewing CampusEcho as a regular student. Switch your account role to Moderator to review reported discussions and audit logs.
              </p>
              <button
                onClick={toggleAdminRole}
                className="px-4 py-2 bg-[#F07845] hover:bg-[#e06b3a] text-[#0D0D0F] font-semibold text-xs rounded-lg transition-smooth cursor-pointer"
              >
                Switch to Moderator Role
              </button>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-3xl flex flex-col gap-6 text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2F]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <IconAdmin size={20} className="text-[#F07845]" />
                  <h1 className="text-xl font-semibold text-[#F0F0F2] tracking-tight">
                    Campus Moderation Dashboard
                  </h1>
                </div>
                <p className="text-xs text-[#777780]">
                  Review reported discussions, investigate violations, and maintain community safety.
                </p>
              </div>

              <span className="text-xs bg-[#1C1C20] border border-[#2A2A2F] px-3 py-1 rounded-lg text-[#F07845] font-mono">
                {pendingReports.length} Pending
              </span>
            </div>

            {/* Navigation tabs */}
            <div className="flex items-center gap-2 border-b border-[#2A2A2F] pb-2">
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth cursor-pointer ${
                  activeTab === 'queue'
                    ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#2A2A2F]'
                    : 'text-[#777780] hover:text-[#A0A0A8]'
                }`}
              >
                Report Queue ({pendingReports.length})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#2A2A2F]'
                    : 'text-[#777780] hover:text-[#A0A0A8]'
                }`}
              >
                Audit Trail ({auditLogs.length})
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth cursor-pointer ${
                  activeTab === 'guidelines'
                    ? 'bg-[#1C1C20] text-[#F0F0F2] border border-[#2A2A2F]'
                    : 'text-[#777780] hover:text-[#A0A0A8]'
                }`}
              >
                Disciplinary Policy
              </button>
            </div>

            {/* Tab: Report Queue */}
            {activeTab === 'queue' && (
              <div className="flex flex-col gap-4">
                {pendingReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center bg-[#151518] border border-[#2A2A2F] rounded-xl">
                    <EmptyStateIllustration size={64} className="mb-3 text-[#777780]" />
                    <h3 className="text-sm font-semibold text-[#F0F0F2] mb-1">Report Queue Clean</h3>
                    <p className="text-xs text-[#777780]">No student reports or automated flags currently require review.</p>
                  </div>
                ) : (
                  pendingReports.map((report) => {
                    const post = report.post;
                    const revealed = post ? revealedAuthors[post.id] : null;

                    return (
                      <div
                        key={report.id}
                        className="bg-[#151518] border border-[#2A2A2F] rounded-xl p-5 flex flex-col gap-4 text-left"
                      >
                        {/* Report metadata */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2F]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#E36B73] bg-[#E36B73]/10 px-2 py-0.5 rounded border border-[#E36B73]/20">
                              {report.reason}
                            </span>
                            <span className="text-xs text-[#777780]">
                              Reported {formatRelativeTime(report.created_at)}
                            </span>
                          </div>
                          {post && (
                            <span className="text-xs font-mono text-[#F07845]">
                              {post.post_number_formatted}
                            </span>
                          )}
                        </div>

                        {/* Post Preview */}
                        {post ? (
                          <div className="bg-[#1C1C20] border border-[#2A2A2F] rounded-lg p-3.5 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs text-[#777780]">
                              <span>Identity: {post.is_anonymous ? 'Anonymous Student' : post.author_name}</span>
                              <span>Category: {post.category}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-[#F0F0F2]">{post.title}</h3>
                            <p className="text-xs text-[#A0A0A8] leading-relaxed whitespace-pre-line">{post.content}</p>
                          </div>
                        ) : (
                          <div className="text-xs text-[#777780] italic">Post was already removed or expired.</div>
                        )}

                        {/* Authorized Identity Lookup */}
                        {post && (
                          <div className="p-3 bg-[#1C1C20]/70 border border-[#2A2A2F] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-[#777780]">
                              <IconLock size={14} className="text-[#F07845]" />
                              <span>Author Record: {revealed ? revealed.registered_email : 'Confidential (Protected by RLS)'}</span>
                            </div>
                            {!revealed ? (
                              <button
                                type="button"
                                onClick={() => handleLookupAuthor(post.id)}
                                className="text-[11px] font-medium text-[#F07845] hover:underline cursor-pointer"
                              >
                                Authorized Audit Lookup
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#76B99A] font-medium">Logged in Audit Trail</span>
                            )}
                          </div>
                        )}

                        {/* Moderator Notes Input */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#A0A0A8]">Moderator Notes:</label>
                          <input
                            type="text"
                            placeholder="Reason for decision, policy section, or internal comment..."
                            value={moderatorNotes[report.id] || ''}
                            onChange={(e) => setModeratorNotes({ ...moderatorNotes, [report.id]: e.target.value })}
                            className="bg-[#1C1C20] border border-[#2A2A2F] rounded-lg px-3 py-2 text-xs text-[#F0F0F2] outline-none focus:border-[#F07845]"
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2F] gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAction(report.id, 'approve')}
                              className="px-3.5 py-1.5 bg-[#1C1C20] hover:bg-[#2A2A2F] text-[#76B99A] border border-[#2A2A2F] text-xs font-medium rounded-lg transition-smooth cursor-pointer"
                            >
                              Dismiss Report (Approve Post)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAction(report.id, 'escalate')}
                              className="px-3.5 py-1.5 bg-[#1C1C20] hover:bg-[#2A2A2F] text-[#F07845] border border-[#2A2A2F] text-xs font-medium rounded-lg transition-smooth cursor-pointer"
                            >
                              Escalate to Dean Office
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAction(report.id, 'remove')}
                            className="px-4 py-1.5 bg-[#E36B73] hover:bg-[#c95b63] text-white text-xs font-semibold rounded-lg transition-smooth cursor-pointer"
                          >
                            Remove Post
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab: Audit Log */}
            {activeTab === 'audit' && (
              <div className="flex flex-col gap-2.5">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center bg-[#151518] border border-[#2A2A2F] rounded-xl text-xs text-[#777780]">
                    No audit records registered yet.
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-[#151518] border border-[#2A2A2F] rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#F0F0F2]">{log.action}</span>
                          <span className="text-[#777780] font-mono">by {log.performed_by}</span>
                        </div>
                        <span className="text-[#A0A0A8]">{log.details}</span>
                      </div>
                      <span className="text-[11px] text-[#777780] shrink-0">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Disciplinary Policy */}
            {activeTab === 'guidelines' && (
              <div className="p-5 bg-[#151518] border border-[#2A2A2F] rounded-xl flex flex-col gap-4 text-xs leading-relaxed text-[#A0A0A8]">
                <h3 className="text-sm font-semibold text-[#F0F0F2]">College Disciplinary Framework</h3>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[#F0F0F2]">1. Minor Violation (Profanity bypass, off-topic spam):</p>
                  <p>Issue formal written warning to the account. Content is masked or unlisted.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[#F0F0F2]">2. Repeated Infractions (3 Confirmed Warnings):</p>
                  <p>Account placed on 14-day posting suspension. Read-only permissions maintained.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-[#F0F0F2]">3. Severe Infractions (5 Warnings or Direct Threats/Doxxing):</p>
                  <p>Three-month suspension and referral to university student conduct committee.</p>
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
