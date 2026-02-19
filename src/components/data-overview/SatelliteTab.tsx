import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite } from "lucide-react";
import satelliteImage from "@/assets/satellite-moisture.jpg";

const satelliteData = [
  {
    name: "Sentinel-1 SAR",
    resolution: "10m",
    bands: "VV, VH",
    temporal: "6-12 days",
    mlRole: "Primary backscatter features for SM regression. VV/VH polarization ratios used as input features in RF and XGBoost models.",
    preprocessing: "Radiometric calibration → Speckle filtering (Lee 5×5) → Terrain correction → dB conversion",
  },
  {
    name: "Sentinel-2 MSI",
    resolution: "10-20m",
    bands: "13 multispectral",
    temporal: "5 days",
    mlRole: "Optical vegetation indices (NDVI, EVI, SAVI) as proxy features. Band ratios feed CNN feature extractors.",
    preprocessing: "Atmospheric correction (Sen2Cor) → Cloud masking (SCL) → BRDF normalization → Compositing",
  },
  {
    name: "Landsat 8/9",
    resolution: "30m",
    bands: "11 bands + thermal",
    temporal: "16 days",
    mlRole: "Long-term temporal analysis (1984–present). LST from thermal bands as auxiliary feature for SM-temperature coupling.",
    preprocessing: "L2SP surface reflectance → Thermal radiance → LST retrieval → Pan-sharpening (15m)",
  },
  {
    name: "SRTM DEM",
    resolution: "30m",
    bands: "Elevation",
    temporal: "Static",
    mlRole: "Topographic features (slope, TWI, curvature) as static predictors. TWI ranked top-5 feature importance in RF models.",
    preprocessing: "Void filling → Hydrological conditioning → Flow direction/accumulation → TWI computation",
  },
];

const climateDataSources = [
  { name: "ESA CCI Soil Moisture", resolution: "0.25° × 0.25°", source: "esa-soilmoisture-cci.org", description: "Global SM from passive/active microwave", mlRole: "Target variable for coarse-scale model training & validation" },
  { name: "MODIS LULC, NDVI, GPP, ET", resolution: "500 m", source: "lpdaacsvc.cr.usgs.gov", description: "Land cover, vegetation indices, productivity", mlRole: "Land cover stratification for model ensembles; GPP as productivity proxy" },
  { name: "GPM Level-3 Precipitation", resolution: "0.1° × 0.1°", source: "daac.gsfc.nasa.gov", description: "High-res global precipitation", mlRole: "Antecedent precipitation index (API) as lagged feature input" },
  { name: "GLDAS SM & Temperature", resolution: "0.25° × 0.25°", source: "daac.gsfc.nasa.gov", description: "Land surface model reanalysis", mlRole: "SM baseline for bias correction; LST for thermal stress index" },
  { name: "FLDAS Soil Heat Flux", resolution: "0.1° × 0.25°", source: "daac.gsfc.nasa.gov", description: "Famine early-warning land data", mlRole: "Soil heat flux as energy balance feature for SM dynamics" },
  { name: "IMD Precipitation", resolution: "0.25° × 0.25°", source: "imdpune.gov.in", description: "India-specific gridded rainfall", mlRole: "Regional precipitation correction; monsoon onset detection" },
  { name: "IMD Temperature", resolution: "1° × 1°", source: "imdpune.gov.in", description: "India-specific gridded temperature", mlRole: "Temperature anomaly calculation for warming-stress coupling" },
];

const SatelliteTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Satellite className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Satellite Data Sources</CardTitle>
              <CardDescription>Multi-sensor remote sensing data with ML training roles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <img src={satelliteImage} alt="Satellite moisture visualization" className="rounded-lg shadow-lg w-full h-auto" />
            <div className="space-y-4">
              {satelliteData.map((data, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{data.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Resolution:</span>
                      <Badge variant="secondary">{data.resolution}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bands:</span>
                      <span className="font-medium">{data.bands}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Temporal:</span>
                      <span className="font-medium">{data.temporal}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xs font-semibold text-primary mb-1">ML Training Role</p>
                      <p className="text-xs text-muted-foreground">{data.mlRole}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Preprocessing Pipeline</p>
                      <code className="text-[10px] bg-muted p-1.5 rounded block font-mono text-muted-foreground">{data.preprocessing}</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Climate & Reanalysis Data Sources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Additional datasets from Kashyap & Kuttippurath (2024) for SM dynamics and climate analysis.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Dataset</th>
                    <th className="text-left p-3 font-medium">Resolution</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">ML Role</th>
                    <th className="text-left p-3 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {climateDataSources.map((ds, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-3 font-medium">{ds.name}</td>
                      <td className="p-3"><Badge variant="outline">{ds.resolution}</Badge></td>
                      <td className="p-3 text-muted-foreground">{ds.description}</td>
                      <td className="p-3 text-xs text-muted-foreground">{ds.mlRole}</td>
                      <td className="p-3">
                        <a href={`https://${ds.source}/`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{ds.source}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatelliteTab;
