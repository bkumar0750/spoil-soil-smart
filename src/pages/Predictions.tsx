import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, Layers, TreePine, Download, AlertCircle } from "lucide-react";

const Predictions = () => {
  const moistureClasses = [
    { range: "< 10%", label: "Very Dry", color: "bg-red-500", suitability: "Low" },
    { range: "10-15%", label: "Dry", color: "bg-orange-500", suitability: "Low-Moderate" },
    { range: "15-20%", label: "Moderate", color: "bg-yellow-500", suitability: "Moderate" },
    { range: "20-25%", label: "Moist", color: "bg-green-500", suitability: "High" },
    { range: "> 25%", label: "Very Moist", color: "bg-blue-500", suitability: "Very High" },
  ];

  const speciesSuitability = [
    {
      species: "Acacia nilotica",
      moisture: "15-25%",
      ph: "6.5-8.5",
      slope: "< 30%",
      suitableArea: "45%",
      rating: "High",
    },
    {
      species: "Azadirachta indica",
      moisture: "18-28%",
      ph: "6.0-8.0",
      slope: "< 20%",
      suitableArea: "32%",
      rating: "High",
    },
    {
      species: "Dalbergia sissoo",
      moisture: "20-30%",
      ph: "6.5-7.5",
      slope: "< 15%",
      suitableArea: "18%",
      rating: "Moderate",
    },
    {
      species: "Leucaena leucocephala",
      moisture: "12-22%",
      ph: "5.5-8.5",
      slope: "< 35%",
      suitableArea: "52%",
      rating: "Very High",
    },
  ];

  const mapLayers = [
    { name: "Soil Moisture Prediction", description: "XGBoost model output (0-10cm depth)" },
    { name: "Prediction Uncertainty", description: "Standard deviation from bootstrap samples" },
    { name: "Species Suitability - Acacia", description: "Multi-criteria suitability index" },
    { name: "Species Suitability - Azadirachta", description: "Multi-criteria suitability index" },
    { name: "Slope Map", description: "DEM-derived slope percentage" },
    { name: "NDVI Composite", description: "Vegetation index (seasonal mean)" },
    { name: "Ground Truth Points", description: "Field sampling locations" },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Predictions & Suitability Maps</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Interactive soil moisture predictions and species suitability analysis for mine overburden reclamation planning.
        </p>
      </div>

      <Tabs defaultValue="moisture" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="moisture">Soil Moisture</TabsTrigger>
          <TabsTrigger value="suitability">Species Suitability</TabsTrigger>
          <TabsTrigger value="maps">Map Layers</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="moisture" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <Map className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Soil Moisture Prediction Map</CardTitle>
                  <CardDescription>Predicted surface soil moisture (0-10cm depth) across mine overburden</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Placeholder for interactive map */}
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                <div className="text-center space-y-2">
                  <Map className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive map visualization</p>
                  <p className="text-sm text-muted-foreground">Integrate with Leaflet/Mapbox for production</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Moisture Classification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moistureClasses.map((cls, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded">
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded ${cls.color}`} />
                          <div>
                            <p className="font-medium text-sm">{cls.label}</p>
                            <p className="text-xs text-muted-foreground">{cls.range}</p>
                          </div>
                        </div>
                        <Badge variant={cls.suitability === "High" || cls.suitability === "Very High" ? "default" : "secondary"}>
                          {cls.suitability}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Summary Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Mean Moisture</span>
                      <span className="font-bold text-primary">18.5%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Std. Deviation</span>
                      <span className="font-bold">±4.2%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Min - Max</span>
                      <span className="font-bold">8.3% - 32.1%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Suitable Area</span>
                      <span className="font-bold text-green-600">62%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Mean Uncertainty</span>
                      <span className="font-bold">±1.8%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download GeoTIFF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Shapefile
                </Button>
                <Button variant="secondary" className="gap-2">
                  <Download className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suitability" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TreePine className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Tree Species Suitability Analysis</CardTitle>
                  <CardDescription>Multi-criteria assessment combining moisture, soil chemistry, and topography</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {speciesSuitability.map((species, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TreePine className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg italic">{species.species}</CardTitle>
                        </div>
                        <Badge
                          variant={
                            species.rating === "Very High"
                              ? "default"
                              : species.rating === "High"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {species.rating} Suitability
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Moisture Range</p>
                          <p className="font-medium">{species.moisture}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">pH Range</p>
                          <p className="font-medium">{species.ph}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Slope</p>
                          <p className="font-medium">{species.slope}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Suitable Area</p>
                          <p className="font-bold text-primary">{species.suitableArea}</p>
                        </div>
                        <div className="flex items-center">
                          <Button size="sm" variant="outline" className="w-full">
                            View Map
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-2 border-accent/30 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">Suitability Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Multi-Criteria Decision Analysis (MCDA):</strong> Suitability scores are computed by weighting multiple factors:
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="p-3 rounded-lg bg-background">
                      <p className="font-medium mb-1">Primary Factors (60%):</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Soil moisture range (30%)</li>
                        <li>• pH compatibility (15%)</li>
                        <li>• Slope tolerance (15%)</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <p className="font-medium mb-1">Secondary Factors (40%):</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Soil texture (15%)</li>
                        <li>• Contamination level (10%)</li>
                        <li>• Drainage class (10%)</li>
                        <li>• Aspect (5%)</li>
                      </ul>
                    </div>
                  </div>
                  <p className="pt-2">
                    Final suitability index ranges from 0-1, classified as: Very High (&gt;0.8), High (0.6-0.8), Moderate (0.4-0.6), 
                    Low (0.2-0.4), Very Low (&lt;0.2).
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Available Map Layers</CardTitle>
                  <CardDescription>Toggle and export different thematic layers for analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {mapLayers.map((layer, index) => (
                  <Card key={index} className="border">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{layer.name}</p>
                          <p className="text-sm text-muted-foreground">{layer.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reclamation Recommendations</CardTitle>
              <CardDescription>Data-driven guidance for successful afforestation on mine overburden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-green-600" />
                    Priority Planting Zones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Zone 1 - High Suitability (Northern benches, 25% of area):</strong>
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Soil moisture: 20-28%, ideal for most species</li>
                    <li>• Gentle slopes (&lt;15%), low erosion risk</li>
                    <li>• Recommended: Azadirachta indica, Dalbergia sissoo</li>
                    <li>• Survival probability: &gt;85%</li>
                  </ul>
                  <p className="pt-2">
                    <strong>Zone 2 - Moderate Suitability (Central terraces, 40% of area):</strong>
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Soil moisture: 15-20%, adequate with amendments</li>
                    <li>• Moderate slopes (15-25%), requires erosion control</li>
                    <li>• Recommended: Acacia nilotica, Leucaena leucocephala</li>
                    <li>• Survival probability: 65-75%</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Management Interventions Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Dry Zones (&lt;15% moisture, 20% of area):</strong>
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Install drip irrigation for first 2 years</li>
                    <li>• Apply organic mulch (10cm layer) to retain moisture</li>
                    <li>• Use drought-tolerant pioneer species (Leucaena)</li>
                    <li>• Create micro-catchments for rainfall harvesting</li>
                  </ul>
                  <p className="pt-2">
                    <strong>Steep Slopes (&gt;30%, 15% of area):</strong>
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Implement bench terracing before planting</li>
                    <li>• Install erosion control structures (gabions, check dams)</li>
                    <li>• Plant grass cover (vetiver) alongside trees</li>
                    <li>• Avoid heavy machinery to prevent compaction</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Monitoring Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">Year 1 (Establishment)</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Monthly soil moisture monitoring</li>
                        <li>• Quarterly survival rate assessment</li>
                        <li>• Post-monsoon Sentinel-2 imagery</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">Year 2-3 (Growth)</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Seasonal NDVI time series</li>
                        <li>• Semi-annual height measurements</li>
                        <li>• Annual soil quality reassessment</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">Year 4+ (Maturation)</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Annual canopy cover mapping</li>
                        <li>• Biodiversity surveys</li>
                        <li>• Carbon stock estimation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Predictions;
