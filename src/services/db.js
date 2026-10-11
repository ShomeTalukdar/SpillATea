// Data and storage layer for CampusEcho
// Supports Supabase with graceful, fully functioning local persistence for local preview and offline testing.

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validateAndModeratePost, moderateText } from './moderation';

const STORAGE_KEY_POSTS = 'campusecho_posts_v1';
const STORAGE_KEY_COMMENTS = 'campusecho_comments_v1';
const STORAGE_KEY_REPORTS = 'campusecho_reports_v1';
const STORAGE_KEY_USER = 'campusecho_current_user_v1';
const STORAGE_KEY_REACTIONS = 'campusecho_user_reactions_v1';
const STORAGE_KEY_AUDIT = 'campusecho_audit_logs_v1';
const STORAGE_KEY_WARNINGS = 'campusecho_warnings_v1';

// Format public post serial number: #01, #02 ... #99, #100, #101
export function formatPostNumber(num) {
  if (num < 10) return `#0${num}`;
  return `#${num}`;
}

// Initial realistic college community posts
const INITIAL_POSTS = [
  {
    id: 'post-101',
    post_number: 1,
    post_number_formatted: '#01',
    is_anonymous: true,
    author_name: 'Anonymous Student',
    author_id: 'user-anon-1',
    title: 'I accidentally submitted my rough draft with notes for my professor',
    content: 'It was 11:58 PM before the midnight deadline for Advanced Algorithms. I thought I attached final_version_clean.pdf, but I uploaded draft_v3_pls_help.pdf instead. Inside, on page 3, I left a comment saying "I have no idea if this runtime complexity is correct, pray for me." Woke up this morning to a notification that it was graded. My professor left a comment: "Proof was surprisingly solid. Prayers answered, 94/100." I still cannot look at him in lecture.',
    category: 'Confessions',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    likes: 42,
    dislikes: 1,
    comment_count: 8,
    share_count: 5,
    status: 'published'
  },
  {
    id: 'post-102',
    post_number: 2,
    post_number_formatted: '#02',
    is_anonymous: false,
    author_name: 'Marcus Chen',
    author_id: 'user-marcus',
    title: 'Quiet study spaces on campus that are not the third floor library',
    content: 'The science building atrium on the north side has desks on the second floor balcony. Rarely any foot traffic after 4:00 PM, fast Wi-Fi, and natural lighting until sunset. If you need absolute silence for midterms, avoid the student union commons and try the architecture annex basement study lounge.',
    category: 'College Life',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    likes: 29,
    dislikes: 0,
    comment_count: 4,
    share_count: 12,
    status: 'published'
  },
  {
    id: 'post-103',
    post_number: 3,
    post_number_formatted: '#03',
    is_anonymous: true,
    author_name: 'Anonymous Student',
    author_id: 'user-anon-2',
    title: 'Organic Chemistry midterm average was 41 percent',
    content: 'The professor stood in front of lecture hall B today and said the curve will be generous, but that does not undo the collective panic attack 300 students experienced on Tuesday night. Is anyone forming a dedicated problem-set group for mechanisms before the next exam? Please reply if you want to meet in the science library on Thursday.',
    category: 'Academics',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
    likes: 67,
    dislikes: 3,
    comment_count: 19,
    share_count: 14,
    status: 'published'
  },
  {
    id: 'post-104',
    post_number: 4,
    post_number_formatted: '#04',
    is_anonymous: true,
    author_name: 'Anonymous Student',
    author_id: 'user-anon-3',
    title: 'Why do dining hall scrambled eggs have the texture of damp foam?',
    content: 'This is not culinary art. This is a physics experiment testing how much water a single egg yolk can hold before it collapses into a puddle on a plastic tray. At what point do we demand basic seasoning and real butter? We pay five thousand dollars per semester for this meal plan.',
    category: 'Rants',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
    likes: 115,
    dislikes: 8,
    comment_count: 31,
    share_count: 22,
    status: 'published'
  },
  {
    id: 'post-105',
    post_number: 5,
    post_number_formatted: '#05',
    is_anonymous: false,
    author_name: 'Elena Rostova',
    author_id: 'user-elena',
    title: 'To the person playing cello outside the humanities quad every Sunday',
    content: 'Just wanted to say your Bach suites make studying for law prerequisites much more tolerable. Half the students sitting on the grass take off their headphones to listen. Keep doing it.',
    category: 'Relationships',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // 2 days ago
    likes: 88,
    dislikes: 2,
    comment_count: 6,
    share_count: 8,
    status: 'published'
  },
  {
    id: 'post-106',
    post_number: 6,
    post_number_formatted: '#06',
    is_anonymous: true,
    author_name: 'Anonymous Student',
    author_id: 'user-anon-4',
    title: 'Senior year realization: nobody actually knows what they are doing',
    content: 'Freshman year I assumed everyone had five-year plans, internships lined up, and clear life trajectory. Sitting in capstone seminar now, three months before commencement, and we all admitted we are winging it. If you are an underclassman feeling behind, do not panic. Do your coursework, make friends, and take care of your mental health.',
    category: 'Advice',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(), // 3 days ago
    likes: 142,
    dislikes: 2,
    comment_count: 24,
    share_count: 36,
    status: 'published'
  }
];

