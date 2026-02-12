import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

const cmip6Models = [
  { name: "GFDL-ESM4", resolution: "1° × 1°", institution: "NOAA-GFDL", source: "esgf-node.llnl.gov" },
  { name: "CNRM-CM6-1", resolution: "0.5° × 0.5°", institution: "CNRM-CERFACS", source: "esgf-node.llnl.gov" },
  { name: "HadGEM3-GC31", resolution: "1.875° × 1.25°", institution: "UK Met Office", source: "esgf-node.llnl.gov" },
  { name: "CanESM5", resolution: "2.81° × 2.77°", institution: "CCCma", source: "esgf-node.llnl.gov" },
];

const smProjectionData = [
  { year: "2020", ssp126: 0.22, ssp245: 0.22, ssp585: 0.22 },
  { year: "2030", ssp126: 0.21, ssp245: 0.20, ssp585: 0.19 },
  { year: "2040", ssp126: 0.21, ssp245: 0.19, ssp585: 0.17 },
  { year: "2050", ssp126: 0.20, ssp245: 0.18, ssp585: 0.15 },
  { year: "2060", ssp126: 0.20, ssp245: 0.17, ssp585: 0.13 },
  { year: "2070", ssp126: 0.20, ssp245: 0.16, ssp585: 0.11 },
  { year: "2080", ssp126: 0.19, ssp245: 0.15, ssp585: 0.10 },
  { year: "2090", ssp126: 0.19, ssp245: 0.14, ssp585: 0.09 },
  { year: "2100", ssp126: 0.19, ssp245: 0.13, ssp585: 0.08 },
];

const tempProjectionData = [
  { year: "2020", ssp126: 1.2, ssp245: 1.2, ssp585: 1.2 },
  { year: "2030", ssp126: 1.5, ssp245: 1.6, ssp585: 1.8 },
  { year: "2040", ssp126: 1.7, ssp245: 2.0, ssp585: 2.5 },
  { year: "2050", ssp126: 1.8, ssp245: 2.3, ssp585: 3.2 },
  { year: "2060", ssp126: 1.9, ssp245: 2.6, ssp585: 3.9 },
  { year: "2070", ssp126: 1.9, ssp245: 2.8, ssp585: 4.5 },
  { year: "2080", ssp126: 1.9, ssp245: 3.0, ssp585: 5.0 },
  { year: "2090", ssp126: 1.9, ssp245: 3.1, ssp585: 5.4 },
  { year: "2100", ssp126: 1.8, ssp245: 3.2, ssp585: 5.7 },
];

const seasonalImpact = [
  { season: "Pre-Monsoon (MAM)", smChange: -3.2, tempChange: 1.8, precipChange: -5.1, risk: "High" },
  { season: "Monsoon (JJAS)", smChange: -4.5, tempChange: 0.9, precipChange: 2.3, risk: "Moderate" },
  { season: "Post-Monsoon (ON)", smChange: -2.1, tempChange: 1.2, precipChange: -3.8, risk: "Moderate" },
  { season: "Winter (DJF)", smChange: -3.0, tempChange: 1.5, precipChange: -7.2, risk: "High" },
];

const driverImportance = [
  { driver: "Temperature", importance: 30.76, color: "hsl(var(--destructive))" },
  { driver: "Precipitation", importance: 26.34, color: "hsl(var(--primary))" },
  { driver: "Evapotranspiration", importance: 26.08, color: "hsl(var(--accent))" },
  { driver: "Surface Greenness", importance: 16.82, color: "hsl(var(--secondary))" },
];

