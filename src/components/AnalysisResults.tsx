import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, TreeDeciduous, FlaskConical, TrendingUp } from "lucide-react";

interface AnalysisResultsProps {
  data: any;
}

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Location Info */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Location</CardTitle>
          <CardDescription>
            {data.location.area} - {data.location.latitude.toFixed(4)}°N, {data.location.longitude.toFixed(4)}°E
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Buffer Size</p>
              <p className="font-bold">{data.location.bufferSize}m</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Period</p>
              <p className="font-bold">{data.timeRange.start} to {data.timeRange.end}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Quality</p>
              <p className="font-bold text-green-600">{data.dataQuality.confidence}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soil Moisture */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Soil Moisture Analysis</CardTitle>
              <CardDescription>Surface layer (0-10cm) moisture content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold text-primary">{data.soilMoisture.average}</p>
                <p className="text-xs text-muted-foreground">{data.soilMoisture.unit}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Minimum</p>
                <p className="text-2xl font-bold">{data.soilMoisture.min}</p>
                <p className="text-xs text-muted-foreground">{data.soilMoisture.unit}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Maximum</p>
                <p className="text-2xl font-bold">{data.soilMoisture.max}</p>
                <p className="text-xs text-muted-foreground">{data.soilMoisture.unit}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <p className="text-lg font-bold capitalize">{data.soilMoisture.trend}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Vegetation Indices */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TreeDeciduous className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Vegetation Indices</CardTitle>
              <CardDescription>Satellite-derived vegetation health indicators</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(data.vegetationIndices).map(([key, value]: [string, any]) => (
              <Card key={key} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium uppercase">{key}</p>
                    {value.status && <Badge variant="secondary">{value.status}</Badge>}
                  </div>
                  <p className="text-2xl font-bold text-primary">{value.average}</p>
                  <p className="text-xs text-muted-foreground mt-1">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Soil Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Soil Properties</CardTitle>
              <CardDescription>Chemical and physical characteristics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data.soilProperties).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Potential */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TreeDeciduous className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <CardTitle>Forest Growth Potential</CardTitle>
                <Badge variant="default" className="text-lg">{data.growthPotential.score}%</Badge>
              </div>
              <CardDescription>Overall suitability: {data.growthPotential.suitability}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Recommended Species</h4>
            <div className="flex flex-wrap gap-2">
              {data.growthPotential.recommendedSpecies.map((species: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {species}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-3 text-destructive">Limitations</h4>
              <ul className="space-y-2">
                {data.growthPotential.limitations.map((limitation: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-primary">Recommendations</h4>
              <ul className="space-y-2">
                {data.growthPotential.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
