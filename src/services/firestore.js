// Cloud Firestore Database Layer for SpillATea
import { 
  db, 
  isFirebaseConfigured 
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  increment, 
  serverTimestamp,
  limit
} from 'firebase/firestore';

const CONFESSIONS_COL = 'confessions';
const COMMENTS_COL = 'comments';
const REPORTS_COL = 'reports';
const AUDIT_LOGS_COL = 'audit_logs';

export const firestoreService = {
  // 1. Fetch Confessions
  async getConfessions({ day, category, search } = {}) {
    if (!isFirebaseConfigured) return null;

    try {
      const colRef = collection(db, CONFESSIONS_COL);
      let q = query(colRef, where('status', '==', 'published'), orderBy('created_at', 'desc'), limit(50));

      const snapshot = await getDocs(q);
      let confessions = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // In-memory filters for dynamic fields
      if (day && day !== 'all' && day !== 'this_week') {
        confessions = confessions.filter(c => c.day_key === day || c.date_key === day);
      }
      if (category && category.toLowerCase() !== 'all') {
        confessions = confessions.filter(c => c.category?.toLowerCase() === category.toLowerCase());
      }
      if (search && search.trim()) {
        const term = search.toLowerCase().trim();
        confessions = confessions.filter(c => 
          c.body?.toLowerCase().includes(term) ||
          c.to_target?.toLowerCase().includes(term) ||
          c.confession_number?.toLowerCase().includes(term)
        );
      }

      return confessions;
    } catch (err) {
      console.warn('[Firestore] Failed to query confessions:', err.message);
      return null;
    }
  },

  // 2. Fetch Single Confession
  async getConfessionById(id) {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, CONFESSIONS_COL, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // 3. Create Confession
  async createConfession(data) {
    if (!isFirebaseConfigured) return null;

    try {
      const colRef = collection(db, CONFESSIONS_COL);
      
      // Fast single-doc query for latest confession number instead of reading entire collection
      let nextNum = 1;
      try {
        const qLatest = query(colRef, orderBy('created_at', 'desc'), limit(1));
        const snap = await Promise.race([
          getDocs(qLatest),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000))
        ]);
        if (!snap.empty) {
          const latestDoc = snap.docs[0].data();
          const prevNum = parseInt(latestDoc.confession_number?.replace(/\D/g, '') || '0', 10);
          if (!isNaN(prevNum) && prevNum > 0) {
            nextNum = prevNum + 1;
          }
        }
      } catch (e) {
        nextNum = Math.floor(Math.random() * 900) + 100;
      }

      const formattedNum = nextNum < 10 ? `No. 00${nextNum}` : nextNum < 100 ? `No. 0${nextNum}` : `No. ${nextNum}`;

      const now = new Date();
      const dateKey = now.toISOString().split('T')[0];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dayName = dayNames[now.getDay()];
      const dayLabel = `${dayName}, ${now.getDate()} ${months[now.getMonth()]}`;

      const docData = {
        confession_number: formattedNum,
        date_key: dateKey,
        day_key: 'today',
        day_name: dayName,
        day_label: dayLabel,
        time_formatted: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        exact_time: now.toLocaleString(),
        to_target: data.to_target || null,
        category: data.category || 'Confessions',
        body: data.body,
        likes: 0,
        comment_count: 0,
        is_anonymous: Boolean(data.is_anonymous),
        author_name: data.is_anonymous ? 'Anonymous Student' : data.author_name,
        author_id: data.author_id || 'anon-user',
        // Private credentials
        real_author_name: data.real_author_name || 'Student',
        real_author_email: data.real_author_email || 'student@college.edu',
        status: 'published',
        created_at: now.toISOString()
      };

      const docRef = await Promise.race([
        addDoc(colRef, docData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 1500))
      ]);

      return { id: docRef.id, ...docData };
    } catch (err) {
      console.warn('[Firestore] Error or timeout creating confession:', err.message);
      return null;
    }
  },

  // 4. Like / Reaction
  async toggleLike(id, delta = 1) {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, CONFESSIONS_COL, id);
      await updateDoc(docRef, { likes: increment(delta) });
      return true;
    } catch (e) {
      return false;
    }
  },

  // 5. Comments
  async getComments(postId) {
    if (!isFirebaseConfigured) return null;
    try {
      const colRef = collection(db, COMMENTS_COL);
      const q = query(colRef, where('post_id', '==', postId), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data(), content: d.data().body || d.data().content }));
    } catch (e) {
      return null;
    }
  },

  async addComment(postId, commentData) {
    if (!isFirebaseConfigured) return null;
    try {
      const colRef = collection(db, COMMENTS_COL);
      const newDoc = {
        post_id: postId,
        body: commentData.body || commentData.content,
        author_name: commentData.author_name || 'Anonymous Student',
        author_role: commentData.author_role || 'Student',
        likes: 0,
        created_at: new Date().toISOString()
      };
      const docRef = await addDoc(colRef, newDoc);

      // Increment parent confession comment count
      try {
        await updateDoc(doc(db, CONFESSIONS_COL, postId), { comment_count: increment(1) });
      } catch (e) {}

      return { id: docRef.id, ...newDoc, content: newDoc.body };
    } catch (e) {
      return null;
    }
  },

  // 6. Reports & Audit
  async submitReport({ postId, reason, notes }) {
    if (!isFirebaseConfigured) return null;
    try {
      const colRef = collection(db, REPORTS_COL);
      const docData = {
        post_id: postId,
        reason,
        notes: notes || '',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      await addDoc(colRef, docData);
      return true;
    } catch (e) {
      return false;
    }
  }
};
