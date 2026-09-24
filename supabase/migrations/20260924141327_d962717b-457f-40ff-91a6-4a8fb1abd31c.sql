CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('contact','project')),
  lang text NOT NULL DEFAULT 'fr',
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  organisation text CHECK (char_length(organisation) <= 200),
  project_name text CHECK (char_length(project_name) <= 200),
  country text CHECK (char_length(country) <= 100),
  sector text CHECK (char_length(sector) <= 100),
  stage text CHECK (char_length(stage) <= 100),
  link text CHECK (char_length(link) <= 500),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  attachment_path text CHECK (char_length(attachment_path) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submissions TO anon, authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can upload attachments" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'attachments');