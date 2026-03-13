-- Create storage bucket for tracks
INSERT INTO storage.buckets (id, name, public)
VALUES ('tracks', 'tracks', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'tracks');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'tracks'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'tracks'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'tracks'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add plays_count column if not exists
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS plays_count INTEGER DEFAULT 0;
