-- WARNING: This will delete ALL reports and report images.
-- Only run this if you want to wipe the app's content.

-- 1. Truncate the reports table (cascades to any related votes/comments if they exist)
TRUNCATE TABLE public.reports RESTART IDENTITY CASCADE;

-- 2. (Optional) Clear storage objects if you have admin access
-- DELETE FROM storage.objects WHERE bucket_id = 'report-images';

-- 3. (Optional) Reset users is tricky because of Supabase Auth.
-- It is recommended to manually delete users in the Authentication tab if needed.

SELECT 'Database cleared successfully. All reports deleted.' as status;
