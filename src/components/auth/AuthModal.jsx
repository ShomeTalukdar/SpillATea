import React, { useState } from 'react';
import { useAuth, LOCAL_DEV_CREDENTIALS, isLocalhostEnvironment } from '../../context/AuthContext';
import { IconClose } from '../icons/Icons';
import { isCollegeEmail, extractCollegeName } from '../../utils/collegeEmailValidator';

export default function AuthModal({ isOpen, onClose, reason = '' }) {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    signupWithEmail, 
    isFirebaseConfigured
  } = useAuth();

  // Primary tabs: 'google' | 'email'
  const [activeTab, setActiveTab] = useState('google');
  // Email mode: 'login' | 'register'
  const [emailMode, setEmailMode] = useState('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Real-time email validation status
  const trimmedEmail = email.trim().toLowerCase();
  const hasEmailEntered = trimmedEmail.length > 3 && trimmedEmail.includes('@');
  const isValidCampusDomain = hasEmailEntered && isCollegeEmail(trimmedEmail);
  const detectedCollege = isValidCampusDomain ? extractCollegeName(trimmedEmail) : null;
  const isPersonalDomain = hasEmailEntered && (
    trimmedEmail.endsWith('@gmail.com') ||
    trimmedEmail.endsWith('@yahoo.com') ||
    trimmedEmail.endsWith('@outlook.com') ||
    trimmedEmail.endsWith('@hotmail.com') ||
    trimmedEmail.endsWith('@icloud.com')
  );

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Google Sign-in failed.');
    }
  };

  // Handle Email Sign In or Registration
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!trimmedEmail) {
      setError('Please enter your college email address.');
      return;
    }

    if (!isCollegeEmail(trimmedEmail)) {
      setError('Access Restricted: Only institutional student emails (e.g. 1243@kiit.ac.in, .ac.in, or .edu) are permitted.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (emailMode === 'register') {
      if (!confirmPassword) {
        setError('Please confirm your password.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify both password fields.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setLoading(true);
      const res = await signupWithEmail(trimmedEmail, password, confirmPassword, displayName);
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Account created successfully! Welcome to SpillATea.');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Failed to create student account.');
      }
    } else {
      // Login mode
      setLoading(true);
      const res = await loginWithEmail(trimmedEmail, password);
      setLoading(false);

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Invalid credentials. If you are new, click "Create Account" below.');
      }
    }
  };

  const switchMode = (mode) => {
    setEmailMode(mode);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-2xl border p-6 flex flex-col relative text-left shadow-2xl transition-all"
        style={{ 
          backgroundColor: '#0D0D10', 
          borderColor: 'rgba(255, 255, 255, 0.08)' 
        }}
      >
        {/* Editorial Sub-header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F06A3A] animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#F06A3A] font-semibold">
              CAMPUS VERIFIED ACCESS
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors"
            title="Close"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="mt-3">
          <h3 className="text-[19px] font-bold tracking-tight text-white font-sans">
            SpillATea Campus
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            Exclusive to university students. Log in or create an account with your college email (<span className="text-white font-mono">1243@kiit.ac.in</span>, <span className="text-white font-mono">.ac.in</span>, or <span className="text-white font-mono">.edu</span>).
          </p>
        </div>

        {/* Feature Reason Banner */}
        {reason && (
          <div className="mt-3 p-3 rounded-xl border border-[#F06A3A]/30 bg-[#F06A3A]/10 text-[#F06A3A] text-[12.5px] flex items-center gap-2.5">
            <span className="text-base shrink-0">🔒</span>
            <span className="font-medium text-white/95 leading-snug">{reason}</span>
          </div>
        )}

        {/* Firebase Config Notice */}
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-lg bg-[#F06A3A]/10 border border-[#F06A3A]/30 text-[12px] text-[#F06A3A]">
            Firebase credentials not detected in <code>.env</code>.
          </div>
        )}

        {/* Auth Method Navigation Tabs */}
        <div className="flex border-b border-white/[0.08] mt-4 mb-3 gap-6 text-[13px]">
          <button
            type="button"
            onClick={() => { setActiveTab('google'); setError(''); setSuccessMsg(''); }}
            className={`pb-2.5 font-medium transition-all border-b-2 -mb-[1px] flex items-center gap-2 ${
              activeTab === 'google' 
                ? 'border-[#F06A3A] text-white' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <span>Google Campus</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('email'); setError(''); setSuccessMsg(''); }}
            className={`pb-2.5 font-medium transition-all border-b-2 -mb-[1px] flex items-center gap-2 ${
              activeTab === 'email' 
                ? 'border-[#F06A3A] text-white' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <span>Email & Password</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-400 leading-normal">
            {error}
          </div>
        )}

        {/* Success notification */}
        {successMsg && (
          <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[12px] text-emerald-400 leading-normal flex items-center gap-2">
            <span className="font-mono text-sm">✓</span>
            {successMsg}
          </div>
        )}

        {/* TAB 1: GOOGLE STUDENT SIGN IN */}
        {activeTab === 'google' && (
          <div className="py-2 flex flex-col gap-4 text-center">
            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#111114] text-left">
              <div className="flex items-start gap-2.5">
                <span className="text-[#F06A3A] text-sm mt-0.5">ℹ</span>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  Select your university Google account (e.g. <span className="text-white font-mono">@kiit.ac.in</span>). Standard personal <span className="font-mono text-neutral-400">@gmail.com</span> addresses are strictly restricted.
                </p>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading || !isFirebaseConfigured}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-[14px] bg-white text-black hover:bg-neutral-100 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'Verifying Student Account...' : 'Continue with Google College Email'}</span>
            </button>

            <div className="text-[11px] text-[var(--text-tertiary)] pt-1">
              Your real email and name remain completely anonymous on public posts.
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL & PASSWORD (LOGIN / CREATE ACCOUNT) */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 py-1">
            {/* Mode Indicator & Switcher */}
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[13px] font-semibold text-white">
                {emailMode === 'login' ? 'Sign In to Account' : 'Create Student Account'}
              </span>
              <button
                type="button"
                onClick={() => switchMode(emailMode === 'login' ? 'register' : 'login')}
                className="text-[12px] text-[#F06A3A] hover:underline cursor-pointer"
              >
                {emailMode === 'login' ? 'Create new account →' : 'Switch to Sign In →'}
              </button>
            </div>

            {/* College Email Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Student College Email
                </label>
                {isValidCampusDomain && detectedCollege && (
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    ✓ {detectedCollege}
                  </span>
                )}
                {isPersonalDomain && (
                  <span className="text-[11px] text-amber-400 font-sans">
                    ⚠️ College email required
                  </span>
                )}
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 1243@kiit.ac.in"
                className="w-full bg-[#111114] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#F06A3A] transition-colors"
              />
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                Must end with <code className="text-neutral-300">@kiit.ac.in</code>, <code className="text-neutral-300">.ac.in</code>, or <code className="text-neutral-300">.edu</code>
              </p>
            </div>

            {/* In Register mode: optional Display Name */}
            {emailMode === 'register' && (
              <div>
                <label className="text-[12px] font-medium text-[var(--text-secondary)] mb-1 block">
                  Campus Alias / Name <span className="text-neutral-500">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Campus Explorer"
                  className="w-full bg-[#111114] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#F06A3A] transition-colors"
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="text-[12px] font-medium text-[var(--text-secondary)] mb-1 block">
                Password {emailMode === 'register' && <span className="text-neutral-500">(min 6 chars)</span>}
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111114] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#F06A3A] transition-colors"
              />
            </div>

            {/* Confirm Password Input (Only in Register mode) */}
            {emailMode === 'register' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[12px] font-medium text-[var(--text-secondary)]">
                    Confirm Password
                  </label>
                  {confirmPassword && (
                    <span className={`text-[11px] font-sans ${password === confirmPassword ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {password === confirmPassword ? '✓ Passwords match' : '⚠️ Passwords do not match'}
                    </span>
                  )}
                </div>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                  className={`w-full bg-[#111114] border rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-amber-500/50 focus:border-amber-500' 
                      : 'border-white/[0.08] focus:border-[#F06A3A]'
                  }`}
                />
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading || !isFirebaseConfigured}
              className="mt-2 w-full py-3 rounded-xl bg-[#F06A3A] text-white font-medium text-[13px] hover:bg-[#F06A3A]/90 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-[#F06A3A]/10"
            >
              {loading 
                ? (emailMode === 'register' ? 'Registering Account...' : 'Authenticating...') 
                : (emailMode === 'register' ? 'Create Student Account' : 'Sign In with College Email')}
            </button>

            {/* Switch Mode Prompt */}
            <div className="text-center pt-2 border-t border-white/[0.06] mt-2">
              {emailMode === 'login' ? (
                <p className="text-[12px] text-[var(--text-secondary)]">
                  Not registered yet on SpillATea?{' '}
                  <button 
                    type="button" 
                    onClick={() => switchMode('register')}
                    className="text-white hover:text-[#F06A3A] font-medium underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-[12px] text-[var(--text-secondary)]">
                  Already registered your student email?{' '}
                  <button 
                    type="button" 
                    onClick={() => switchMode('login')}
                    className="text-white hover:text-[#F06A3A] font-medium underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

            {/* Localhost-Only Test Accounts Helper */}
            {isLocalhostEnvironment() && (
              <div className="mt-3 p-3 rounded-xl border border-dashed border-[#F06A3A]/30 bg-[#F06A3A]/5 flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#F06A3A] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F06A3A]"></span>
                    LOCAL DEV TEST ACCOUNTS
                  </span>
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                    Localhost only
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(LOCAL_DEV_CREDENTIALS.user.email);
                      setPassword(LOCAL_DEV_CREDENTIALS.user.password);
                      setEmailMode('login');
                      setError('');
                    }}
                    className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#F06A3A]/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-white font-medium group-hover:text-[#F06A3A] transition-colors">
                      Student
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {LOCAL_DEV_CREDENTIALS.user.email}
                    </div>
                    <div className="text-[9.5px] text-neutral-500 font-sans mt-0.5">
                      pass: {LOCAL_DEV_CREDENTIALS.user.password}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail(LOCAL_DEV_CREDENTIALS.admin.email);
                      setPassword(LOCAL_DEV_CREDENTIALS.admin.password);
                      setEmailMode('login');
                      setError('');
                    }}
                    className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#F06A3A]/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-white font-medium group-hover:text-[#F06A3A] transition-colors">
                      Admin / Mod
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {LOCAL_DEV_CREDENTIALS.admin.email}
                    </div>
                    <div className="text-[9.5px] text-neutral-500 font-sans mt-0.5">
                      pass: {LOCAL_DEV_CREDENTIALS.admin.password}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
