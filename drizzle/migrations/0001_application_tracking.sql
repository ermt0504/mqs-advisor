ALTER TABLE public.submissions ADD COLUMN status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','interview','rejected'));

CREATE TABLE public.submission_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  happens_at timestamptz NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.submission_events TO service_role;
ALTER TABLE public.submission_events ENABLE ROW LEVEL SECURITY;