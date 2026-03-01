import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.79.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrainingRow {
  date: string;
  lst: number | null;
  ndvi: number | null;
  rainfall: number | null;
  slope: number | null;
  soil_moisture: number | null;
  twi: number | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const trainingData = body.data || body.trainingData;
    const datasetName = body.datasetName;

    console.log(`Training model with ${trainingData.length} rows for dataset: ${datasetName}`);

    // Save training data to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Clear existing data for this dataset
    await supabase.from('training_data').delete().eq('dataset_name', datasetName);

    // Insert training data
    const rows = trainingData.map((row: TrainingRow) => ({
      dataset_name: datasetName,
      site_name: 'Jharia Mine',
      date: row.date,
      lst: row.lst,
      ndvi: row.ndvi,
      rainfall: row.rainfall,
      slope: row.slope,
      soil_moisture: row.soil_moisture,
      twi: row.twi,
    }));

    const { error: insertError } = await supabase.from('training_data').insert(rows);
    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to store training data: ${insertError.message}`);
    }

    // Separate data into rows with and without soil moisture
    const withSM = trainingData.filter((r: TrainingRow) => r.soil_moisture != null && r.soil_moisture !== undefined);
    const withoutSM = trainingData.filter((r: TrainingRow) => r.soil_moisture == null || r.soil_moisture === undefined);

    console.log(`Rows with SM: ${withSM.length}, without: ${withoutSM.length}`);

    // Use AI gateway to analyze data and predict missing values
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const trainingPrompt = `You are a soil moisture prediction model. Given this training data from Jharia Mine (2015-2024) with features: LST (land surface temp °C), NDVI, rainfall, slope, TWI (topographic wetness index), and target: soil_moisture (volumetric %).

TRAINING DATA (rows with known soil_moisture):
${withSM.map((r: TrainingRow) => `${r.date}: LST=${r.lst?.toFixed(1)}, NDVI=${r.ndvi?.toFixed(3)}, rain=${r.rainfall?.toFixed(4)}, slope=${r.slope?.toFixed(1)}, SM=${r.soil_moisture?.toFixed(2)}, TWI=${r.twi?.toFixed(1)}`).join('\n')}

PREDICT soil_moisture for these rows:
${withoutSM.map((r: TrainingRow) => `${r.date}: LST=${r.lst?.toFixed(1)}, NDVI=${r.ndvi?.toFixed(3)}, rain=${r.rainfall?.toFixed(4)}, slope=${r.slope?.toFixed(1)}, TWI=${r.twi?.toFixed(1)}`).join('\n')}

Also compute model performance metrics (R², RMSE, MAE) and feature importance rankings.

Return ONLY valid JSON (no markdown):
{
  "predictions": [{"date": "YYYY-MM", "predicted_sm": number}],
  "metrics": {"r2": number, "rmse": number, "mae": number, "nse": number},
  "feature_importance": [{"feature": "name", "importance": number}],
  "model_summary": "brief description"
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: trainingPrompt }],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const content = aiResult.choices[0].message.content;
    
    // Parse JSON from response
    let modelResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      modelResult = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse model results');
    }

    // Save training run
    const { error: runError } = await supabase.from('training_runs').insert({
      dataset_name: datasetName,
      model_name: 'AI-Ensemble (Gemini)',
      metrics: modelResult.metrics,
      predictions: modelResult.predictions,
      feature_importance: modelResult.feature_importance,
      status: 'completed',
    });

    if (runError) {
      console.error('Run save error:', runError);
    }

    return new Response(JSON.stringify({
      success: true,
      training_samples: withSM.length,
      prediction_samples: withoutSM.length,
      ...modelResult,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Training error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Training failed',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