const ClimateProjections = () => {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Climate Projections</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          CMIP6-based future projections of soil moisture, temperature, and precipitation under different SSP scenarios — 
          critical for long-term mine reclamation planning.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">Based on Kashyap & Kuttippurath (2024)</Badge>
          <Badge variant="secondary">CMIP6 SSP Scenarios</Badge>
        </div>
      </div>

      <Tabs defaultValue="projections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="projections">SM Projections</TabsTrigger>
          <TabsTrigger value="drivers">SM Drivers</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Impact</TabsTrigger>
          <TabsTrigger value="models">CMIP6 Models</TabsTrigger>
        </TabsList>

        <TabsContent value="projections" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-700 dark:text-green-400">SSP1-2.6 (Sustainable)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">-3.0%</p>
                <p className="text-xs text-muted-foreground">SM change by 2100</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-700 dark:text-yellow-400">SSP2-4.5 (Middle Road)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">-9.0%</p>
                <p className="text-xs text-muted-foreground">SM change by 2100</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-500/30 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700 dark:text-red-400">SSP5-8.5 (Fossil Fuel)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">-14.0%</p>
                <p className="text-xs text-muted-foreground">SM change by 2100</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Soil Moisture Projections (m³/m³)</CardTitle>
                  <CardDescription>Multi-model ensemble mean under SSP scenarios (2020–2100)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={smProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" className="text-xs" />
                  <YAxis domain={[0.05, 0.25]} className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="ssp126" name="SSP1-2.6" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="ssp245" name="SSP2-4.5" stroke="#eab308" fill="#eab308" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="ssp585" name="SSP5-8.5" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle>Temperature Anomaly Projections (°C)</CardTitle>
                  <CardDescription>Warming trends relative to pre-industrial baseline</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={tempProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ssp126" name="SSP1-2.6" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ssp245" name="SSP2-4.5" stroke="#eab308" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ssp585" name="SSP5-8.5" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/30 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Implications for Mine Reclamation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Under SSP5-8.5, soil moisture could decline by 14%, severely impacting vegetation establishment on mine overburden</p>
              <p>• Warming of 0.59°C/decade (observed 2000–2019) accelerates evapotranspiration and soil drying</p>
              <p>• Reclamation plans must account for 1-month temporal lag between warming stress and productivity loss</p>
              <p>• Climate-resilient species selection and improved irrigation infrastructure are essential for long-term success</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>SM Variability Drivers (Random Forest Analysis)</CardTitle>
                  <CardDescription>Feature importance from RF model — based on Kashyap & Kuttippurath (2024)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={driverImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 35]} unit="%" className="text-xs" />
                  <YAxis dataKey="driver" type="category" width={130} className="text-xs" />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Bar dataKey="importance" name="Importance (%)" radius={[0, 4, 4, 0]}>
                    {driverImportance.map((entry, index) => (
                      <Bar key={index} dataKey="importance" fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {driverImportance.map((d) => (
                  <Card key={d.driver} className="border">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{d.driver}</span>
                        <Badge>{d.importance}%</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${(d.importance / 35) * 100}%`, backgroundColor: d.color }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">Temperature–SM Relationship</p>
                <p className="text-muted-foreground">Strong negative partial correlation (&gt; −0.5) in agriculture-intensive regions of Indo-Gangetic Plain and South India, even after controlling for precipitation.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">Warming-Induced Moisture Stress</p>
                <p className="text-muted-foreground">Land warming (0.59°C/dec) and rising soil heat flux (0.16 W/m²/dec) drive SM drying, reducing GPP and crop yields.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">Temporal Lag</p>
                <p className="text-muted-foreground">Granger Causality analysis shows warming-induced SM stress has a maximum temporal lag of 1 month on vegetation productivity.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Soil Moisture Changes</CardTitle>
              <CardDescription>Observed SM reduction trends by season (2000–2019)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {seasonalImpact.map((s) => (
                  <Card key={s.season} className="border">
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{s.season}</p>
                          <Badge variant={s.risk === "High" ? "destructive" : "secondary"} className="mt-1">{s.risk} Risk</Badge>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">SM Change</p>
                            <p className="font-bold text-destructive">{s.smChange}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Temp Change</p>
                            <p className="font-bold text-orange-500">+{s.tempChange}°C</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Precip Change</p>
                            <p className={`font-bold ${s.precipChange > 0 ? "text-blue-500" : "text-destructive"}`}>{s.precipChange > 0 ? "+" : ""}{s.precipChange}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-4 text-sm">
                  <p className="font-medium mb-2">Reclamation Implications</p>
                  <p className="text-muted-foreground">
                    Monsoon (Kharif) and winter (Rabi) seasons show the highest SM decline (4.5% and 3.0%), which are also the major 
                    agricultural and planting seasons. Mine reclamation efforts should time planting with post-monsoon moisture peaks and 
                    install supplemental irrigation for dry season survival.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CMIP6 Climate Models Used</CardTitle>
              <CardDescription>Global climate models for future projection of soil moisture, temperature, and precipitation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {cmip6Models.map((model) => (
                  <Card key={model.name} className="border">
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-sm text-muted-foreground">{model.institution}</p>
                        </div>
                        <div className="flex gap-3 items-center">
                          <Badge variant="secondary">{model.resolution}</Badge>
                          <a href={`https://${model.source}/projects/cmip6/`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                            Source →
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Data Sources</CardTitle>
              <CardDescription>Remote sensing and reanalysis datasets used in climate analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Dataset</th>
                      <th className="text-left p-3 font-medium">Resolution</th>
                      <th className="text-left p-3 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "ESA CCI Soil Moisture", res: "0.25° × 0.25°", url: "esa-soilmoisture-cci.org" },
                      { name: "GPM Precipitation (Level-3)", res: "0.1° × 0.1°", url: "daac.gsfc.nasa.gov" },
                      { name: "GLDAS SM, Temperature", res: "0.25° × 0.25°", url: "daac.gsfc.nasa.gov" },
                      { name: "FLDAS Soil Heat Flux", res: "0.1° × 0.25°", url: "daac.gsfc.nasa.gov" },
                      { name: "MODIS LULC, NDVI, GPP, ET", res: "500 m", url: "lpdaacsvc.cr.usgs.gov" },
                      { name: "IMD Precipitation", res: "0.25° × 0.25°", url: "imdpune.gov.in" },
                      { name: "IMD Temperature", res: "1° × 1°", url: "imdpune.gov.in" },
                    ].map((ds, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-3">{ds.name}</td>
                        <td className="p-3"><Badge variant="outline">{ds.res}</Badge></td>
                        <td className="p-3">
                          <a href={`https://${ds.url}/`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{ds.url}</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClimateProjections;
