import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { DeterministicAvatar, IconCheck, IconLock, IconAdmin, IconMaybeMe } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchUserMarkedMaybeMe } from '../services/db';

const PROFILE_TABS = [
  { id: 'posts', label: 'My Confessions' },
  { id: 'replies', label: 'Replies' },
  { id: 'settings', label: 'Account Settings' },
];

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const { user, updateUser, toggleAdminRole, isAdmin } = useAuth();
  const { addToast } = useToast();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'replies' ? 'replies' : tabParam === 'settings' ? 'settings' : 'posts';

  const [activeTab, setActiveTab] = useState(initialTab);

  const [markedConfessions, setMarkedConfessions] = useState([]);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('••••••••••••');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [replyNotifs, setReplyNotifs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    async function loadMarked() {
      const items = await fetchUserMarkedMaybeMe();
      setMarkedConfessions(items);
    }
    loadMarked();
  }, [activeTab]);


  // Authenticated user's activity
  const myPosts = [
    {
      id: 'my-1',
      post_number_formatted: '#01',
      title: 'I accidentally submitted my rough draft with notes for my professor',
      category: 'Confessions',
      is_anonymous: true,
      likes: 42,
      replies: 8,
      date: '45m ago'
    },
    {
      id: 'my-2',
      post_number_formatted: '#02',
      title: 'Quiet study spaces on campus that are not the third floor library',
      category: 'College Life',
      is_anonymous: false,
      likes: 29,
      replies: 4,
      date: '3h ago'
    }
  ];

  const myReplies = [
    {
      id: 'rep-1',
      post_title: 'Organic Chemistry midterm average was 41 percent in Lecture Hall B',
      content: 'I got a 38 and honestly felt like a genius compared to the section average.',
      is_anonymous: true,
      date: '12h ago'
    }
  ];

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateUser({ name: name.trim(), email: email.trim() });
    setTimeout(() => {
      setIsSaving(false);
      addToast('account settings saved', 'success');
    }, 200);
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <Sidebar 
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-0 sm:px-6 py-0 sm:py-6">
          <div className="w-full max-w-[640px] flex flex-col border-x border-[#232323] min-h-screen text-left">
            {/* Header User Row */}
            <div className="p-4 border-b border-[#232323] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <DeterministicAvatar isAnonymous={false} name={user.name} size={40} />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[17px] font-semibold text-[#EDEDED]">{user.name}</h1>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#10B981] bg-[#161616] border border-[#232323] px-1.5 py-0.2 rounded">
                      <IconCheck size={10} />
                      <span>verified student</span>
                    </span>
                  </div>
                  <span className="text-[12px] font-mono text-[#6B6B6B]">{user.email}</span>
                </div>
              </div>

              {/* Role Switcher */}
              <button
                type="button"
                onClick={toggleAdminRole}
                className={`px-2.5 py-1 rounded-[6px] border text-[11px] font-mono transition-fast cursor-pointer flex items-center gap-1.5 ${
                  isAdmin
                    ? 'border-[#FF5A1F]/40 text-[#FF5A1F] bg-[#161616]'
                    : 'border-[#232323] text-[#A1A1A1] hover:text-[#EDEDED]'
                }`}
              >
                <IconAdmin size={13} />
                <span>role: {isAdmin ? 'Moderator' : 'Student'}</span>
                <span className="text-[10px] text-[#6B6B6B]">(toggle)</span>
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="px-4 flex items-center gap-6 border-b border-[#232323] overflow-x-auto scrollbar-none select-none">
              {PROFILE_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-3 text-[13px] transition-fast cursor-pointer shrink-0 ${
                      isActive
                        ? 'text-[#EDEDED] font-semibold'
                        : 'text-[#6B6B6B] hover:text-[#EDEDED]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#EDEDED]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content per Tab */}
            {activeTab === 'posts' && (
              <div className="flex flex-col divide-y divide-[#232323]">
                <div className="p-3 text-[12px] font-mono text-[#6B6B6B] bg-[#111111]">
                  your campus posts. anonymous submissions are private and only visible in your personal view.
                </div>
                {myPosts.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col gap-1 hover:bg-[#111111] transition-fast">
                    <div className="flex items-center gap-2 text-[12px] font-mono text-[#6B6B6B]">
                      <span className="text-[#EDEDED]">{p.post_number_formatted}</span>
                      <span>&middot;</span>
                      <span>{p.category}</span>
                      <span>&middot;</span>
                      <span>{p.date}</span>
                      {p.is_anonymous && (
                        <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-mono text-[#FF5A1F] bg-[#161616] px-1.5 py-0.2 rounded border border-[#232323]">
                          <IconLock size={10} />
                          <span>private anonymous</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#EDEDED]">{p.title}</h3>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#6B6B6B]">
                      <span>{p.likes} upvotes</span>
                      <span>&middot;</span>
                      <span>{p.replies} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'replies' && (
              <div className="flex flex-col divide-y divide-[#232323]">
                {myReplies.map((r) => (
                  <div key={r.id} className="p-4 flex flex-col gap-1 hover:bg-[#111111] transition-fast">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B6B]">
                      <span>Replying to: <strong className="text-[#EDEDED]">{r.post_title}</strong></span>
                      <span>{r.date}</span>
                    </div>
                    <p className="text-[13.5px] text-[#A1A1A1] italic">"{r.content}"</p>
                    {r.is_anonymous && (
                      <span className="text-[10.5px] font-mono text-[#FF5A1F] flex items-center gap-1">
                        <IconLock size={10} />
                        <span>replied anonymously</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}


            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-[#6B6B6B] uppercase">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111111] border border-[#232323] focus:border-[#333333] rounded-[6px] px-3 py-2 text-[13.5px] text-[#EDEDED] outline-none"
                  />
                  <span className="text-[11px] text-[#6B6B6B]">
                    Only visible when posting with public identity toggled on.
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-[#6B6B6B] uppercase">College Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111111] border border-[#232323] focus:border-[#333333] rounded-[6px] px-3 py-2 text-[13.5px] text-[#EDEDED] outline-none font-mono"
                  />
                  <span className="text-[11px] text-[#6B6B6B]">
                    Campus verification address. Never displayed publicly.
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-[#6B6B6B] uppercase">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111111] border border-[#232323] focus:border-[#333333] rounded-[6px] px-3 py-2 text-[13.5px] text-[#EDEDED] outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-[#232323]">
                  <span className="font-mono text-[11px] text-[#6B6B6B] uppercase">Preferences</span>
                  <label className="flex items-center justify-between text-[13px] text-[#A1A1A1] cursor-pointer">
                    <span>Email notification on post replies</span>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="accent-[#FF5A1F] w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between text-[13px] text-[#A1A1A1] cursor-pointer">
                    <span>In-app activity badges</span>
                    <input
                      type="checkbox"
                      checked={replyNotifs}
                      onChange={(e) => setReplyNotifs(e.target.checked)}
                      className="accent-[#FF5A1F] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#232323]">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-[36px] px-4 bg-[#FF5A1F] hover:bg-[#ff6e38] text-[#0A0A0A] font-semibold text-[13px] rounded-[6px] transition-fast cursor-pointer"
                  >
                    {isSaving ? 'saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onOpenCreate={() => setIsCreateOpen(true)} />
    </div>
  );
}
