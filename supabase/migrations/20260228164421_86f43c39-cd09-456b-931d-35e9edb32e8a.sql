
-- Create table for storing uploaded training datasets
CREATE TABLE public.training_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_name text NOT NULL,
  site_name text NOT NULL DEFAULT 'Jharia Mine',
  date text NOT NULL,
  lst double precision,
  ndvi double precision,
  rainfall double precision,
  slope double precision,
  soil_moisture double precision,
  twi double precision,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.training_data ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Training data is viewable by everyone"
ON public.training_data FOR SELECT USING (true);

-- Public insert access
CREATE POLICY "Anyone can insert training data"
ON public.training_data FOR INSERT WITH CHECK (true);

-- Public delete for managing datasets
CREATE POLICY "Anyone can delete training data"
ON public.training_data FOR DELETE USING (true);

-- Create table for storing training results / model runs
CREATE TABLE public.training_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_name text NOT NULL,
  model_name text NOT NULL,
  metrics jsonb NOT NULL DEFAULT '{}',
  predictions jsonb NOT NULL DEFAULT '[]',
  feature_importance jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.training_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Training runs are viewable by everyone"
ON public.training_runs FOR SELECT USING (true);

CREATE POLICY "Anyone can insert training runs"
ON public.training_runs FOR INSERT WITH CHECK (true);
