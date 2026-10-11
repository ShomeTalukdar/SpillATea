import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconAlert, IconClose } from '../components/icons/Icons';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#1C1C20] border border-[#2A2A2F] text-[#F0F0F2] rounded-lg shadow-lg text-sm transition-smooth animate-fade-in"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <IconCheck size={16} className="text-[#76B99A] shrink-0" />}
              {toast.type === 'error' && <IconAlert size={16} className="text-[#E36B73] shrink-0" />}
              {toast.type === 'info' && <span className="w-2 h-2 rounded-full bg-[#F07845] shrink-0" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#777780] hover:text-[#F0F0F2] p-1 -mr-1 transition-smooth cursor-pointer"
              aria-label="Dismiss notification"
            >
              <IconClose size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
