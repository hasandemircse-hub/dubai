-- Dubai Türk Rehberi - Storage buckets ve politikaları

-- Bucket'ları oluştur (varsa atla)
insert into storage.buckets (id, name, public)
values
  ('post-images', 'post-images', true),
  ('business-images', 'business-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- =====================================================
-- POST IMAGES
-- =====================================================

drop policy if exists "post_images_public_select" on storage.objects;
create policy "post_images_public_select" on storage.objects
  for select using (bucket_id = 'post-images');

drop policy if exists "post_images_auth_insert" on storage.objects;
create policy "post_images_auth_insert" on storage.objects
  for insert with check (
    bucket_id = 'post-images'
    and auth.role() = 'authenticated'
  );

drop policy if exists "post_images_owner_update" on storage.objects;
create policy "post_images_owner_update" on storage.objects
  for update using (
    bucket_id = 'post-images' and auth.uid() = owner
  );

drop policy if exists "post_images_owner_delete" on storage.objects;
create policy "post_images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'post-images' and (auth.uid() = owner or public.is_admin(auth.uid()))
  );

-- =====================================================
-- BUSINESS IMAGES
-- =====================================================

drop policy if exists "business_images_public_select" on storage.objects;
create policy "business_images_public_select" on storage.objects
  for select using (bucket_id = 'business-images');

drop policy if exists "business_images_auth_insert" on storage.objects;
create policy "business_images_auth_insert" on storage.objects
  for insert with check (
    bucket_id = 'business-images'
    and auth.role() = 'authenticated'
  );

drop policy if exists "business_images_owner_update" on storage.objects;
create policy "business_images_owner_update" on storage.objects
  for update using (
    bucket_id = 'business-images' and auth.uid() = owner
  );

drop policy if exists "business_images_owner_delete" on storage.objects;
create policy "business_images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'business-images' and (auth.uid() = owner or public.is_admin(auth.uid()))
  );

-- =====================================================
-- AVATARS
-- =====================================================

drop policy if exists "avatars_public_select" on storage.objects;
create policy "avatars_public_select" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_auth_insert" on storage.objects;
create policy "avatars_auth_insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars' and auth.uid() = owner
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (auth.uid() = owner or public.is_admin(auth.uid()))
  );
