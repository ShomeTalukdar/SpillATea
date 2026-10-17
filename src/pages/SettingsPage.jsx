import React, { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import TrendingSidebar from '../components/posts/TrendingSidebar';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommandPalette from '../components/modals/CommandPalette';
import { IconSettings, IconMoon, IconSun } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

/**
 * SettingsPage — SpillATea Application & Account Settings
 * 
 * - Profile and verified student credentials
 * - Anonymity & privacy defaults
 * - Role toggle (Student / Campus Moderator)
 * - Local storage cache preferences
 */
export default function SettingsPage() {
  const { user, updateUser, isAdmin, toggleAdminRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [name, setName] = useState(user.name || 'Jordan Brooks');
  const [email, setEmail] = useState(user.email || 'student@college.edu');
  const [defaultAnonymous, setDefaultAnonymous] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateUser({ name: name.trim(), email: email.trim() });
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings successfully updated', 'success');
    }, 250);
  };

  const handleClearReadHistory = () => {
    try {
      localStorage.removeItem('spillatea_read_confessions_v1');
      addToast('Reading history reset', 'success');
    } catch (e) {}
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <Sidebar 
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-16">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-[560px] flex flex-col">
            
            {/* Header */}
            <header className="mb-8 pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 rounded-[6px] bg-[#161616] border border-[#262626] text-[#EDEDED]">
                  <IconSettings size={18} />
                </span>
                <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#EDEDED] tracking-[-0.03em] leading-tight">
                  Settings
                </h1>
              </div>
              <div className="font-mono text-[12px] text-[#6B6B6B]">
                Manage your student identity, privacy preferences, and app configurations
              </div>
            </header>

            <div className="flex flex-col gap-8">
              
              {/* SECTION 1: Student Identity & Credentials */}
              <section className="bg-[#111111] border border-[#262626] rounded-[12px] p-6">
                <h2 className="text-[16px] font-semibold text-[#EDEDED] mb-1">
                  Student Account
                </h2>
                <p className="text-[12px] text-[#A1A1A1] font-mono mb-5">
                  Your campus identity is never exposed when posting anonymously.
                </p>

                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#161616] border border-[#262626] focus:border-[#FF5A1F] rounded-[6px] px-3.5 py-2 text-[13.5px] text-[#EDEDED] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B6B] mb-1.5">
                      College Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#161616] border border-[#262626] focus:border-[#FF5A1F] rounded-[6px] px-3.5 py-2 text-[13.5px] text-[#EDEDED] outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 rounded-[6px] bg-[#EDEDED] hover:bg-white text-[#0A0A0A] font-semibold text-[13px] transition-colors cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </section>

              {/* SECTION 2: Appearance & Theme Mode */}
              <section className="bg-[#111111] border border-[#262626] rounded-[12px] p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[16px] font-semibold text-[#EDEDED]">
                    Appearance
                  </h2>
                  <span className="font-mono text-[11px] text-[#A1A1A1] bg-[#161616] border border-[#262626] px-2 py-0.5 rounded-[4px]">
                    {theme === 'dark' ? 'Dark Mode (Default)' : 'Light Mode'}
                  </span>
                </div>
                <p className="text-[12px] text-[#A1A1A1] font-mono mb-5">
                  Select your interface theme. Dark mode is enabled by default to preserve the late-night college notebook feel.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dark Mode Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      addToast('Theme set to Dark Mode', 'success');
                    }}
                    className={`p-4 rounded-[8px] border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#161616] border-[#FF5A1F] ring-1 ring-[#FF5A1F]/30'
                        : 'bg-[#111111] border-[#262626] hover:border-[#383838]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <IconMoon size={16} className={theme === 'dark' ? 'text-[#FF5A1F]' : 'text-[#6B6B6B]'} />
                        <span className="text-[13.5px] font-medium text-[#EDEDED]">Dark</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#FF5A1F] px-1.5 py-0.5 rounded bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                        Default
                      </span>
                    </div>
                    <p className="text-[11.5px] font-mono text-[#6B6B6B] leading-relaxed">
                      Deep charcoal & black notebook aesthetic for late-night campus browsing.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        theme === 'dark' ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-[#333333]'
                      }`}>
                        {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />}
                      </div>
                      <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-[#EDEDED]' : 'text-[#6B6B6B]'}`}>
                        {theme === 'dark' ? 'Active' : 'Switch to Dark'}
                      </span>
                    </div>
                  </button>

                  {/* Light Mode Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      addToast('Theme set to Light Mode', 'success');
                    }}
                    className={`p-4 rounded-[8px] border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#161616] border-[#FF5A1F] ring-1 ring-[#FF5A1F]/30'
                        : 'bg-[#111111] border-[#262626] hover:border-[#383838]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <IconSun size={16} className={theme === 'light' ? 'text-[#FF5A1F]' : 'text-[#6B6B6B]'} />
                        <span className="text-[13.5px] font-medium text-[#EDEDED]">Light</span>
                      </div>
                    </div>
                    <p className="text-[11.5px] font-mono text-[#6B6B6B] leading-relaxed">
                      Clean editorial newspaper style with crisp off-white paper and dark ink typography.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        theme === 'light' ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-[#333333]'
                      }`}>
                        {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />}
                      </div>
                      <span className={`text-[11px] font-mono ${theme === 'light' ? 'text-[#EDEDED]' : 'text-[#6B6B6B]'}`}>
                        {theme === 'light' ? 'Active' : 'Switch to Light'}
                      </span>
                    </div>
                  </button>
                </div>
              </section>

              {/* SECTION 3: Anonymity & Privacy Defaults */}
              <section className="bg-[#111111] border border-[#262626] rounded-[12px] p-6">
                <h2 className="text-[16px] font-semibold text-[#EDEDED] mb-1">
                  Anonymity & Privacy
                </h2>
                <p className="text-[12px] text-[#A1A1A1] font-mono mb-5">
                  Protected anonymous layer guarantees author identity is securely shielded.
                </p>

                <div className="flex flex-col gap-4 divide-y divide-[#262626]/50">
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col pr-4">
                      <span className="text-[13.5px] font-medium text-[#EDEDED]">
                        Always Default to Anonymous
                      </span>
                      <span className="text-[12px] text-[#6B6B6B]">
                        Hide name and avatar by default on new confessions and comments
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDefaultAnonymous(!defaultAnonymous)}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        defaultAnonymous ? 'bg-[#FF5A1F]' : 'bg-[#262626]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        defaultAnonymous ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Role & Moderation Toggle */}
              <section className="bg-[#111111] border border-[#262626] rounded-[12px] p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[16px] font-semibold text-[#EDEDED]">
                    Campus Access Role
                  </h2>
                  <span className={`px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-semibold uppercase ${
                    isAdmin 
                      ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40' 
                      : 'bg-[#161616] text-[#A1A1A1] border border-[#262626]'
                  }`}>
                    {isAdmin ? 'Campus Moderator' : 'Student'}
                  </span>
                </div>
                <p className="text-[12px] text-[#6B6B6B] leading-relaxed mb-4">
                  Campus moderators can oversee content, handle reports, and review authentic author metadata in accordance with campus safety policies.
                </p>

                <button
                  type="button"
                  onClick={toggleAdminRole}
                  className="w-full py-2.5 rounded-[6px] border border-[#262626] hover:border-[#3A3A3A] bg-[#161616] hover:bg-[#1a1a1a] text-[13px] font-mono text-[#EDEDED] transition-colors cursor-pointer"
                >
                  {isAdmin ? 'Switch to Standard Student View' : 'Switch to Campus Moderator View'}
                </button>
              </section>

              {/* SECTION 4: Storage & Local Cache */}
              <section className="bg-[#111111] border border-[#262626] rounded-[12px] p-6">
                <h2 className="text-[16px] font-semibold text-[#EDEDED] mb-1">
                  Local Data
                </h2>
                <p className="text-[12px] text-[#6B6B6B] mb-4">
                  Reset local read progress bar or manage stored preferences on this device.
                </p>

                <button
                  type="button"
                  onClick={handleClearReadHistory}
                  className="px-3.5 py-2 rounded-[6px] border border-[#262626] hover:border-[#EF4444]/50 text-[#A1A1A1] hover:text-[#EF4444] text-[12px] font-mono transition-colors cursor-pointer"
                >
                  Reset Read Progress History
                </button>
              </section>

            </div>

          </div>
        </main>
      </div>

      <TrendingSidebar />

      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
}
