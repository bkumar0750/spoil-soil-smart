import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Play, Loader2, Database, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseCSV, type TrainingRow } from "@/lib/csv-validator";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface TrainingResult {
  success: boolean;
  training_samples: number;
  prediction_samples: number;
  predictions: { date: string; predicted_sm: number }[];
  metrics: { r2: number; rmse: number; mae: number; nse?: number };
  feature_importance: { feature: string; importance: number }[];
  model_summary: string;
}

const MineTrainingPage = () => {
  const { mineId } = useParams<{ mineId: string }>();
  const isJharia = mineId === 'jharia';

  const [mineName, setMineName] = useState(isJharia ? 'Jharia Coalfield' : '');
  const [csvData, setCsvData] = useState<TrainingRow[]>([]);
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [pastRuns, setPastRuns] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isJharia) {
      fetch('/data/jharia-training-data.csv')
        .then(res => res.text())
        .then(text => setCsvData(parseCSV(text)))
        .catch(err => console.error('Failed to load CSV:', err));
    } else if (mineId) {
      loadMineData(mineId);
    }
    loadPastRuns();
  }, [mineId]);

  const loadMineData = async (id: string) => {
    const { data: mine } = await supabase.from('mine_sites').select('*').eq('id', id).single();
    if (mine) setMineName((mine as any).name);
    const { data: rows } = await supabase.from('training_data').select('*').eq('mine_site_id', id).order('date');
    if (rows) {
      setCsvData(rows.map(r => ({
        date: r.date, lst: r.lst, ndvi: r.ndvi, rainfall: r.rainfall,
        slope: r.slope, soil_moisture: r.soil_moisture, twi: r.twi,
      })));
    }
  };

  const loadPastRuns = async () => {
    const query = supabase.from('training_runs').select('*').order('created_at', { ascending: false }).limit(5);
    if (isJharia) {
      query.eq('dataset_name', 'Jharia_2015_2024');
    } else if (mineId) {
      query.like('dataset_name', `%${mineId}%`);
    }
    const { data } = await query;
    if (data) setPastRuns(data);
  };

  const handleTrain = async () => {
    if (csvData.length === 0) return;
    setTraining(true);
    try {
      const datasetName = isJharia ? 'Jharia_2015_2024' : `${mineName}_${mineId}`;
      const { data, error } = await supabase.functions.invoke('train-model', {
        body: { data: csvData, datasetName },
      });
      if (error) throw error;
      setResult(data);
      toast({ title: "Training Complete", description: `R² = ${data.metrics?.r2?.toFixed(3)} | Predicted ${data.prediction_samples} missing values` });
      loadPastRuns();
    } catch (error) {
      console.error('Training error:', error);
      toast({ title: "Training Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setTraining(false);
    }
  };

  const withSM = csvData.filter(r => r.soil_moisture != null);
  const withoutSM = csvData.filter(r => r.soil_moisture == null);

  const timeSeriesData = csvData.map(row => {
    const pred = result?.predictions?.find(p => p.date === row.date);
    return {
      date: row.date,
      lst: row.lst ? +row.lst.toFixed(1) : null,
      ndvi: row.ndvi ? +row.ndvi.toFixed(3) : null,
      rainfall: row.rainfall ? +(row.rainfall * 1000).toFixed(1) : null,
      soil_moisture: row.soil_moisture ? +row.soil_moisture.toFixed(2) : null,
      predicted_sm: pred ? +pred.predicted_sm.toFixed(2) : null,
    };
  });

  return (
    <div className="container py-10 md:py-16 space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/model">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> All Mines
          </Button>
        </Link>
        <Badge variant="outline">ML Pipeline</Badge>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{mineName}</h1>
        <p className="text-muted-foreground">
          {csvData.length} observations · {withSM.length} with soil moisture · {withoutSM.length} to predict
        </p>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="data">Dataset</TabsTrigger>
          <TabsTrigger value="train">Train Model</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
        </TabsList>

        {/* Dataset Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{mineName} Dataset</CardTitle>
                  <CardDescription>{csvData.length} monthly observations · {withSM.length} with SM · {withoutSM.length} to predict</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                {csvData.length > 0 ? [
                  { label: "LST (°C)", value: `${Math.min(...csvData.filter(r => r.lst).map(r => r.lst!)).toFixed(0)}–${Math.max(...csvData.filter(r => r.lst).map(r => r.lst!)).toFixed(0)}` },
                  { label: "NDVI", value: `${Math.min(...csvData.filter(r => r.ndvi).map(r => r.ndvi!)).toFixed(2)}–${Math.max(...csvData.filter(r => r.ndvi).map(r => r.ndvi!)).toFixed(2)}` },
                  { label: "Rainfall", value: `${(Math.max(...csvData.filter(r => r.rainfall).map(r => r.rainfall!)) * 1000).toFixed(0)} mm max` },
                  { label: "Slope", value: `${csvData[0]?.slope?.toFixed(1)}°` },
                  { label: "SM Range", value: withSM.length > 0 ? `${Math.min(...withSM.map(r => r.soil_moisture!)).toFixed(1)}–${Math.max(...withSM.map(r => r.soil_moisture!)).toFixed(1)}` : 'N/A' },
                  { label: "TWI", value: `${csvData[0]?.twi?.toFixed(1)}` },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                    <p className="font-bold text-sm mt-0.5">{s.value}</p>
                  </div>
                )) : <p className="col-span-6 text-muted-foreground text-sm">Loading data...</p>}
              </div>
            </CardContent>
          </Card>

          {csvData.length > 0 && (
            <>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Soil Moisture & NDVI Time Series</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis yAxisId="sm" domain={[0, 30]} label={{ value: 'SM (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <YAxis yAxisId="ndvi" orientation="right" domain={[0, 0.8]} label={{ value: 'NDVI', angle: 90, position: 'insideRight', style: { fontSize: 11 } }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="sm" type="monotone" dataKey="soil_moisture" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Soil Moisture (%)" connectNulls={false} />
                      {result && <Line yAxisId="sm" type="monotone" dataKey="predicted_sm" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted SM (%)" connectNulls={false} />}
                      <Line yAxisId="ndvi" type="monotone" dataKey="ndvi" stroke="hsl(var(--chart-2))" strokeWidth={1.5} dot={false} name="NDVI" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">LST & Rainfall Time Series</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis yAxisId="lst" domain={[15, 50]} label={{ value: 'LST (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <YAxis yAxisId="rain" orientation="right" domain={[0, 800]} label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="lst" type="monotone" dataKey="lst" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} name="LST (°C)" />
                      <Line yAxisId="rain" type="monotone" dataKey="rainfall" stroke="hsl(var(--chart-1))" strokeWidth={1.5} dot={false} name="Rainfall (mm)" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Data Preview (first 20 rows)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['Date', 'LST (°C)', 'NDVI', 'Rainfall', 'Slope', 'SM', 'TWI'].map(h => (
                        <th key={h} className="text-left p-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                        <td className="p-2 font-mono text-xs">{row.date}</td>
                        <td className="p-2 text-xs">{row.lst?.toFixed(1) ?? '–'}</td>
                        <td className="p-2 text-xs">{row.ndvi?.toFixed(3) ?? '–'}</td>
                        <td className="p-2 text-xs">{row.rainfall?.toFixed(4) ?? '–'}</td>
                        <td className="p-2 text-xs">{row.slope?.toFixed(1) ?? '–'}</td>
                        <td className="p-2 text-xs">
                          {row.soil_moisture != null ? (
                            <span className="text-primary font-medium">{row.soil_moisture.toFixed(2)}</span>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">missing</Badge>
                          )}
                        </td>
                        <td className="p-2 text-xs">{row.twi?.toFixed(1) ?? '–'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Train Tab */}
        <TabsContent value="train" className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Train Soil Moisture Model</CardTitle>
                  <CardDescription>{withSM.length} training samples → predict {withoutSM.length} missing values</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Training Samples", value: withSM.length, color: "text-primary" },
                  { label: "Missing SM", value: withoutSM.length, color: "text-destructive" },
                  { label: "Features", value: 5, color: "" },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/40 text-center">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <Button onClick={handleTrain} disabled={training || csvData.length === 0} className="w-full" size="lg">
                {training ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Training...</> : <><Play className="mr-2 h-5 w-5" />Train Model on {mineName}</>}
              </Button>
              {training && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Analyzing {csvData.length} observations...</p>
                  <Progress value={65} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {pastRuns.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Previous Runs</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {pastRuns.map((run, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border">
                    <div>
                      <p className="font-medium text-sm">{run.model_name}</p>
                      <p className="text-xs text-muted-foreground">{run.dataset_name} · {new Date(run.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {run.metrics && typeof run.metrics === 'object' && (
                        <>
                          <Badge variant="secondary" className="text-xs">R² {(run.metrics as any).r2?.toFixed(3)}</Badge>
                          <Badge variant="outline" className="text-xs">RMSE {(run.metrics as any).rmse?.toFixed(3)}</Badge>
                        </>
                      )}
                      <Badge variant={run.status === 'completed' ? 'default' : 'secondary'} className="text-xs">{run.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {result ? (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "R² Score", value: result.metrics.r2?.toFixed(3), highlight: true },
                  { label: "RMSE", value: result.metrics.rmse?.toFixed(3) },
                  { label: "MAE", value: result.metrics.mae?.toFixed(3) },
                  { label: "NSE", value: result.metrics.nse?.toFixed(3) ?? 'N/A', highlight: true },
                ].map((m, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6 text-center">
                      <p className={`text-3xl font-bold ${m.highlight ? "text-primary" : ""}`}>{m.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Observed vs Predicted Soil Moisture</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsLineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis domain={[0, 30]} label={{ value: 'SM (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="soil_moisture" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2 }} name="Observed SM" connectNulls={false} />
                      <Line type="monotone" dataKey="predicted_sm" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 2 }} name="Predicted SM" connectNulls={false} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {result.feature_importance?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Feature Importance</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={result.feature_importance.sort((a, b) => b.importance - a.importance)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <YAxis type="category" dataKey="feature" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                        <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Model Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.model_summary}</p>
                  <div className="mt-3 flex gap-2">
                    <Badge className="text-xs">Training: {result.training_samples} samples</Badge>
                    <Badge variant="outline" className="text-xs">Predicted: {result.prediction_samples} values</Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="py-16 text-center">
              <CardContent>
                <Brain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="font-medium">No Results Yet</p>
                <p className="text-sm text-muted-foreground mt-1">Go to the Train Model tab to run training</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Methodology Tab */}
        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Methodology — {mineName}</CardTitle>
              <CardDescription>End-to-end pipeline for soil moisture prediction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { step: "1. Data Collection", tasks: ["Monthly composites: Sentinel-2 (NDVI), MODIS (LST), CHIRPS (Rainfall)", "SRTM DEM-derived Slope and TWI", "ERA5 soil moisture reanalysis as target variable"] },
                { step: "2. Feature Engineering", tasks: ["LST: Land Surface Temperature — thermal driver", "NDVI: Vegetation greenness, correlates with SM retention", "Rainfall: Strongest SM predictor", "Slope & TWI: Topographic water flow controls"] },
                { step: "3. Data Validation", tasks: ["Range checks: NDVI [-1,1], LST [-30,70°C], SM [0,100%]", "Outlier detection via Z-score analysis", "Completeness scoring and quality grade (A–F)"] },
                { step: "4. Model Training", tasks: [`AI-ensemble trained on ${withSM.length} known SM samples`, "Multi-variate regression: LST, NDVI, Rainfall, Slope, TWI → SM", "Accounts for seasonal patterns and thermal effects"] },
                { step: "5. Validation", tasks: ["Cross-validation R², RMSE, MAE metrics", "Predicted SM for reclamation suitability", "Results stored for comparison across mine sites"] },
              ].map((phase, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2"><CardTitle className="text-base">{phase.step}</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm">
                      {phase.tasks.map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MineTrainingPage;
