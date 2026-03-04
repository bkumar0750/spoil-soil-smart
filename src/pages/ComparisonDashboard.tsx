import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Cell,
} from "recharts";

interface RunData {
  id: string;
  dataset_name: string;
  model_name: string;
  metrics: { r2?: number; rmse?: number; mae?: number; nse?: number };
  feature_importance: { feature: string; importance: number }[];
  created_at: string;
  status: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const ComparisonDashboard = () => {
  const [runs, setRuns] = useState<RunData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("training_runs")
        .select("*")
        .eq("status", "completed")
        .order("created_at", { ascending: false });
      if (data) {
        // Deduplicate: keep latest run per dataset
        const seen = new Map<string, RunData>();
        for (const run of data) {
          const r = run as unknown as RunData;
          if (!seen.has(r.dataset_name)) seen.set(r.dataset_name, r);
        }
        setRuns(Array.from(seen.values()));
      }
      setLoading(false);
    };
    load();
  }, []);

  const metricsData = useMemo(() =>
    runs.map((r) => ({
      name: r.dataset_name.replace(/_/g, " "),
      "R²": r.metrics.r2 ?? 0,
      RMSE: r.metrics.rmse ?? 0,
      MAE: r.metrics.mae ?? 0,
      NSE: r.metrics.nse ?? 0,
    })),
  [runs]);

  const featureData = useMemo(() => {
    const allFeatures = new Set<string>();
    runs.forEach((r) => r.feature_importance?.forEach((f) => allFeatures.add(f.feature)));
    return Array.from(allFeatures).map((feat) => {
      const entry: Record<string, string | number> = { feature: feat };
      runs.forEach((r) => {
        const match = r.feature_importance?.find((f) => f.feature === feat);
        entry[r.dataset_name.replace(/_/g, " ")] = match ? +(match.importance * 100).toFixed(1) : 0;
      });
      return entry;
    });
  }, [runs]);

  const radarData = useMemo(() => {
    const metrics = ["R²", "RMSE (inv)", "MAE (inv)", "NSE"];
    return metrics.map((m) => {
      const entry: Record<string, string | number> = { metric: m };
      runs.forEach((r) => {
        const name = r.dataset_name.replace(/_/g, " ");
        if (m === "R²") entry[name] = +(r.metrics.r2 ?? 0).toFixed(3);
        else if (m === "RMSE (inv)") entry[name] = +(1 - Math.min(r.metrics.rmse ?? 0, 1) / 10).toFixed(3);
        else if (m === "MAE (inv)") entry[name] = +(1 - Math.min(r.metrics.mae ?? 0, 1) / 10).toFixed(3);
        else if (m === "NSE") entry[name] = +(r.metrics.nse ?? 0).toFixed(3);
      });
      return entry;
    });
  }, [runs]);

  const bestModel = useMemo(() =>
    runs.reduce<RunData | null>((best, r) => (!best || (r.metrics.r2 ?? 0) > (best.metrics.r2 ?? 0) ? r : best), null),
  [runs]);

  if (loading) {
    return (
      <div className="container py-10 md:py-16">
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Loading comparison data...</div>
        </div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="container py-10 md:py-16 space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/model"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
          <Badge variant="outline">Comparison</Badge>
        </div>
        <Card className="py-16 text-center">
          <CardContent>
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-medium">No Completed Training Runs</p>
            <p className="text-sm text-muted-foreground mt-1">Train models on at least two mine sites to compare performance.</p>
            <Link to="/model"><Button className="mt-4">Go to Model Training</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/model"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        <Badge variant="outline">Cross-Site Analysis</Badge>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Model Comparison Dashboard</h1>
        <p className="text-muted-foreground max-w-3xl">
          Side-by-side performance metrics and feature importance across {runs.length} mine site{runs.length > 1 ? "s" : ""}.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <Award className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Best Model</p>
            <p className="font-bold mt-1">{bestModel?.dataset_name.replace(/_/g, " ")}</p>
            <p className="text-xs text-muted-foreground">R² {bestModel?.metrics.r2?.toFixed(3)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{runs.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Mine Sites Compared</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {(runs.reduce((s, r) => s + (r.metrics.r2 ?? 0), 0) / runs.length).toFixed(3)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Average R²</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {(runs.reduce((s, r) => s + (r.metrics.rmse ?? 0), 0) / runs.length).toFixed(3)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Average RMSE</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Performance Metrics Comparison</CardTitle>
              <CardDescription>R², RMSE, MAE, and NSE across all trained mine sites</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={metricsData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Legend />
              <Bar dataKey="R²" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="RMSE" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="MAE" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="NSE" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      {runs.length >= 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Multi-Metric Radar</CardTitle>
                <CardDescription>Normalized performance profile per mine site (higher = better)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 9 }} />
                {runs.map((r, i) => (
                  <Radar
                    key={r.id}
                    name={r.dataset_name.replace(/_/g, " ")}
                    dataKey={r.dataset_name.replace(/_/g, " ")}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Feature Importance Comparison */}
      {featureData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance Comparison</CardTitle>
            <CardDescription>Relative contribution of each feature across mine sites (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureData} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="feature" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`}
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                />
                <Legend />
                {runs.map((r, i) => (
                  <Bar
                    key={r.id}
                    dataKey={r.dataset_name.replace(/_/g, " ")}
                    fill={COLORS[i % COLORS.length]}
                    radius={[0, 4, 4, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Run Summary</CardTitle>
          <CardDescription>Latest completed training run per mine site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {["Mine Site", "Model", "R²", "RMSE", "MAE", "NSE", "Date"].map((h) => (
                    <th key={h} className="text-left p-3 font-medium text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map((r, i) => (
                  <tr key={r.id} className="border-b border-muted/30 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      {r.dataset_name.replace(/_/g, " ")}
                    </td>
                    <td className="p-3"><Badge variant="secondary" className="text-xs">{r.model_name}</Badge></td>
                    <td className="p-3 font-mono font-bold text-primary">{r.metrics.r2?.toFixed(3) ?? "–"}</td>
                    <td className="p-3 font-mono">{r.metrics.rmse?.toFixed(3) ?? "–"}</td>
                    <td className="p-3 font-mono">{r.metrics.mae?.toFixed(3) ?? "–"}</td>
                    <td className="p-3 font-mono">{r.metrics.nse?.toFixed(3) ?? "–"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonDashboard;
