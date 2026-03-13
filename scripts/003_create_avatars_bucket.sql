-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to avatars
CREATE POLICY "avatars_public_read" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "avatars_user_upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to update their own avatars
CREATE POLICY "avatars_user_update" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to delete their own avatars
CREATE POLICY "avatars_user_delete" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);
