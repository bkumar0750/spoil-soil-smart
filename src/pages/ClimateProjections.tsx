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
    <div className="container py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="mb-1">CMIP6 Analysis</Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Climate Projections</h1>
        <p className="text-muted-foreground max-w-3xl">
          CMIP6-based future projections of soil moisture, temperature, and precipitation under different SSP scenarios — critical for long-term mine reclamation planning.
        </p>
        <div className="flex gap-2 flex-wrap pt-1">
          <Badge variant="secondary" className="text-xs">Based on Kashyap & Kuttippurath (2024)</Badge>
          <Badge variant="secondary" className="text-xs">CMIP6 SSP Scenarios</Badge>
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
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "SSP1-2.6 (Sustainable)", value: "-3.0%", borderClass: "border-primary/30", bgClass: "bg-primary/5", textClass: "text-primary" },
              { label: "SSP2-4.5 (Middle Road)", value: "-9.0%", borderClass: "border-chart-3/30", bgClass: "bg-chart-3/5", textClass: "text-chart-3" },
              { label: "SSP5-8.5 (Fossil Fuel)", value: "-14.0%", borderClass: "border-destructive/30", bgClass: "bg-destructive/5", textClass: "text-destructive" },
            ].map((s, i) => (
              <Card key={i} className={`border-2 ${s.borderClass} ${s.bgClass}`}>
                <CardHeader className="pb-2"><CardTitle className={`text-sm ${s.textClass}`}>{s.label}</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">SM change by 2100</p></CardContent>
              </Card>
            ))}
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
                  <Area type="monotone" dataKey="ssp126" name="SSP1-2.6" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.12} strokeWidth={2} />
                  <Area type="monotone" dataKey="ssp245" name="SSP2-4.5" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.12} strokeWidth={2} />
                  <Area type="monotone" dataKey="ssp585" name="SSP5-8.5" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.12} strokeWidth={2} />
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
                  <Line type="monotone" dataKey="ssp126" name="SSP1-2.6" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ssp245" name="SSP2-4.5" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ssp585" name="SSP5-8.5" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Implications for Mine Reclamation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Under SSP5-8.5, soil moisture could decline by 14%, severely impacting vegetation establishment on mine overburden</p>
              <p>• Warming of 0.59°C/decade (observed 2000–2019) accelerates evapotranspiration and soil drying</p>
              <p>• Reclamation plans must account for 1-month temporal lag between warming stress and productivity loss</p>
              <p>• Climate-resilient species selection and improved irrigation infrastructure are essential</p>
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
                  <CardDescription>Feature importance — based on Kashyap & Kuttippurath (2024)</CardDescription>
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
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {driverImportance.map((d) => (
                  <div key={d.driver} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">{d.driver}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${(d.importance / 35) * 100}%`, backgroundColor: d.color }} />
                      </div>
                      <Badge variant="secondary" className="text-xs">{d.importance}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Key Findings</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { title: "Temperature–SM Relationship", desc: "Strong negative partial correlation (> −0.5) in agriculture-intensive regions of Indo-Gangetic Plain and South India." },
                { title: "Warming-Induced Moisture Stress", desc: "Land warming (0.59°C/dec) and rising soil heat flux (0.16 W/m²/dec) drive SM drying, reducing GPP and crop yields." },
                { title: "Temporal Lag", desc: "Granger Causality analysis shows warming-induced SM stress has a maximum temporal lag of 1 month on vegetation productivity." },
              ].map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/40">
                  <p className="font-medium">{f.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">{f.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Soil Moisture Changes</CardTitle>
              <CardDescription>Observed SM reduction trends by season (2000–2019)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {seasonalImpact.map((s) => (
                <div key={s.season} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{s.season}</p>
                    <Badge variant={s.risk === "High" ? "destructive" : "secondary"} className="mt-1 text-xs">{s.risk} Risk</Badge>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center"><p className="text-xs text-muted-foreground">SM</p><p className="font-bold text-destructive">{s.smChange}%</p></div>
                    <div className="text-center"><p className="text-xs text-muted-foreground">Temp</p><p className="font-bold text-chart-5">+{s.tempChange}°C</p></div>
                    <div className="text-center"><p className="text-xs text-muted-foreground">Precip</p><p className={`font-bold ${s.precipChange > 0 ? "text-accent" : "text-destructive"}`}>{s.precipChange > 0 ? "+" : ""}{s.precipChange}%</p></div>
                  </div>
                </div>
              ))}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="py-4 text-sm">
                  <p className="font-medium mb-1">Reclamation Implications</p>
                  <p className="text-muted-foreground text-xs">
                    Monsoon (Kharif) and winter (Rabi) seasons show the highest SM decline. Mine reclamation efforts should time planting with post-monsoon moisture peaks and install supplemental irrigation for dry season survival.
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
              <CardDescription>Global climate models for future projection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cmip6Models.map((model) => (
                <div key={model.name} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.institution}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="secondary" className="text-xs">{model.resolution}</Badge>
                    <a href={`https://${model.source}/projects/cmip6/`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Source →</a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Data Sources</CardTitle>
              <CardDescription>Remote sensing and reanalysis datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-xs uppercase tracking-wide text-muted-foreground">Dataset</th>
                      <th className="text-left p-3 font-medium text-xs uppercase tracking-wide text-muted-foreground">Resolution</th>
                      <th className="text-left p-3 font-medium text-xs uppercase tracking-wide text-muted-foreground">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "ESA CCI Soil Moisture", res: "0.25° × 0.25°", url: "esa-soilmoisture-cci.org" },
                      { name: "GPM Precipitation (Level-3)", res: "0.1° × 0.1°", url: "daac.gsfc.nasa.gov" },
                      { name: "GLDAS SM, Temperature", res: "0.25° × 0.25°", url: "daac.gsfc.nasa.gov" },
                      { name: "FLDAS Soil Heat Flux", res: "0.1° × 0.25°", url: "daac.gsfc.nasa.gov" },
                      { name: "MODIS NDVI (MOD13C2)", res: "0.05°", url: "lpdaac.usgs.gov" },
                    ].map((ds, i) => (
                      <tr key={i} className="border-b border-muted/30">
                        <td className="p-3 font-medium">{ds.name}</td>
                        <td className="p-3"><Badge variant="outline" className="text-xs">{ds.res}</Badge></td>
                        <td className="p-3">
                          <a href={`https://${ds.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{ds.url}</a>
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
