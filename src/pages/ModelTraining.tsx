import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, LineChart, Target, TrendingUp, Zap, Upload, Play, Loader2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ZAxis } from "recharts";

interface TrainingRow {
  date: string;
  lst: number | null;
  ndvi: number | null;
  rainfall: number | null;
  slope: number | null;
  soil_moisture: number | null;
  twi: number | null;
}

interface TrainingResult {
  success: boolean;
  training_samples: number;
  prediction_samples: number;
  predictions: { date: string; predicted_sm: number }[];
  metrics: { r2: number; rmse: number; mae: number; nse?: number };
  feature_importance: { feature: string; importance: number }[];
  model_summary: string;
}

const parseCSV = (text: string): TrainingRow[] => {
  const lines = text.trim().split('\n');
  const rows: TrainingRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    rows.push({
      date: cols[1],
      lst: cols[2] ? parseFloat(cols[2]) : null,
      ndvi: cols[3] ? parseFloat(cols[3]) : null,
      rainfall: cols[4] ? parseFloat(cols[4]) : null,
      slope: cols[5] ? parseFloat(cols[5]) : null,
      soil_moisture: cols[6] ? parseFloat(cols[6]) : null,
      twi: cols[7] ? parseFloat(cols[7]) : null,
    });
  }
  return rows;
};

