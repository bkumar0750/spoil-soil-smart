import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Satellite, FlaskConical, Mountain, Cloud, Database } from "lucide-react";
import satelliteImage from "@/assets/satellite-moisture.jpg";
import dataLayersImage from "@/assets/data-layers.jpg";

const DataOverview = () => {
  const satelliteData = [
    { name: "Sentinel-1 SAR", resolution: "10m", bands: "VV, VH", temporal: "6-12 days" },
    { name: "Sentinel-2 MSI", resolution: "10-20m", bands: "13 multispectral", temporal: "5 days" },
    { name: "Landsat 8/9", resolution: "30m", bands: "11 bands + thermal", temporal: "16 days" },
    { name: "SRTM DEM", resolution: "30m", bands: "Elevation", temporal: "Static" },
  ];

  const climateDataSources = [
    { name: "ESA CCI Soil Moisture", resolution: "0.25° × 0.25°", source: "esa-soilmoisture-cci.org", description: "Global SM from passive/active microwave" },
    { name: "MODIS LULC, NDVI, GPP, ET", resolution: "500 m", source: "lpdaacsvc.cr.usgs.gov", description: "Land cover, vegetation indices, productivity" },
    { name: "GPM Level-3 Precipitation", resolution: "0.1° × 0.1°", source: "daac.gsfc.nasa.gov", description: "High-res global precipitation" },
    { name: "GLDAS SM & Temperature", resolution: "0.25° × 0.25°", source: "daac.gsfc.nasa.gov", description: "Land surface model reanalysis" },
    { name: "FLDAS Soil Heat Flux", resolution: "0.1° × 0.25°", source: "daac.gsfc.nasa.gov", description: "Famine early-warning land data" },
    { name: "IMD Precipitation", resolution: "0.25° × 0.25°", source: "imdpune.gov.in", description: "India-specific gridded rainfall" },
    { name: "IMD Temperature", resolution: "1° × 1°", source: "imdpune.gov.in", description: "India-specific gridded temperature" },
  ];

  const fieldParameters = [
    { category: "Soil Physical", params: ["Moisture (0-10cm, 10-30cm, 30-60cm)", "Texture (sand/silt/clay %)", "Bulk density", "Porosity", "Infiltration rate"] },
    { category: "Soil Chemical", params: ["pH", "Electrical conductivity", "Organic carbon", "N, P, K", "Heavy metals"] },
    { category: "Topographic", params: ["Slope (%)", "Aspect", "Elevation", "Micro-topography", "Drainage"] },
    { category: "Vegetation", params: ["NDVI", "EVI", "SAVI", "Cover %", "Species present"] },
  ];

  const derivedIndices = [
    { name: "NDVI", formula: "(NIR - Red) / (NIR + Red)", purpose: "Vegetation health" },
    { name: "SAVI", formula: "((NIR - Red) / (NIR + Red + L)) * (1 + L)", purpose: "Soil-adjusted vegetation" },
    { name: "SMI", formula: "f(VV, VH, NDVI, Rainfall)", purpose: "Soil Moisture Index" },
    { name: "TWI", formula: "ln(α / tan(β))", purpose: "Topographic Wetness" },
    { name: "VH/VV Ratio", formula: "VH backscatter / VV backscatter", purpose: "SAR moisture proxy" },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Data Overview</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive multi-source dataset combining satellite remote sensing, field measurements, and derived indices for soil moisture prediction and reclamation suitability analysis.
        </p>
      </div>

      <Tabs defaultValue="satellite" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="satellite">Satellite</TabsTrigger>
          <TabsTrigger value="field">Field Data</TabsTrigger>
          <TabsTrigger value="derived">Derived Indices</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="satellite" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Satellite className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Satellite Data Sources</CardTitle>
                  <CardDescription>Multi-sensor remote sensing data for comprehensive analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <img src={satelliteImage} alt="Satellite moisture visualization" className="rounded-lg shadow-lg w-full h-auto" />
                <div className="space-y-4">
                  {satelliteData.map((data, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
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
                        <th className="text-left p-3 font-medium">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {climateDataSources.map((ds, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="p-3 font-medium">{ds.name}</td>
                          <td className="p-3"><Badge variant="outline">{ds.resolution}</Badge></td>
                          <td className="p-3 text-muted-foreground">{ds.description}</td>
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
        </TabsContent>

        <TabsContent value="field" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Field Measurements & Ground Truth</CardTitle>
                  <CardDescription>In-situ sampling and laboratory analysis parameters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {fieldParameters.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.params.map((param, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>{param}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Sampling Strategy</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Stratified sampling by slope, aspect, texture, and landform</p>
                  <p>• 20-50 ground-truth points across study area</p>
                  <p>• Multi-depth measurements (0-10cm, 10-30cm, 30-60cm)</p>
                  <p>• Seasonal sampling (post-monsoon and dry season)</p>
                  <p>• GPS coordinates (±5m accuracy) with photographs</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="derived" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Derived Indices & Features</CardTitle>
                  <CardDescription>Computed parameters from satellite and topographic data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {derivedIndices.map((index, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{index.name}</CardTitle>
                        <Badge>{index.purpose}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <code className="text-sm bg-muted p-3 rounded block font-mono">{index.formula}</code>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <img src={dataLayersImage} alt="Data layers visualization" className="rounded-lg shadow-lg w-full h-auto" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sentinel-2 Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium">Atmospheric Correction</p>
                    <p className="text-muted-foreground">Sen2Cor or GEE surface reflectance</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium">Cloud Masking</p>
                    <p className="text-muted-foreground">QA bands and cloud probability</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Temporal Compositing</p>
                    <p className="text-muted-foreground">Monthly/seasonal aggregation</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <div>
                    <p className="font-medium">Index Calculation</p>
                    <p className="text-muted-foreground">NDVI, EVI, SAVI computation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentinel-1 Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium">Radiometric Calibration</p>
                    <p className="text-muted-foreground">Convert to sigma0 backscatter</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium">Speckle Filtering</p>
                    <p className="text-muted-foreground">Lee or Refined Lee filter</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Terrain Correction</p>
                    <p className="text-muted-foreground">Range-Doppler correction</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <div>
                    <p className="font-medium">Polarization Ratios</p>
                    <p className="text-muted-foreground">VH/VV ratio calculation</p>
                  </div>
                </div>
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
                      <li>• Slope (%)</li>
                      <li>• Aspect (degrees)</li>
                      <li>• Elevation (m)</li>
                      <li>• Curvature</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Hydrological</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Flow direction</li>
                      <li>• Flow accumulation</li>
                      <li>• TWI calculation</li>
                      <li>• Watershed delineation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Distance Metrics</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Distance to water</li>
                      <li>• Distance to drainage</li>
                      <li>• Euclidean distance</li>
                      <li>• Cost distance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataOverview;
