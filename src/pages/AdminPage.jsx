import React, { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { 
  IconLock, 
  IconEye, 
  IconClose
} from '../components/icons/Icons';
import { 
  fetchAdminReportQueue, 
  adminTakeAction, 
  fetchAdminAuditLogs
} from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ModeratorRevealModal from '../components/modals/ModeratorRevealModal';

const MOD_TABS = [
  { id: 'reports', label: 'Reports' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'warnings', label: 'Warnings' },
  { id: 'suspensions', label: 'Suspensions' },
  { id: 'audit', label: 'Recent Actions' },
];

export default function AdminPage() {
  const { user, isAdmin, toggleAdminRole } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [warnings, setWarnings] = useState([
    { id: 'warn-1', post_number_formatted: '#04', student: 'Student (ID: user-anon-3)', reason: 'hostility in dining comments', issued_by: 'Jordan Brooks', date: 'Yesterday' }
  ]);
  const [suspensions, setSuspensions] = useState([
    { id: 'susp-1', student: 'Student (ID: user-901)', reason: 'severe harassment & academic code violation', duration: '7 days', status: 'Active', issued_by: 'Campus Safety', date: '2 days ago' }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Modal states for sensitive actions
  const [selectedPostForReveal, setSelectedPostForReveal] = useState(null);
  const [confirmDestructive, setConfirmDestructive] = useState(null);

  useEffect(() => {
    async function loadAdminData() {
      if (!isAdmin) return;
      setIsLoading(true);
      try {
        const queue = await fetchAdminReportQueue();
        const logs = await fetchAdminAuditLogs();
        setReports(queue || []);
        setAuditLogs(logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  const handleAction = async (reportId, action, notes = '') => {
    try {
      const res = await adminTakeAction({
        reportId,
        action,
        moderatorNotes: notes || `Moderator performed ${action}`
      });

      if (res && res.success) {
        addToast(`action: ${action}`, 'success');
        const queue = await fetchAdminReportQueue();
        const logs = await fetchAdminAuditLogs();
        setReports(queue || []);
        setAuditLogs(logs || []);
      }
    } catch (e) {
      addToast('error performing moderation action', 'error');
    } finally {
      setConfirmDestructive(null);
    }
  };

  const handleIssueWarning = (report) => {
    const newWarn = {
      id: `warn-${Date.now()}`,
      post_number_formatted: report.post?.post_number_formatted || '#01',
      student: `Author of ${report.post?.post_number_formatted || '#01'}`,
      reason: report.reason || 'community standard violation',
      issued_by: user.name || 'Jordan Brooks',
      date: 'Just now'
    };
    setWarnings(prev => [newWarn, ...prev]);
    handleAction(report.id, 'warn', `Warning issued: ${report.reason}`);
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
        <Sidebar onOpenCreateModal={() => setIsCreateOpen(true)} onOpenCommandPalette={() => setIsCommandOpen(true)} />
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
          <MobileHeader />
          <main className="flex-1 flex justify-center items-center px-4">
            <div className="max-w-md w-full bg-[#111111] border border-[#232323] rounded-[8px] p-6 text-center flex flex-col items-center gap-3">
              <IconLock size={20} className="text-[#FF5A1F]" />
              <h1 className="text-[16px] font-semibold text-[#EDEDED]">Moderator Access Restricted</h1>
              <p className="text-[13px] text-[#A1A1A1] leading-relaxed">
                You are currently signed in as a student. To review reports, audit privileged reveals, and manage community safety, toggle your role to Moderator.
              </p>
              <button
                type="button"
                onClick={toggleAdminRole}
                className="h-[36px] px-4 bg-[#FF5A1F] hover:bg-[#ff6e38] text-[#0A0A0A] font-semibold text-[13px] rounded-[6px] transition-fast cursor-pointer mt-1"
              >
                Switch to Moderator
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'Pending Review');
  const activeReports = activeTab === 'pending' ? pendingReports : reports;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <Sidebar onOpenCreateModal={() => setIsCreateOpen(true)} onOpenCommandPalette={() => setIsCommandOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-0 sm:px-6 py-0 sm:py-6">
          <div className="w-full max-w-[640px] flex flex-col border-x border-[#232323] min-h-screen text-left">
            {/* Header */}
            <div className="p-4 border-b border-[#232323] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#FF5A1F]">
                  MODERATION CONSOLE
                </span>
                <span className="font-mono text-[11px] text-[#6B6B6B]">
                  moderator: <strong className="text-[#EDEDED]">{user.name}</strong>
                </span>
              </div>
              <h1 className="text-[28px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                Moderation
              </h1>
              <p className="text-[13px] text-[#A1A1A1]">
                campus safety, report resolution, and privileged student identity audit logs.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 flex items-center gap-5 border-b border-[#232323] overflow-x-auto scrollbar-none select-none">
              {MOD_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-3 text-[13px] transition-fast cursor-pointer shrink-0 ${
                      isActive
                        ? 'text-[#EDEDED] font-semibold'
                        : 'text-[#6B6B6B] hover:text-[#EDEDED]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === 'reports' && reports.length > 0 && (
                      <span className="ml-1.5 font-mono text-[10px] tabular-nums px-1.5 py-0.2 rounded bg-[#161616] border border-[#232323] text-[#FF5A1F]">
                        {reports.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#EDEDED]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content List */}
            {(activeTab === 'reports' || activeTab === 'pending') && (
              <div className="flex flex-col divide-y divide-[#232323]">
                {activeReports.length === 0 ? (
                  <div className="py-20 text-center text-[13px] text-[#6B6B6B]">
                    queue clear. no discussions currently flagged.
                  </div>
                ) : (
                  activeReports.map((report) => (
                    <div key={report.id} className="p-4 flex flex-col gap-2.5 bg-[#0A0A0A] hover:bg-[#111111] transition-fast">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#FF5A1F] font-semibold">
                          Post {report.post?.post_number_formatted || '#01'}
                        </span>
                        <span className="text-[#6B6B6B]">
                          reports: {report.reports_count || 1} &middot; status: {report.status || 'pending'}
                        </span>
                      </div>

                      <div className="text-[13px] text-[#A1A1A1] bg-[#111111] border border-[#232323] p-2.5 rounded-[6px]">
                        <div><strong className="text-[#EDEDED]">Reason:</strong> {report.reason}</div>
                        {report.post && (
                          <div className="text-[#6B6B6B] italic mt-1 line-clamp-2">"{report.post.title}"</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAction(report.id, 'approve')}
                            className="px-2.5 py-1 rounded-[4px] bg-[#161616] border border-[#232323] text-[12px] text-[#EDEDED] hover:bg-[#232323] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDestructive({ type: 'remove', reportId: report.id, postNumber: report.post?.post_number_formatted || '#01' })}
                            className="px-2.5 py-1 rounded-[4px] bg-[#161616] border border-[#EF4444]/40 text-[12px] text-[#EF4444] hover:bg-[#EF4444]/15 cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIssueWarning(report)}
                            className="px-2.5 py-1 rounded-[4px] bg-[#161616] border border-[#232323] text-[12px] text-[#6B6B6B] hover:text-[#EDEDED] cursor-pointer"
                          >
                            Warn
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FF5A1F]">
                          <IconEye size={12} />
                          <span>Author: <strong className="text-[#EDEDED]">{report.post?.real_author_name || 'Sam Alvarez'}</strong> ({report.post?.real_author_email || 's.alvarez@student.college.edu'})</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SECTION: Warnings */}
            {activeTab === 'warnings' && (
              <div className="flex flex-col divide-y divide-[#232323]">
                {warnings.map(w => (
                  <div key={w.id} className="p-4 flex flex-col gap-1 text-[13px]">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#EDEDED] font-semibold">{w.student}</span>
                      <span className="text-[#6B6B6B]">{w.date}</span>
                    </div>
                    <span className="text-[#A1A1A1]">reason: {w.reason}</span>
                    <span className="font-mono text-[10.5px] text-[#6B6B6B]">issued by: {w.issued_by}</span>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION: Suspensions */}
            {activeTab === 'suspensions' && (
              <div className="flex flex-col divide-y divide-[#232323]">
                {suspensions.map(s => (
                  <div key={s.id} className="p-4 flex flex-col gap-1 text-[13px]">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#EDEDED] font-semibold">{s.student}</span>
                      <span className="text-[#EF4444]">{s.duration} suspension</span>
                    </div>
                    <span className="text-[#A1A1A1]">violation: {s.reason}</span>
                    <span className="font-mono text-[10.5px] text-[#6B6B6B]">authorized by: {s.issued_by}</span>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION: Recent Actions (Audit Logs) */}
            {activeTab === 'audit' && (
              <div className="flex flex-col divide-y divide-[#232323]">
                <div className="p-3 text-[12px] font-mono text-[#6B6B6B] bg-[#111111]">
                  immutable append-only audit trail. every unmasking and moderation decision is signed.
                </div>
                {auditLogs.length === 0 ? (
                  <div className="py-12 text-center font-mono text-[12px] text-[#6B6B6B]">
                    no actions recorded in session.
                  </div>
                ) : (
                  auditLogs.map(log => (
                    <div key={log.id} className="p-3.5 flex flex-col gap-1 font-mono text-[12px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#EDEDED]">{log.moderator_name || 'Jordan Brooks'}</span>
                        <span className="text-[#6B6B6B]">{log.timestamp}</span>
                      </div>
                      <div className="text-[#A1A1A1]">
                        action: <strong className="text-[#FF5A1F]">{log.action}</strong> {log.target_post && `on Post ${log.target_post}`}
                      </div>
                      {log.hidden_identity && (
                        <div className="text-[11px] text-[#6B6B6B] pt-0.5">
                          revealed: {log.hidden_identity} ({log.registered_email})
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onOpenCreate={() => setIsCreateOpen(true)} />

      {/* Confirmation Dialog for Destructive Removal */}
      {confirmDestructive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-sm bg-[#111111] border border-[#232323] rounded-[8px] p-4 flex flex-col gap-3 text-left">
            <span className="text-[14px] font-semibold text-[#EDEDED]">Confirm Removal</span>
            <p className="text-[13px] text-[#A1A1A1] leading-relaxed">
              Remove Post {confirmDestructive.postNumber} from campus feed? This action writes an audit event.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#232323]">
              <button
                type="button"
                onClick={() => setConfirmDestructive(null)}
                className="px-3 py-1.5 text-[12px] text-[#A1A1A1] hover:text-[#EDEDED]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction(confirmDestructive.reportId, 'remove')}
                className="px-3 py-1.5 rounded-[6px] text-[12px] font-semibold bg-[#EF4444] text-white hover:bg-[#dc2626] cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPostForReveal && (
        <ModeratorRevealModal
          post={selectedPostForReveal}
          isOpen={Boolean(selectedPostForReveal)}
          onClose={() => setSelectedPostForReveal(null)}
          onRevealed={async () => {
            const logs = await fetchAdminAuditLogs();
            setAuditLogs(logs || []);
          }}
        />
      )}
    </div>
  );
}