const ModelTraining = () => {
  const [csvData, setCsvData] = useState<TrainingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [pastRuns, setPastRuns] = useState<any[]>([]);
  const { toast } = useToast();

  // Load bundled Jharia data on mount
  useEffect(() => {
    fetch('/data/jharia-training-data.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = parseCSV(text);
        setCsvData(parsed);
      })
      .catch(err => console.error('Failed to load CSV:', err));

    // Load past training runs
    supabase.from('training_runs').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => {
        if (data) setPastRuns(data);
      });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setCsvData(parsed);
      setResult(null);
      setLoading(false);
      toast({ title: "Data Loaded", description: `${parsed.length} rows parsed from ${file.name}` });
    };
    reader.readAsText(file);
  };

  const handleTrain = async () => {
    if (csvData.length === 0) return;
    setTraining(true);
    try {
      const { data, error } = await supabase.functions.invoke('train-model', {
        body: { data: csvData, datasetName: 'Jharia_2015_2024' },
      });
      if (error) throw error;
      setResult(data);
      toast({ title: "Training Complete", description: `R² = ${data.metrics?.r2?.toFixed(3)} | Predicted ${data.prediction_samples} missing values` });
      
      // Refresh past runs
      const { data: runs } = await supabase.from('training_runs').select('*').order('created_at', { ascending: false }).limit(5);
      if (runs) setPastRuns(runs);
    } catch (error) {
      console.error('Training error:', error);
      toast({ title: "Training Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setTraining(false);
    }
  };

  // Prepare chart data
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

  const withSM = csvData.filter(r => r.soil_moisture != null);
  const withoutSM = csvData.filter(r => r.soil_moisture == null);

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Model Training — Jharia Mine</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Train ML models on real Jharia mine multi-variable time-series data (2015–2024) to predict soil moisture from LST, NDVI, rainfall, slope, and TWI.
        </p>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="data">Dataset</TabsTrigger>
          <TabsTrigger value="train">Train Model</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
        </TabsList>

        {/* === DATASET TAB === */}
        <TabsContent value="data" className="space-y-6">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle>Jharia Mine Dataset</CardTitle>
                  <CardDescription>
                    {csvData.length} monthly observations | {withSM.length} with soil moisture | {withoutSM.length} to predict
                  </CardDescription>
                </div>
                <label>
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  <Button variant="outline" asChild>
                    <span><Upload className="h-4 w-4 mr-2" />Upload CSV</span>
                  </Button>
                </label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                {[
                  { label: "LST (°C)", value: csvData.length > 0 ? `${Math.min(...csvData.filter(r => r.lst).map(r => r.lst!)).toFixed(0)}–${Math.max(...csvData.filter(r => r.lst).map(r => r.lst!)).toFixed(0)}` : '-' },
                  { label: "NDVI", value: csvData.length > 0 ? `${Math.min(...csvData.filter(r => r.ndvi).map(r => r.ndvi!)).toFixed(2)}–${Math.max(...csvData.filter(r => r.ndvi).map(r => r.ndvi!)).toFixed(2)}` : '-' },
                  { label: "Rainfall", value: csvData.length > 0 ? `${(Math.max(...csvData.filter(r => r.rainfall).map(r => r.rainfall!)) * 1000).toFixed(0)} mm max` : '-' },
                  { label: "Slope", value: csvData.length > 0 ? `${csvData[0]?.slope?.toFixed(1)}°` : '-' },
                  { label: "SM Range", value: withSM.length > 0 ? `${Math.min(...withSM.map(r => r.soil_moisture!)).toFixed(1)}–${Math.max(...withSM.map(r => r.soil_moisture!)).toFixed(1)}` : '-' },
                  { label: "TWI", value: csvData.length > 0 ? `${csvData[0]?.twi?.toFixed(1)}` : '-' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-sm">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Series Charts */}
          {csvData.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Soil Moisture & NDVI Time Series</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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
                <CardHeader>
                  <CardTitle className="text-lg">LST & Rainfall Time Series</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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

          {/* Data Table Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Preview (first 20 rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['Date', 'LST (°C)', 'NDVI', 'Rainfall', 'Slope', 'SM', 'TWI'].map(h => (
                        <th key={h} className="text-left p-2 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-b border-muted/30">
                        <td className="p-2 font-mono text-xs">{row.date}</td>
                        <td className="p-2">{row.lst?.toFixed(1) ?? '-'}</td>
                        <td className="p-2">{row.ndvi?.toFixed(3) ?? '-'}</td>
                        <td className="p-2">{row.rainfall?.toFixed(4) ?? '-'}</td>
                        <td className="p-2">{row.slope?.toFixed(1) ?? '-'}</td>
                        <td className="p-2">
                          {row.soil_moisture != null ? (
                            <span className="text-primary font-medium">{row.soil_moisture.toFixed(2)}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs">missing</Badge>
                          )}
                        </td>
                        <td className="p-2">{row.twi?.toFixed(1) ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === TRAIN TAB === */}
        <TabsContent value="train" className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle>Train Soil Moisture Model</CardTitle>
                  <CardDescription>
                    Uses {withSM.length} training samples with known SM to predict {withoutSM.length} missing values. 
                    Features: LST, NDVI, Rainfall, Slope, TWI → Target: Soil Moisture
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-primary">{withSM.length}</p>
                  <p className="text-sm text-muted-foreground">Training Samples</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-destructive">{withoutSM.length}</p>
                  <p className="text-sm text-muted-foreground">Missing SM (to predict)</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Input Features</p>
                </div>
              </div>

              <Button onClick={handleTrain} disabled={training || csvData.length === 0} className="w-full" size="lg">
                {training ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Training Model...</>
                ) : (
                  <><Play className="mr-2 h-5 w-5" />Train Model on Jharia Data</>
                )}
              </Button>

              {training && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Analyzing {csvData.length} monthly observations and predicting missing soil moisture...</p>
                  <Progress value={65} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Training Runs */}
          {pastRuns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Previous Training Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastRuns.map((run, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{run.model_name}</p>
                        <p className="text-xs text-muted-foreground">{run.dataset_name} • {new Date(run.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-3">
                        {run.metrics && typeof run.metrics === 'object' && (
                          <>
                            <Badge variant="secondary">R² {(run.metrics as any).r2?.toFixed(3)}</Badge>
                            <Badge variant="outline">RMSE {(run.metrics as any).rmse?.toFixed(3)}</Badge>
                          </>
                        )}
                        <Badge variant={run.status === 'completed' ? 'default' : 'secondary'}>{run.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* === RESULTS TAB === */}
        <TabsContent value="results" className="space-y-6">
          {result ? (
            <>
              {/* Metrics Summary */}
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "R² Score", value: result.metrics.r2?.toFixed(3), color: "text-primary" },
                  { label: "RMSE", value: result.metrics.rmse?.toFixed(3), color: "" },
                  { label: "MAE", value: result.metrics.mae?.toFixed(3), color: "" },
                  { label: "NSE", value: result.metrics.nse?.toFixed(3) ?? 'N/A', color: "text-primary" },
                ].map((m, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6 text-center">
                      <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Predicted vs Observed Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Observed vs Predicted Soil Moisture</CardTitle>
                  <CardDescription>Solid line = observed, dashed = AI-predicted for missing months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsLineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis domain={[0, 30]} label={{ value: 'SM (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="soil_moisture" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2 }} name="Observed SM (%)" connectNulls={false} />
                      <Line type="monotone" dataKey="predicted_sm" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 2 }} name="Predicted SM (%)" connectNulls={false} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Feature Importance */}
              {result.feature_importance?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Feature Importance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={result.feature_importance.sort((a, b) => b.importance - a.importance)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <YAxis type="category" dataKey="feature" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                        <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Model Summary */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Model Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.model_summary}</p>
                  <div className="mt-3 flex gap-2">
                    <Badge>Training: {result.training_samples} samples</Badge>
                    <Badge variant="outline">Predicted: {result.prediction_samples} missing values</Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="py-16 text-center">
              <CardContent>
                <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No Training Results Yet</p>
                <p className="text-muted-foreground mt-1">Go to the Train Model tab to run training on the Jharia dataset</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* === METHODOLOGY TAB === */}
        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Methodology — Jharia Mine</CardTitle>
              <CardDescription>End-to-end pipeline for soil moisture prediction from multi-variable time-series data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  step: "1. Data Collection (GEE Export)",
                  tasks: [
                    "Monthly composites from Sentinel-2 (NDVI), MODIS (LST), CHIRPS (Rainfall)",
                    "SRTM DEM-derived slope and TWI (Topographic Wetness Index)",
                    "ERA5 soil moisture reanalysis as target variable (2015–2024)",
                    "Jharia Coalfield study area (~23.75°N, 86.42°E)",
                  ],
                },
                {
                  step: "2. Feature Engineering",
                  tasks: [
                    "LST: Land Surface Temperature (°C) — primary thermal driver",
                    "NDVI: Vegetation greenness proxy, correlates with SM retention",
                    "Rainfall: Monthly cumulative precipitation, strongest SM predictor",
                    "Slope & TWI: Topographic controls on water flow and accumulation",
                  ],
                },
                {
                  step: "3. Model Training",
                  tasks: [
                    "AI-ensemble model trained on rows with known soil_moisture (n=" + withSM.length + ")",
                    "Multi-variate regression: LST, NDVI, rainfall, slope, TWI → SM",
                    "Learns seasonal patterns: monsoon peaks, dry-season lows",
                    "Accounts for thermal stress effects (LST negative correlation with SM)",
                  ],
                },
                {
                  step: "4. Gap-Filling & Prediction",
                  tasks: [
                    "Predicts soil_moisture for " + withoutSM.length + " months with missing values",
                    "Fills 2021–2024 gap where ERA5 SM data is unavailable",
                    "Provides complete 10-year SM time series for trend analysis",
                    "Uncertainty quantification via model confidence metrics",
                  ],
                },
                {
                  step: "5. Validation & Application",
                  tasks: [
                    "Cross-validation R², RMSE, MAE on training split",
                    "Predicted SM used for reclamation suitability assessment",
                    "Seasonal SM patterns guide optimal planting windows",
                    "Results stored in database for comparison and export",
                  ],
                },
              ].map((phase, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{phase.step}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {phase.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{task}</span>
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

export default ModelTraining;
