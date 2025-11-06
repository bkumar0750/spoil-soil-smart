import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip, Legend } from "recharts";
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
  // Prepare data for timeline chart
  const timelineData = data
    .sort((a, b) => new Date(a.analyzed_at).getTime() - new Date(b.analyzed_at).getTime())
    .map((item) => ({
      date: format(new Date(item.analyzed_at), "MMM dd"),
      moisture: parseFloat(item.soil_moisture.average) * 100, // Convert to percentage
      potential: parseFloat(item.growth_potential.score),
      fullDate: new Date(item.analyzed_at),
    }));

  // Prepare data for comparison chart
  const comparisonData = data.slice(-5).map((item) => ({
    location: `${item.latitude.toFixed(3)}, ${item.longitude.toFixed(3)}`,
    moisture: parseFloat(item.soil_moisture.average) * 100,
    potential: parseFloat(item.growth_potential.score),
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture Trends</CardTitle>
          <CardDescription>Historical soil moisture and growth potential over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: 'Moisture (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Growth Potential (%)', angle: 90, position: 'insideRight', fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Comparison</CardTitle>
          <CardDescription>Last 5 analyzed locations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="location"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
                className="text-muted-foreground"
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
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
        </CardContent>
      </Card>
    </div>
  );
};
