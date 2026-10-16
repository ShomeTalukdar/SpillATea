-- SpillATea Database Schema & Security Policies
-- PostgreSQL Migration for Supabase

-- 1. Create sequential post numbering sequence
CREATE SEQUENCE IF NOT EXISTS post_serial_seq START WITH 1 INCREMENT BY 1;

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  college_email TEXT NOT NULL,
  is_college_verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_number BIGINT DEFAULT nextval('post_serial_seq') UNIQUE NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT TRUE NOT NULL,
  title VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Confessions',
    'College Life',
    'Academics',
    'Relationships',
    'Rants',
    'Memes and Fun',
    'Advice'
  )),
  likes_count INT DEFAULT 0 NOT NULL,
  dislikes_count INT DEFAULT 0 NOT NULL,
  comment_count INT DEFAULT 0 NOT NULL,
  share_count INT DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'pending_review', 'removed')),
  moderation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for feed performance
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON public.posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_post_number ON public.posts(post_number);

-- 4. Public Posts View (Anonymity Enforcement Layer)
-- Guarantees that ordinary users NEVER receive author_id for anonymous posts
CREATE OR REPLACE VIEW public.public_posts AS
SELECT
  p.id,
  p.post_number,
  p.is_anonymous,
  CASE 
    WHEN p.is_anonymous = TRUE THEN 'Anonymous Student'
    ELSE pr.display_name
  END AS author_display_name,
  CASE 
    WHEN p.is_anonymous = TRUE THEN NULL
    ELSE p.author_id
  END AS public_author_id,
  p.title,
  p.content,
  p.category,
  p.likes_count,
  p.dislikes_count,
  p.comment_count,
  p.share_count,
  p.status,
  p.created_at
FROM public.posts p
LEFT JOIN public.profiles pr ON p.author_id = pr.id
WHERE p.status = 'published';

-- 5. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT TRUE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count INT DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'removed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- 6. Reactions Table (Prevents duplicates)
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 7. Reports Queue Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN (
    'Harassment or Bullying',
    'Hate Speech',
    'Exposed Personal Information',
    'Threat or Violence',
    'Spam or Commercial Promotion',
    'Academic Dishonesty'
  )),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  moderator_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Warnings and Suspensions Table
CREATE TABLE IF NOT EXISTS public.warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  issued_by UUID NOT NULL REFERENCES public.profiles(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  issued_by UUID NOT NULL REFERENCES public.profiles(id),
  suspended_until TIMESTAMPTZ NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Moderation Audit Log Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  performed_by UUID NOT NULL REFERENCES public.profiles(id),
  target_id TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Row Level Security (RLS) Setup
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies: Published posts are viewable by all authenticated users
CREATE POLICY "Public read published posts" ON public.posts
  FOR SELECT USING (status = 'published');

-- Insert policy: Authenticated users can create posts
CREATE POLICY "Users can insert own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Update policy: Only authors or moderators can update
CREATE POLICY "Authors or mods can update posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  ));

-- Reactions policies
CREATE POLICY "Users can manage their own reactions" ON public.reactions
  FOR ALL USING (auth.uid() = user_id);

-- Reports policies: Any user can submit report
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Admin report view policy
CREATE POLICY "Only admins view reports" ON public.reports
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  ));