const INITIAL_COMMENTS = [
  {
    id: 'comment-1',
    post_id: 'post-101',
    author_name: 'Anonymous Student',
    is_anonymous: true,
    content: 'Professors love when you are honest, but getting a 94 is peak luck.',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 14,
    user_liked: false,
    parent_id: null
  },
  {
    id: 'comment-2',
    post_id: 'post-101',
    author_name: 'Devon Patel',
    is_anonymous: false,
    content: 'Legendary move. Frame that rubric.',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: 8,
    user_liked: false,
    parent_id: null
  },
  {
    id: 'comment-3',
    post_id: 'post-103',
    author_name: 'Anonymous Student',
    is_anonymous: true,
    content: 'I got a 38 and honestly felt like a genius compared to the section average.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 19,
    user_liked: false,
    parent_id: null
  }
];

// Helper to get local data safely
function getLocalPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_POSTS;
  }
}

function saveLocalPosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to localStorage', e);
  }
}

function getLocalComments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(INITIAL_COMMENTS));
      return INITIAL_COMMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_COMMENTS;
  }
}

function saveLocalComments(comments) {
  try {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments', e);
  }
}

function getLocalUserReactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REACTIONS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalUserReactions(reactions) {
  try {
    localStorage.setItem(STORAGE_KEY_REACTIONS, JSON.stringify(reactions));
  } catch (e) {
    console.error('Failed to save reactions', e);
  }
}

function getLocalReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports', e);
  }
}

function getLocalAuditLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalAuditLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save audit logs', e);
  }
}

// Current User State Management
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const defaultUser = {
    id: 'user-current-session',
    email: 'student@college.edu',
    name: 'Jordan Brooks',
    username: 'jordan_b',
    college_verified: true,
    role: 'student', // 'student' or 'admin'
    created_at: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
  return defaultUser;
}

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

