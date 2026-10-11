import React, { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import { PublicAvatar, IconCheck, IconLock, IconAdmin, IconAlert } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { user, updateUser, toggleAdminRole, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateUser({ name: name.trim(), email: email.trim() });
    setTimeout(() => {
      setIsSaving(false);
      addToast('Profile updated successfully.', 'success');
    }, 200);
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-xl flex flex-col gap-6 text-left">
            {/* Header */}
            <div className="flex flex-col gap-1 pb-3 border-b border-[#2A2A2F]">
              <h1 className="text-xl font-semibold text-[#F0F0F2] tracking-tight">
                Student Profile & Settings
              </h1>
              <p className="text-xs text-[#777780]">
                Manage your campus identity, privacy settings, and verification status.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="p-5 bg-[#151518] border border-[#2A2A2F] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <PublicAvatar name={user.name} size={48} />
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-[#F0F0F2]">{user.name}</span>
                  <span className="text-xs text-[#777780]">{user.email}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#76B99A] bg-[#76B99A]/10 px-2 py-0.5 rounded border border-[#76B99A]/20">
                      <IconCheck size={12} />
                      Verified College Student
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Role Switcher */}
              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="text-[11px] text-[#777780]">Current Platform Role:</span>
                <button
                  type="button"
                  onClick={toggleAdminRole}
                  className="px-3 py-1.5 bg-[#1C1C20] hover:bg-[#2A2A2F] border border-[#2A2A2F] rounded-lg text-xs font-medium text-[#F0F0F2] transition-smooth cursor-pointer flex items-center gap-1.5"
                >
                  <IconAdmin size={14} className={isAdmin ? 'text-[#F07845]' : 'text-[#777780]'} />
                  <span>{isAdmin ? 'Moderator Admin' : 'Regular Student'}</span>
                  <span className="text-[10px] text-[#F07845] ml-1">(Switch)</span>
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleSave} className="p-5 bg-[#151518] border border-[#2A2A2F] rounded-xl flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-[#F0F0F2]">Account Details</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A0A0A8]">
                  Public Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1C1C20] border border-[#2A2A2F] rounded-lg px-3.5 py-2.5 text-xs text-[#F0F0F2] focus:border-[#F07845] outline-none transition-smooth"
                />
                <span className="text-[11px] text-[#777780]">
                  Shown only when you toggle off Anonymous Mode when publishing a post or comment.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A0A0A8]">
                  College Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1C1C20] border border-[#2A2A2F] rounded-lg px-3.5 py-2.5 text-xs text-[#F0F0F2] focus:border-[#F07845] outline-none transition-smooth"
                />
                <span className="text-[11px] text-[#777780]">
                  Used for campus domain verification. Never displayed publicly on any post.
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#F07845] hover:bg-[#e06b3a] text-[#0D0D0F] font-semibold text-xs rounded-lg transition-smooth cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

            {/* Privacy & Anonymity Disclosure */}
            <div className="p-4 bg-[#1C1C20] border border-[#2A2A2F] rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F0F0F2]">
                <IconLock size={15} className="text-[#F07845]" />
                <span>Anonymity Architecture Guarantee</span>
              </div>
              <p className="text-xs text-[#A0A0A8] leading-relaxed">
                CampusEcho guarantees that your student identity and account details are not returned by the API when posts are marked anonymous. An internal private link is held exclusively for campus safety review in accordance with our student code of conduct.
              </p>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
