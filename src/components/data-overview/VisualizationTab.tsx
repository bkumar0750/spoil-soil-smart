import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud } from "lucide-react";

const VisualizationTab = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Data Visualization & Access</CardTitle>
            <CardDescription>Interactive maps, charts, and data export capabilities</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Time Series Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Plot NDVI, backscatter, and moisture trends</p>
              <p>• Compare seasonal variations</p>
              <p>• Analyze rainfall correlation</p>
              <p>• Export data as CSV/GeoJSON</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Spatial Visualization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Interactive map layers</p>
              <p>• Color-coded moisture maps</p>
              <p>• Hillshade and contour overlays</p>
              <p>• Ground truth point display</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Statistical Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Descriptive statistics tables</p>
              <p>• Distribution histograms</p>
              <p>• Correlation matrices</p>
              <p>• Box plots and scatter plots</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Data Export</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• GeoTIFF raster exports</p>
              <p>• CSV tabular data</p>
              <p>• Shapefile vector data</p>
              <p>• PDF report generation</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationTab;
