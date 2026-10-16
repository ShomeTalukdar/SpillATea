import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import SearchPage from './pages/SearchPage';
import SavedPage from './pages/SavedPage';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';
import DatePage from './pages/DatePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-[480px] bg-[#111111] border border-[#262626] rounded-[12px] p-8 flex flex-col items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-[#FF5A1F]" />
            <h1 className="text-[20px] font-semibold text-[#EDEDED]">Something went wrong</h1>
            <p className="text-[13px] font-mono text-[#A1A1A1] leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="mt-2 px-4 py-2 bg-[#FF5A1F] hover:bg-[#ff6e38] text-[#0A0A0A] font-semibold text-[13px] rounded-[6px] transition-colors"
            >
              Reload SpillATea
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:postNumber" element={<PostPage />} />
                <Route path="/date/:dateKey" element={<DatePage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<Navigate to="/activity" replace />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
