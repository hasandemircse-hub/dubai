-- Dubai Türk Rehberi - Şema
-- Tablolar, enum'lar ve trigger'lar

create extension if not exists "pgcrypto";

-- =====================================================
-- ENUM TYPE'LAR
-- =====================================================

do $$ begin
  create type public.user_role as enum ('user', 'business_owner', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.source_type as enum (
    'user_submitted',
    'admin_curated',
    'community_suggested',
    'business_claimed',
    'whatsapp_summary'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.item_type as enum ('post', 'business', 'topic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum ('pending', 'reviewed', 'dismissed');
exception when duplicate_object then null; end $$;

-- =====================================================
-- PROFILES
-- =====================================================

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  phone text,
  role public.user_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_role_idx on public.profiles(role);

-- =====================================================
-- CATEGORIES
-- =====================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  emoji text,
  slug text not null unique,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- =====================================================
-- LOCATIONS
-- =====================================================

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- =====================================================
-- POSTS (ilanlar)
-- =====================================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  location text,
  whatsapp_number text,
  image_url text,
  status public.content_status not null default 'pending',
  is_featured boolean not null default false,
  source_type public.source_type not null default 'user_submitted',
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_category_idx on public.posts(category);
create index if not exists posts_location_idx on public.posts(location);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_user_id_idx on public.posts(user_id);

-- =====================================================
-- BUSINESSES
-- =====================================================

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  owner_name text,
  business_name text not null,
  description text not null,
  category text not null,
  instagram_url text,
  tiktok_url text,
  whatsapp_number text,
  location text,
  logo_url text,
  cover_image_url text,
  status public.content_status not null default 'pending',
  is_featured boolean not null default false,
  source_type public.source_type not null default 'user_submitted',
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_status_idx on public.businesses(status);
create index if not exists businesses_category_idx on public.businesses(category);
create index if not exists businesses_location_idx on public.businesses(location);
create index if not exists businesses_user_id_idx on public.businesses(user_id);

-- =====================================================
-- COMMUNITY TOPICS
-- =====================================================

create table if not exists public.community_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text,
  title text not null,
  category text not null,
  description text not null,
  location text,
  status public.content_status not null default 'pending',
  is_featured boolean not null default false,
  reply_count int not null default 0,
  last_activity_at timestamptz not null default now(),
  source_type public.source_type not null default 'user_submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_topics_status_idx on public.community_topics(status);
create index if not exists community_topics_category_idx on public.community_topics(category);
create index if not exists community_topics_last_activity_idx on public.community_topics(last_activity_at desc);

-- =====================================================
-- COMMUNITY REPLIES
-- =====================================================

create table if not exists public.community_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.community_topics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text,
  message text not null,
  status public.content_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_replies_topic_id_idx on public.community_replies(topic_id);
create index if not exists community_replies_status_idx on public.community_replies(status);

-- =====================================================
-- RECOMMENDATIONS
-- =====================================================

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  category text,
  description text not null,
  location text,
  instagram_url text,
  whatsapp_number text,
  display_name text,
  show_name boolean not null default false,
  status public.content_status not null default 'pending',
  source_type public.source_type not null default 'user_submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recommendations_status_idx on public.recommendations(status);
create index if not exists recommendations_source_idx on public.recommendations(source_type);

-- =====================================================
-- FAVORITES
-- =====================================================

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.item_type not null,
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create index if not exists favorites_user_id_idx on public.favorites(user_id);

-- =====================================================
-- REPORTS
-- =====================================================

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  item_type public.item_type not null,
  item_id uuid not null,
  reason text not null,
  description text,
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists reports_status_idx on public.reports(status);

-- =====================================================
-- ADMIN IMPORTS (WhatsApp aktar)
-- =====================================================

create table if not exists public.admin_imports (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  raw_text text not null,
  cleaned_summary text,
  default_category text,
  default_location text,
  warning_detected boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================
-- CONTACT MESSAGES
-- =====================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- =====================================================
-- TRIGGER'LAR
-- =====================================================

-- 1) Yeni auth.users kaydı geldiğinde profile satırı oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role public.user_role;
begin
  meta_role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'user');
  insert into public.profiles (user_id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'phone',
    meta_role
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) updated_at otomatik güncelle
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();

drop trigger if exists community_topics_set_updated_at on public.community_topics;
create trigger community_topics_set_updated_at before update on public.community_topics
  for each row execute function public.set_updated_at();

drop trigger if exists community_replies_set_updated_at on public.community_replies;
create trigger community_replies_set_updated_at before update on public.community_replies
  for each row execute function public.set_updated_at();

drop trigger if exists recommendations_set_updated_at on public.recommendations;
create trigger recommendations_set_updated_at before update on public.recommendations
  for each row execute function public.set_updated_at();

-- 3) Topluluk cevabı eklendiğinde topic.reply_count ve last_activity_at güncelle
create or replace function public.handle_reply_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' then
    update public.community_topics
      set reply_count = reply_count + 1,
          last_activity_at = now()
      where id = new.topic_id;
  end if;
  return new;
end;
$$;

create or replace function public.handle_reply_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status <> 'approved' and new.status = 'approved' then
    update public.community_topics
      set reply_count = reply_count + 1,
          last_activity_at = now()
      where id = new.topic_id;
  elsif old.status = 'approved' and new.status <> 'approved' then
    update public.community_topics
      set reply_count = greatest(reply_count - 1, 0)
      where id = new.topic_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_reply_insert on public.community_replies;
create trigger on_reply_insert
  after insert on public.community_replies
  for each row execute function public.handle_reply_insert();

drop trigger if exists on_reply_update on public.community_replies;
create trigger on_reply_update
  after update on public.community_replies
  for each row execute function public.handle_reply_update();

-- 4) Admin kontrol için yardımcı
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where user_id = uid and role = 'admin'
  );
$$;
