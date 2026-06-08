-- Dubai Türk Rehberi - Row Level Security politikaları

-- =====================================================
-- RLS aç
-- =====================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.posts enable row level security;
alter table public.businesses enable row level security;
alter table public.community_topics enable row level security;
alter table public.community_replies enable row level security;
alter table public.recommendations enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.admin_imports enable row level security;
alter table public.contact_messages enable row level security;

-- =====================================================
-- PROFILES
-- =====================================================

drop policy if exists profiles_select_public on public.profiles;
create policy profiles_select_public on public.profiles
  for select using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- CATEGORIES & LOCATIONS (public okuma, admin yazma)
-- =====================================================

drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories for select using (true);

drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists locations_select on public.locations;
create policy locations_select on public.locations for select using (true);

drop policy if exists locations_admin on public.locations;
create policy locations_admin on public.locations
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- POSTS
-- =====================================================

drop policy if exists posts_select_approved on public.posts;
create policy posts_select_approved on public.posts
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_admin(auth.uid())
  );

drop policy if exists posts_insert_auth on public.posts;
create policy posts_insert_auth on public.posts
  for insert with check (auth.uid() = user_id);

drop policy if exists posts_update_owner on public.posts;
create policy posts_update_owner on public.posts
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists posts_admin_all on public.posts;
create policy posts_admin_all on public.posts
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists posts_delete_owner on public.posts;
create policy posts_delete_owner on public.posts
  for delete using (auth.uid() = user_id);

-- =====================================================
-- BUSINESSES
-- =====================================================

drop policy if exists businesses_select_approved on public.businesses;
create policy businesses_select_approved on public.businesses
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_admin(auth.uid())
  );

drop policy if exists businesses_insert_auth on public.businesses;
create policy businesses_insert_auth on public.businesses
  for insert with check (auth.uid() = user_id);

drop policy if exists businesses_update_owner on public.businesses;
create policy businesses_update_owner on public.businesses
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists businesses_admin_all on public.businesses;
create policy businesses_admin_all on public.businesses
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop policy if exists businesses_delete_owner on public.businesses;
create policy businesses_delete_owner on public.businesses
  for delete using (auth.uid() = user_id);

-- =====================================================
-- COMMUNITY TOPICS
-- =====================================================

drop policy if exists topics_select_approved on public.community_topics;
create policy topics_select_approved on public.community_topics
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_admin(auth.uid())
  );

drop policy if exists topics_insert_auth on public.community_topics;
create policy topics_insert_auth on public.community_topics
  for insert with check (auth.uid() = user_id);

drop policy if exists topics_admin_all on public.community_topics;
create policy topics_admin_all on public.community_topics
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- COMMUNITY REPLIES
-- =====================================================

drop policy if exists replies_select_approved on public.community_replies;
create policy replies_select_approved on public.community_replies
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_admin(auth.uid())
  );

drop policy if exists replies_insert_auth on public.community_replies;
create policy replies_insert_auth on public.community_replies
  for insert with check (auth.uid() = user_id);

drop policy if exists replies_admin_all on public.community_replies;
create policy replies_admin_all on public.community_replies
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- RECOMMENDATIONS
-- =====================================================

drop policy if exists recommendations_select_approved on public.recommendations;
create policy recommendations_select_approved on public.recommendations
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_admin(auth.uid())
  );

drop policy if exists recommendations_insert_anon on public.recommendations;
create policy recommendations_insert_anon on public.recommendations
  for insert with check (
    (auth.uid() is null and user_id is null)
    or auth.uid() = user_id
  );

drop policy if exists recommendations_admin_all on public.recommendations;
create policy recommendations_admin_all on public.recommendations
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- FAVORITES
-- =====================================================

drop policy if exists favorites_select_self on public.favorites;
create policy favorites_select_self on public.favorites
  for select using (auth.uid() = user_id);

drop policy if exists favorites_insert_self on public.favorites;
create policy favorites_insert_self on public.favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists favorites_delete_self on public.favorites;
create policy favorites_delete_self on public.favorites
  for delete using (auth.uid() = user_id);

drop policy if exists favorites_admin on public.favorites;
create policy favorites_admin on public.favorites
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- REPORTS
-- =====================================================

drop policy if exists reports_insert_anyone on public.reports;
create policy reports_insert_anyone on public.reports
  for insert with check (true);

drop policy if exists reports_select_self on public.reports;
create policy reports_select_self on public.reports
  for select using (auth.uid() = user_id);

drop policy if exists reports_admin_all on public.reports;
create policy reports_admin_all on public.reports
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- ADMIN IMPORTS
-- =====================================================

drop policy if exists admin_imports_admin_only on public.admin_imports;
create policy admin_imports_admin_only on public.admin_imports
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =====================================================
-- CONTACT MESSAGES
-- =====================================================

drop policy if exists contact_insert_anyone on public.contact_messages;
create policy contact_insert_anyone on public.contact_messages
  for insert with check (true);

drop policy if exists contact_admin_select on public.contact_messages;
create policy contact_admin_select on public.contact_messages
  for select using (public.is_admin(auth.uid()));
