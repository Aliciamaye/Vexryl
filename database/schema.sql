-- Vexryl Platform Database Schema
-- All data stored as JSON/text according to project plan

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}',
  PRIMARY KEY (id)
);

-- Projects table (main container for user work)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  bots JSONB DEFAULT '[]',
  templates JSONB DEFAULT '[]',
  env_vars JSONB DEFAULT '{}',
  secrets JSONB DEFAULT '{}', -- encrypted
  block_graphs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  github_repo TEXT,
  github_last_sync TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT false
);

-- Commands table (slash commands)
CREATE TABLE IF NOT EXISTS public.commands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL, -- full command configuration
  enabled BOOLEAN DEFAULT true,
  collaborators INTEGER DEFAULT 0,
  executions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (event listeners/workflows)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL, -- full workflow configuration
  enabled BOOLEAN DEFAULT true,
  collaborators INTEGER DEFAULT 0,
  executions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace items
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('command', 'event', 'block', 'flow', 'module')),
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  tags TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version history/snapshots
CREATE TABLE IF NOT EXISTS public.snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('manual', 'auto', 'milestone', 'github_sync')),
  data JSONB NOT NULL,
  message TEXT,
  github_commit_sha TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration sessions
CREATE TABLE IF NOT EXISTS public.collaboration_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  host_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  participants JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for projects
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for commands
CREATE POLICY "Users can view own commands" ON public.commands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own commands" ON public.commands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own commands" ON public.commands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own commands" ON public.commands
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for events
CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for marketplace
CREATE POLICY "Everyone can view public marketplace items" ON public.marketplace_items
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own marketplace items" ON public.marketplace_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own marketplace items" ON public.marketplace_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own marketplace items" ON public.marketplace_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own marketplace items" ON public.marketplace_items
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for snapshots
CREATE POLICY "Users can view own snapshots" ON public.snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own snapshots" ON public.snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for collaboration
CREATE POLICY "Users can view sessions they participate in" ON public.collaboration_sessions
  FOR SELECT USING (
    auth.uid() = host_user_id OR 
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants))
  );

CREATE POLICY "Users can create collaboration sessions" ON public.collaboration_sessions
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Session hosts can update sessions" ON public.collaboration_sessions
  FOR UPDATE USING (auth.uid() = host_user_id);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_commands_user_id ON public.commands(user_id);
CREATE INDEX idx_commands_project_id ON public.commands(project_id);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_project_id ON public.events(project_id);
CREATE INDEX idx_marketplace_type ON public.marketplace_items(type);
CREATE INDEX idx_marketplace_public ON public.marketplace_items(is_public);
CREATE INDEX idx_snapshots_project_id ON public.snapshots(project_id);

-- Functions for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_commands_updated_at
  BEFORE UPDATE ON public.commands
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_marketplace_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