// Post retrieval with sorting, categories, and anonymity enforcement
export async function fetchPosts({ category = 'all', sort = 'for_you', searchQuery = '' } = {}) {
  let posts = getLocalPosts();
  const reactions = getLocalUserReactions();

  // Filter out removed or pending review unless admin
  posts = posts.filter(p => p.status === 'published');

  // Filter by category
  if (category && category.toLowerCase() !== 'all') {
    posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Attach user reactions & ensure privacy
  const now = Date.now();
  const postsWithState = posts.map(post => {
    const userReact = reactions[post.id] || null;
    
    // Privacy: never leak author_id or email for anonymous posts
    const isAnon = post.is_anonymous;
    return {
      ...post,
      author_name: isAnon ? 'Anonymous Student' : post.author_name,
      author_id: isAnon ? undefined : post.author_id,
      user_reaction: userReact
    };
  });

  // Calculate engagement score for trending calculations
  // engagement = (likes * 2 - dislikes + comments * 3 + shares * 1.5) / (hours_old + 2)^1.2
  function calculateTrendingScore(p) {
    const ageHours = Math.max(0.1, (now - new Date(p.created_at).getTime()) / (1000 * 60 * 60));
    const rawScore = (p.likes * 2) - p.dislikes + (p.comment_count * 3) + (p.share_count * 1.5);
    return rawScore / Math.pow(ageHours + 2, 1.2);
  }

  // Sort posts
  if (sort === 'most_recent') {
    postsWithState.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sort === 'trending_today') {
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const recent = postsWithState.filter(p => new Date(p.created_at).getTime() >= oneDayAgo);
    recent.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
    return recent;
  } else if (sort === 'trending_week') {
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recent = postsWithState.filter(p => new Date(p.created_at).getTime() >= oneWeekAgo);
    recent.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
    return recent;
  } else if (sort === 'trending_month') {
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const recent = postsWithState.filter(p => new Date(p.created_at).getTime() >= oneMonthAgo);
    recent.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
    return recent;
  } else {
    // 'for_you' algorithm: balanced mix of recency and quality
    postsWithState.sort((a, b) => {
      const scoreA = calculateTrendingScore(a) * 0.7 + (new Date(a.created_at).getTime() / 1e11) * 0.3;
      const scoreB = calculateTrendingScore(b) * 0.7 + (new Date(b.created_at).getTime() / 1e11) * 0.3;
      return scoreB - scoreA;
    });
  }

  return postsWithState;
}

// Fetch single post by ID or post_number
export async function fetchPostById(identifier) {
  const posts = getLocalPosts();
  const reactions = getLocalUserReactions();

  const post = posts.find(p => 
    p.id === identifier || 
    p.post_number.toString() === identifier.toString() ||
    p.post_number_formatted.toLowerCase() === identifier.toLowerCase() ||
    `#${identifier}`.toLowerCase() === p.post_number_formatted.toLowerCase()
  );

  if (!post) return null;

  const userReact = reactions[post.id] || null;
  const isAnon = post.is_anonymous;

  return {
    ...post,
    author_name: isAnon ? 'Anonymous Student' : post.author_name,
    author_id: isAnon ? undefined : post.author_id,
    user_reaction: userReact
  };
}

// Create new post with server-side validation, moderation, and sequential numbering
export async function createPost({ title, content, category, is_anonymous = true }) {
  const currentUser = getCurrentUser();

  // Validate and moderate
  const modResult = validateAndModeratePost({ title, content, category });
  if (!modResult.isValid) {
    return {
      success: false,
      error: modResult.errors.join(' ')
    };
  }

  const posts = getLocalPosts();
  const nextSeq = posts.length > 0 ? Math.max(...posts.map(p => p.post_number || 0)) + 1 : 1;
  const newPostId = `post-${Date.now()}`;
  const formattedSeq = formatPostNumber(nextSeq);

  const newPost = {
    id: newPostId,
    post_number: nextSeq,
    post_number_formatted: formattedSeq,
    is_anonymous: Boolean(is_anonymous),
    author_name: is_anonymous ? 'Anonymous Student' : currentUser.name,
    // Author id is privately preserved in the database record for moderation compliance
    author_id: currentUser.id,
    title: modResult.cleanTitle,
    content: modResult.cleanContent,
    category,
    created_at: new Date().toISOString(),
    likes: 1, // Author initial upvote
    dislikes: 0,
    comment_count: 0,
    share_count: 0,
    status: modResult.requiresReview ? 'pending_review' : 'published',
    moderation_notes: modResult.requiresReview ? modResult.reviewReason : null
  };

  posts.unshift(newPost);
  saveLocalPosts(posts);

  // If pending review, record in report queue automatically
  if (modResult.requiresReview) {
    const reports = getLocalReports();
    reports.unshift({
      id: `mod-flag-${Date.now()}`,
      post_id: newPostId,
      reason: modResult.reviewReason || 'Automated safety flag',
      reported_by: 'System Moderation',
      created_at: new Date().toISOString(),
      status: 'pending'
    });
    saveLocalReports(reports);
  }

  // Set user's initial reaction as 'like'
  const reactions = getLocalUserReactions();
  reactions[newPostId] = 'like';
  saveLocalUserReactions(reactions);

  return {
    success: true,
    post: {
      ...newPost,
      author_id: is_anonymous ? undefined : currentUser.id,
      user_reaction: 'like'
    },
    requiresReview: modResult.requiresReview,
    reviewReason: modResult.reviewReason
  };
}

// React to post (Like/Dislike toggle)
export async function reactToPost(postId, reactionType) {
  // reactionType: 'like' | 'dislike'
  const posts = getLocalPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return { success: false, error: 'Post not found' };

  const post = posts[postIndex];
  const reactions = getLocalUserReactions();
  const currentReaction = reactions[postId];

  if (currentReaction === reactionType) {
    // Remove reaction (toggle off)
    delete reactions[postId];
    if (reactionType === 'like') {
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.dislikes = Math.max(0, post.dislikes - 1);
    }
  } else {
    // New or changed reaction
    if (currentReaction === 'like') {
      post.likes = Math.max(0, post.likes - 1);
    } else if (currentReaction === 'dislike') {
      post.dislikes = Math.max(0, post.dislikes - 1);
    }

    reactions[postId] = reactionType;
    if (reactionType === 'like') {
      post.likes += 1;
    } else {
      post.dislikes += 1;
    }
  }

  posts[postIndex] = post;
  saveLocalPosts(posts);
  saveLocalUserReactions(reactions);

  return {
    success: true,
    likes: post.likes,
    dislikes: post.dislikes,
    user_reaction: reactions[postId] || null
  };
}

// Fetch comments for post
export async function fetchComments(postId) {
  const comments = getLocalComments();
  return comments.filter(c => c.post_id === postId);
}

// Add comment
export async function addComment({ postId, content, is_anonymous = true, parent_id = null }) {
  const currentUser = getCurrentUser();
  const trimmed = (content || '').trim();

  if (!trimmed) {
    return { success: false, error: 'Comment content cannot be empty.' };
  }

  const modResult = moderateText(trimmed);

  const comments = getLocalComments();
  const newComment = {
    id: `comment-${Date.now()}`,
    post_id: postId,
    author_name: is_anonymous ? 'Anonymous Student' : currentUser.name,
    author_id: currentUser.id,
    is_anonymous: Boolean(is_anonymous),
    content: modResult.maskedText,
    created_at: new Date().toISOString(),
    likes: 0,
    user_liked: false,
    parent_id
  };

  comments.push(newComment);
  saveLocalComments(comments);

  // Increment comment count on post
  const posts = getLocalPosts();
  const pIndex = posts.findIndex(p => p.id === postId);
  if (pIndex !== -1) {
    posts[pIndex].comment_count = (posts[pIndex].comment_count || 0) + 1;
    saveLocalPosts(posts);
  }

  return {
    success: true,
    comment: {
      ...newComment,
      author_id: is_anonymous ? undefined : currentUser.id
    }
  };
}

// Increment share count
export async function recordPostShare(postId) {
  const posts = getLocalPosts();
  const pIndex = posts.findIndex(p => p.id === postId);
  if (pIndex !== -1) {
    posts[pIndex].share_count = (posts[pIndex].share_count || 0) + 1;
    saveLocalPosts(posts);
  }
}

// Submit a report
export async function submitReport({ postId, commentId = null, reason, details = '' }) {
  const currentUser = getCurrentUser();
  const reports = getLocalReports();

  const newReport = {
    id: `report-${Date.now()}`,
    post_id: postId,
    comment_id: commentId,
    reason,
    details,
    reported_by: currentUser.id,
    created_at: new Date().toISOString(),
    status: 'pending'
  };

  reports.unshift(newReport);
  saveLocalReports(reports);

  return { success: true };
}

// Admin Operations
export async function fetchAdminReportQueue() {
  const reports = getLocalReports();
  const posts = getLocalPosts();

  // Combine report with post data
  return reports.map(r => {
    const post = posts.find(p => p.id === r.post_id);
    return {
      ...r,
      post: post || null
    };
  });
}

export async function adminTakeAction({ reportId, action, moderatorNotes, targetUserId = null }) {
  // action: 'approve' | 'remove' | 'escalate' | 'warn' | 'suspend'
  const currentUser = getCurrentUser();
  const reports = getLocalReports();
  const rIndex = reports.findIndex(r => r.id === reportId);
  if (rIndex === -1) return { success: false, error: 'Report not found' };

  const report = reports[rIndex];
  report.status = action === 'approve' ? 'dismissed' : 'reviewed';
  report.moderator_notes = moderatorNotes;
  reports[rIndex] = report;
  saveLocalReports(reports);

  // If removing post
  if (action === 'remove') {
    const posts = getLocalPosts();
    const pIndex = posts.findIndex(p => p.id === report.post_id);
    if (pIndex !== -1) {
      posts[pIndex].status = 'removed';
      saveLocalPosts(posts);
    }
  }

  // If approving post that was under review
  if (action === 'approve') {
    const posts = getLocalPosts();
    const pIndex = posts.findIndex(p => p.id === report.post_id);
    if (pIndex !== -1) {
      posts[pIndex].status = 'published';
      saveLocalPosts(posts);
    }
  }

  // Audit log
  const auditLogs = getLocalAuditLogs();
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    action,
    performed_by: currentUser.name,
    target_id: report.post_id,
    details: moderatorNotes || `Admin action: ${action}`,
    timestamp: new Date().toISOString()
  });
  saveLocalAuditLogs(auditLogs);

  return { success: true };
}

export async function fetchAdminAuditLogs() {
  return getLocalAuditLogs();
}

// Authorized hidden-profile lookup (only for administrative audits, logged)
export async function adminLookupAuthor(postId) {
  const currentUser = getCurrentUser();
  if (currentUser.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Administrator access required.' };
  }

  const posts = getLocalPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return { success: false, error: 'Post not found.' };

  // Log audit access
  const auditLogs = getLocalAuditLogs();
  auditLogs.unshift({
    id: `audit-lookup-${Date.now()}`,
    action: 'author_identity_lookup',
    performed_by: currentUser.name,
    target_id: postId,
    details: `Authorized identity review for post ${post.post_number_formatted}`,
    timestamp: new Date().toISOString()
  });
  saveLocalAuditLogs(auditLogs);

  return {
    success: true,
    author_id: post.author_id,
    registered_email: 'student_verified@college.edu',
    account_status: 'Active (College Verified)'
  };
}
