-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    featured_image TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    view_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create article_likes table
CREATE TABLE IF NOT EXISTS public.article_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(article_id, user_id)
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE articles SET view_count = view_count + 1 WHERE id = article_id;
END;
$$;

-- Create function to get categories with counts
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (
    category TEXT,
    count BIGINT
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        category, 
        COUNT(*) as count
    FROM 
        articles
    WHERE 
        category IS NOT NULL AND category <> ''
    GROUP BY 
        category
    ORDER BY 
        count DESC;
$$;

-- Create function to get tags with counts
CREATE OR REPLACE FUNCTION get_tag_counts()
RETURNS TABLE (
    tag TEXT,
    count BIGINT
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        unnest(tags) as tag, 
        COUNT(*) as count
    FROM 
        articles
    GROUP BY 
        tag
    ORDER BY 
        count DESC;
$$;

-- Create RLS (Row Level Security) policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Articles policies
CREATE POLICY "Public articles are viewable by everyone" 
ON articles FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create articles" 
ON articles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles" 
ON articles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" 
ON articles FOR DELETE USING (auth.uid() = user_id);

-- Let authors read their own draft articles
CREATE POLICY "Authors can view all their articles" 
ON articles FOR SELECT USING (auth.uid() = user_id);

-- Article likes policies
CREATE POLICY "Users can view article likes" 
ON article_likes FOR SELECT USING (true);

CREATE POLICY "Users can add likes" 
ON article_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes" 
ON article_likes FOR DELETE USING (auth.uid() = user_id);

-- Profile policies
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON comments FOR SELECT USING (true);

CREATE POLICY "Users can add comments" 
ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON comments FOR DELETE USING (auth.uid() = user_id); 