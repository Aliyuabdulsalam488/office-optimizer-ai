-- Update storage policies for CVs bucket to allow public uploads
-- Allow anyone to upload CVs
CREATE POLICY "Anyone can upload CVs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'cvs');

-- Allow public read access to CVs
CREATE POLICY "CVs are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'cvs');