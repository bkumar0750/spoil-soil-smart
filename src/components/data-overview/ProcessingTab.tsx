import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain } from "lucide-react";

const ProcessingTab = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sentinel-2 Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { step: "1", title: "Atmospheric Correction", desc: "Sen2Cor or GEE surface reflectance" },
            { step: "2", title: "Cloud Masking", desc: "QA bands and cloud probability (<10% threshold)" },
            { step: "3", title: "Temporal Compositing", desc: "Monthly median compositing to reduce noise" },
            { step: "4", title: "Index Calculation", desc: "NDVI, EVI, SAVI, BSI, MNDWI computation" },
            { step: "5", title: "Feature Extraction", desc: "Zonal statistics (mean, std, p10, p90) per sampling unit" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">{item.step}</Badge>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentinel-1 Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { step: "1", title: "Radiometric Calibration", desc: "Convert to σ⁰ (sigma-nought) backscatter in dB" },
            { step: "2", title: "Speckle Filtering", desc: "Refined Lee filter (7×7) preserving edges" },
            { step: "3", title: "Terrain Correction", desc: "Range-Doppler with SRTM 30m DEM" },
            { step: "4", title: "Polarization Ratios", desc: "VH/VV ratio, VV-VH difference" },
            { step: "5", title: "Temporal Statistics", desc: "Multi-temporal mean, std, coefficient of variation" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">{item.step}</Badge>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <Mountain className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Topographic Processing</CardTitle>
              <CardDescription>DEM-derived features for hydrological and terrain analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium text-sm">Primary Derivatives</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Slope (%) — Horn's method</li>
                <li>• Aspect (degrees) — sin/cos encoded</li>
                <li>• Elevation (m) — min-max scaled</li>
                <li>• Profile & plan curvature</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Hydrological</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• D8 flow direction algorithm</li>
                <li>• Flow accumulation (log-scaled)</li>
                <li>• TWI = ln(α / tan(β))</li>
                <li>• Stream Power Index (SPI)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Distance Metrics</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Euclidean distance to water</li>
                <li>• Cost-distance to drainage</li>
                <li>• Proximity to mine boundary</li>
                <li>• Distance to reclaimed patches</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Data Fusion Pipeline</CardTitle>
          <CardDescription>Multi-source integration for ML training</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Spatial alignment:</strong> All rasters resampled to 10m grid using bilinear interpolation (continuous) / nearest-neighbor (categorical)</p>
          <p>• <strong>Temporal alignment:</strong> Monthly composites synchronized across Sentinel-1, Sentinel-2, and climate datasets</p>
          <p>• <strong>Feature stacking:</strong> 47 features stacked into pixel-level feature vectors for each sampling point</p>
          <p>• <strong>Missing data:</strong> Gap-filled using temporal interpolation (Whittaker smoother) and spatial kriging for sparse measurements</p>
          <p>• <strong>Normalization:</strong> StandardScaler (Z-score) for tree-based models; MinMaxScaler [0,1] for neural networks</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingTab;
