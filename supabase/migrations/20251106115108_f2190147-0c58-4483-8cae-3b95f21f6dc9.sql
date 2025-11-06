-- Create table for storing analysis results
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT,
  soil_moisture JSONB NOT NULL,
  vegetation_indices JSONB NOT NULL,
  soil_properties JSONB NOT NULL,
  growth_potential JSONB NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read analysis results
CREATE POLICY "Analysis results are viewable by everyone" 
ON public.analysis_results 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert analysis results
CREATE POLICY "Anyone can insert analysis results" 
ON public.analysis_results 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries by location
CREATE INDEX idx_analysis_results_location ON public.analysis_results(latitude, longitude);

-- Create index for faster queries by date
CREATE INDEX idx_analysis_results_analyzed_at ON public.analysis_results(analyzed_at DESC);