import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  isFirebaseConfigured,
  db
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { isCollegeEmail, extractCollegeName } from '../utils/collegeEmailValidator';
import AuthModal from '../components/auth/AuthModal';

// Localhost-only test credentials (strictly disabled on production domains)
export const LOCAL_DEV_CREDENTIALS = {
  user: {
    email: 'student.test@kiit.ac.in',
    password: 'student123',
    displayName: 'Test Student',
    role: 'student',
    college: 'KIIT University'
  },
  admin: {
    email: 'admin.mod@kiit.ac.in',
    password: 'admin123',
    displayName: 'Campus Moderator',
    role: 'admin',
    college: 'KIIT University'
  }
};

export const isLocalhostEnvironment = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local');
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('');

  const openAuthModal = (reason = '') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  };

  // Sync with Firebase Auth state / Localhost test session
  useEffect(() => {
    // Check local dev mock session first if running on localhost
    if (isLocalhostEnvironment()) {
      try {
        const cachedMock = sessionStorage.getItem('spillatea_local_dummy_session');
        if (cachedMock) {
          const parsed = JSON.parse(cachedMock);
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }
    if (!isFirebaseConfigured) {
      // Fallback local student profile if Firebase keys aren't set yet
      setUser({
        uid: 'user-current-session',
        id: 'user-current-session',
        email: 'student@kiit.ac.in',
        displayName: 'Jordan Brooks',
        name: 'Jordan Brooks',
        college_verified: true,
        role: 'student'
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Double check college email verification
        if (firebaseUser.email && !isCollegeEmail(firebaseUser.email)) {
          console.warn('[Firebase Auth] Non-college email detected. Logging out.');
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch or create user profile in Firestore
        let profileData = {
          role: 'student',
          college_verified: true
        };

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            profileData = userDoc.data();
          } else {
            const initialDoc = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              displayName: firebaseUser.displayName || 'Anonymous Student',
              college: extractCollegeName(firebaseUser.email),
              role: 'student',
              college_verified: true,
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, initialDoc);
            profileData = initialDoc;
          }
        } catch (e) {
          console.warn('[Firebase Auth] Firestore profile sync warning:', e.message);
        }

        setUser({
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName || 'Anonymous Student',
          name: firebaseUser.displayName || 'Anonymous Student',
          photoURL: firebaseUser.photoURL,
          college: profileData.college || extractCollegeName(firebaseUser.email),
          college_verified: true,
          role: profileData.role || 'student'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Google Sign-In with Campus Email Verification
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email || '';

      if (!isCollegeEmail(email)) {
        await signOut(auth);
        setUser(null);
        const err = `Access Restricted: "${email || 'Personal Account'}" is not a recognized college email. Only verified institutional student emails (e.g. 1243@kiit.ac.in, .ac.in, or .edu) are permitted.`;
        setAuthError(err);
        return { success: false, error: err };
      }

      return { success: true, user: result.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // 2. Email / Password Signup with Campus Email & Confirm Password Verification
  const signupWithEmail = async (email, password, confirmPassword, displayName) => {
    setAuthError(null);

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      const err = 'Please enter your college email address.';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (!isCollegeEmail(cleanEmail)) {
      const err = 'Access Restricted: Please register with your official college email (e.g. your_id@kiit.ac.in, .ac.in, or .edu). Personal email providers like Gmail/Yahoo are not allowed.';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (!password || !confirmPassword) {
      const err = 'Please enter both password and confirm password.';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (password !== confirmPassword) {
      const err = 'Passwords do not match. Please ensure both password fields match exactly.';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (password.length < 6) {
      const err = 'Password must be at least 6 characters long.';
      setAuthError(err);
      return { success: false, error: err };
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const college = extractCollegeName(cleanEmail);
      const studentName = displayName || cleanEmail.split('@')[0];
      await updateProfile(result.user, { displayName: studentName });

      // Save user doc in Firestore
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: cleanEmail,
          displayName: studentName,
          college,
          college_verified: true,
          role: 'student',
          createdAt: serverTimestamp()
        });
      } catch (e) {}

      return { success: true, user: result.user };
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This college email is already registered. Please switch to Sign In.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // 3. Email / Password Login with Campus Email Check
  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      const err = 'Please enter your college email address.';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (!isCollegeEmail(cleanEmail)) {
      const err = 'Access Restricted: Only college student emails (e.g. 1243@kiit.ac.in, .ac.in, or .edu) can log in.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Strict Localhost-only check for test dummy accounts
    const isLocalhost = isLocalhostEnvironment();
    const isStudentDummy = cleanEmail === LOCAL_DEV_CREDENTIALS.user.email.toLowerCase();
    const isAdminDummy = cleanEmail === LOCAL_DEV_CREDENTIALS.admin.email.toLowerCase();

    if (isStudentDummy || isAdminDummy) {
      if (!isLocalhost) {
        const err = 'Security Restriction: Local test accounts are strictly disabled in production.';
        setAuthError(err);
        return { success: false, error: err };
      }

      const targetCred = isStudentDummy ? LOCAL_DEV_CREDENTIALS.user : LOCAL_DEV_CREDENTIALS.admin;
      if (password !== targetCred.password) {
        const err = 'Incorrect password for local test account.';
        setAuthError(err);
        return { success: false, error: err };
      }

      const mockProfile = {
        uid: isStudentDummy ? 'local-student-001' : 'local-admin-001',
        id: isStudentDummy ? 'local-student-001' : 'local-admin-001',
        email: targetCred.email,
        displayName: targetCred.displayName,
        name: targetCred.displayName,
        college: targetCred.college,
        college_verified: true,
        role: targetCred.role
      };

      setUser(mockProfile);
      try {
        sessionStorage.setItem('spillatea_local_dummy_session', JSON.stringify(mockProfile));
      } catch (e) {}
      return { success: true, user: mockProfile };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      return { success: true, user: result.user };
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Account not registered or incorrect password. If you are new, click "Create Account" below to register.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // 4. Phone Authentication (SMS OTP)
  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {}
      });
    }
    return window.recaptchaVerifier;
  };

  const sendPhoneOtp = async (phoneNumber, containerId = 'recaptcha-container') => {
    setAuthError(null);
    try {
      const appVerifier = setupRecaptcha(containerId);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true, confirmationResult };
    } catch (err) {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const verifyPhoneOtp = async (otpCode) => {
    setAuthError(null);
    try {
      if (!window.confirmationResult) {
        throw new Error('Please request an SMS OTP code first.');
      }
      const result = await window.confirmationResult.confirm(otpCode);
      return { success: true, user: result.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // 5. Logout
  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('spillatea_local_dummy_session');
      }
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (err) {
      setUser(null);
      return { success: false, error: err.message };
    }
  };

  const toggleAdminRole = async () => {
    if (!user) return;
    const nextRole = user.role === 'admin' ? 'student' : 'admin';
    const updated = { ...user, role: nextRole };
    setUser(updated);
    try {
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'users', user.uid), { role: nextRole }, { merge: true });
      }
    } catch (e) {}
  };

  const value = {
    user,
    loading,
    authError,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    sendPhoneOtp,
    verifyPhoneOtp,
    logout,
    toggleAdminRole,
    isAdmin: user?.role === 'admin',
    isFirebaseConfigured,
    isAuthModalOpen,
    authModalReason,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        reason={authModalReason} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
