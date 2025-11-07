import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface AnalysisData {
  id: string;
  latitude: number;
  longitude: number;
  soil_moisture: {
    average: string;
    min: string;
    max: string;
    trend: string;
  };
  growth_potential: {
    score: string;
    suitability: string;
  };
  analyzed_at: string;
}

interface MoistureChartProps {
  data: AnalysisData[];
}


export const MoistureChart = ({ data }: MoistureChartProps) => {
  // Return null if no data
  if (!data || data.length === 0) {
    return null;
  }

  // Prepare data for timeline chart with error handling
  const timelineData = data
    .filter(item => item.analyzed_at && item.soil_moisture?.average && item.growth_potential?.score)
    .sort((a, b) => new Date(a.analyzed_at).getTime() - new Date(b.analyzed_at).getTime())
    .map((item) => ({
      date: format(new Date(item.analyzed_at), "MMM dd"),
      moisture: parseFloat(item.soil_moisture.average) * 100, // Convert to percentage
      potential: parseFloat(item.growth_potential.score),
      fullDate: new Date(item.analyzed_at),
    }));

  // Prepare data for comparison chart with error handling
  const comparisonData = data
    .filter(item => item.latitude && item.longitude && item.soil_moisture?.average && item.growth_potential?.score)
    .slice(-5)
    .map((item) => ({
      location: `${item.latitude.toFixed(3)}, ${item.longitude.toFixed(3)}`,
      moisture: parseFloat(item.soil_moisture.average) * 100,
      potential: parseFloat(item.growth_potential.score),
    }));

  // Return null if no valid data after filtering
  if (timelineData.length === 0 && comparisonData.length === 0) {
    return null;
  }


  return (
    <div className="grid gap-6 md:grid-cols-2">
      {timelineData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Soil Moisture Trends</CardTitle>
            <CardDescription>Historical soil moisture and growth potential over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: 'Moisture (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: 'Growth Potential (%)', angle: 90, position: 'insideRight', fontSize: 12 }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="moisture"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Soil Moisture (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="potential"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Growth Potential (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Analysis Comparison</CardTitle>
            <CardDescription>Last 5 analyzed locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="location"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Bar
                    dataKey="moisture"
                    fill="hsl(var(--primary))"
                    name="Soil Moisture (%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="potential"
                    fill="hsl(var(--chart-2))"
                    name="Growth Potential (%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
