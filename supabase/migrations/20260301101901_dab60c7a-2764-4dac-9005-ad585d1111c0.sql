
-- Create mine_sites registry table
CREATE TABLE public.mine_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  country TEXT,
  mine_type TEXT DEFAULT 'coal',
  dataset_status TEXT DEFAULT 'pending',
  data_quality_score DOUBLE PRECISION,
  total_records INTEGER DEFAULT 0,
  completeness_pct DOUBLE PRECISION,
  validation_report JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mine_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mine sites are viewable by everyone" ON public.mine_sites FOR SELECT USING (true);
CREATE POLICY "Anyone can insert mine sites" ON public.mine_sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update mine sites" ON public.mine_sites FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete mine sites" ON public.mine_sites FOR DELETE USING (true);

-- Storage bucket for CSV uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('training-csvs', 'training-csvs', true);

CREATE POLICY "Anyone can upload training CSVs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'training-csvs');
CREATE POLICY "Anyone can read training CSVs" ON storage.objects FOR SELECT USING (bucket_id = 'training-csvs');
CREATE POLICY "Anyone can delete training CSVs" ON storage.objects FOR DELETE USING (bucket_id = 'training-csvs');

-- Add mine_site_id to training_data
ALTER TABLE public.training_data ADD COLUMN mine_site_id UUID REFERENCES public.mine_sites(id);

-- Update trigger for mine_sites
CREATE OR REPLACE FUNCTION public.update_mine_sites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_mine_sites_updated_at
BEFORE UPDATE ON public.mine_sites
FOR EACH ROW
EXECUTE FUNCTION public.update_mine_sites_updated_at();
