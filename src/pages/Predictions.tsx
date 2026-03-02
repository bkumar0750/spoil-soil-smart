import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, TreePine, Download, AlertCircle, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisMap } from "@/components/AnalysisMap";
import { MoistureChart } from "@/components/MoistureChart";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const DEMO_DATA = [
  {
    id: "demo-1",
    latitude: 22.1564,
    longitude: 85.5184,
    location_name: "Jharsuguda Mine Site A",
    soil_moisture: { average: "0.185", min: "0.121", max: "0.248", trend: "increasing" },
    vegetation_indices: { ndvi: { average: "0.32", status: "Moderate", description: "Vegetation recovery in progress" }, evi: { average: "0.28", status: "Low-Moderate", description: "Early-stage canopy development" }, savi: { average: "0.30", status: "Moderate", description: "Adjusted for soil background" } },
    soil_properties: { ph: "6.8", organicCarbon: "1.2%", texture: "Sandy Loam", bulkDensity: "1.45 g/cm³" },
    growth_potential: { score: "72", suitability: "High", recommendedSpecies: ["Acacia nilotica", "Azadirachta indica"], limitations: ["Low organic matter"], recommendations: ["Add compost mulch"] },
    analyzed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "demo-2",
    latitude: 22.1720,
    longitude: 85.5350,
    location_name: "Jharsuguda Mine Site B",
    soil_moisture: { average: "0.142", min: "0.089", max: "0.195", trend: "stable" },
    vegetation_indices: { ndvi: { average: "0.18", status: "Low", description: "Sparse vegetation cover" }, evi: { average: "0.15", status: "Low", description: "Limited canopy" }, savi: { average: "0.17", status: "Low", description: "High soil reflectance" } },
    soil_properties: { ph: "5.9", organicCarbon: "0.6%", texture: "Loamy Sand", bulkDensity: "1.62 g/cm³" },
    growth_potential: { score: "45", suitability: "Moderate", recommendedSpecies: ["Leucaena leucocephala", "Cassia siamea"], limitations: ["Low moisture", "Acidic soil"], recommendations: ["Lime application", "Drip irrigation"] },
    analyzed_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "demo-3",
    latitude: 22.1400,
    longitude: 85.5000,
    location_name: "Sundargarh Reclamation Zone",
    soil_moisture: { average: "0.263", min: "0.198", max: "0.321", trend: "increasing" },
    vegetation_indices: { ndvi: { average: "0.48", status: "Good", description: "Healthy vegetation growth" }, evi: { average: "0.42", status: "Good", description: "Dense canopy forming" }, savi: { average: "0.45", status: "Good", description: "Strong vegetation signal" } },
    soil_properties: { ph: "7.2", organicCarbon: "2.1%", texture: "Clay Loam", bulkDensity: "1.32 g/cm³" },
    growth_potential: { score: "88", suitability: "Very High", recommendedSpecies: ["Dalbergia sissoo", "Tectona grandis", "Acacia nilotica"], limitations: ["Seasonal waterlogging"], recommendations: ["Raised bed planting", "Drainage channels"] },
    analyzed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "demo-4",
    latitude: 22.1650,
    longitude: 85.4850,
    location_name: "IB Valley Coal Field",
    soil_moisture: { average: "0.098", min: "0.062", max: "0.134", trend: "decreasing" },
    vegetation_indices: { ndvi: { average: "0.12", status: "Very Low", description: "Barren overburden" }, evi: { average: "0.09", status: "Very Low", description: "No significant vegetation" }, savi: { average: "0.11", status: "Very Low", description: "Dominated by soil signal" } },
    soil_properties: { ph: "4.8", organicCarbon: "0.3%", texture: "Sandy", bulkDensity: "1.78 g/cm³" },
    growth_potential: { score: "22", suitability: "Low", recommendedSpecies: ["Leucaena leucocephala"], limitations: ["Very low moisture", "Highly acidic", "Poor structure"], recommendations: ["Heavy liming", "Organic amendment", "Pioneer species first"] },
    analyzed_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const Predictions = () => {
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  useEffect(() => {
    setFilteredData(analysisData);
  }, [analysisData]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .order('analyzed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setAnalysisData(data);
        setUsingDemo(false);
      } else {
        setAnalysisData(DEMO_DATA);
        setUsingDemo(true);
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setAnalysisData(DEMO_DATA);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast({ title: "No Data", description: "No data available to export", variant: "destructive" });
      return;
    }
    const headers = ["Location Name","Latitude","Longitude","Analyzed Date","Soil Moisture (Average)","Soil Moisture (Min)","Soil Moisture (Max)","Soil Moisture Trend","Growth Potential Score","Growth Potential Suitability"];
    const rows = filteredData.map((item) => [
      item.location_name || "N/A", item.latitude, item.longitude,
      format(new Date(item.analyzed_at), "yyyy-MM-dd HH:mm:ss"),
      item.soil_moisture?.average || "N/A", item.soil_moisture?.min || "N/A",
      item.soil_moisture?.max || "N/A", item.soil_moisture?.trend || "N/A",
      item.growth_potential?.score || "N/A", item.growth_potential?.suitability || "N/A",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `analysis_data_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: `Exported ${filteredData.length} records to CSV` });
  };

  const downloadFile = (content: string | Blob, filename: string, type: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const downloadGeoTIFF = () => {
    if (filteredData.length === 0) { toast({ title: "No Data", description: "No data available to export", variant: "destructive" }); return; }
    const bounds = {
      minLat: Math.min(...filteredData.map(d => d.latitude)), maxLat: Math.max(...filteredData.map(d => d.latitude)),
      minLon: Math.min(...filteredData.map(d => d.longitude)), maxLon: Math.max(...filteredData.map(d => d.longitude)),
    };
    const cols = 20, rows = 20;
    const cellSizeX = (bounds.maxLon - bounds.minLon + 0.02) / cols;
    const cellSizeY = (bounds.maxLat - bounds.minLat + 0.02) / rows;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(-9999));
    filteredData.forEach(point => {
      const moisture = parseFloat(point.soil_moisture?.average || "0") * 100;
      const col = Math.min(cols - 1, Math.max(0, Math.floor((point.longitude - (bounds.minLon - 0.01)) / cellSizeX)));
      const row = Math.min(rows - 1, Math.max(0, Math.floor(((bounds.maxLat + 0.01) - point.latitude) / cellSizeY)));
      grid[row][col] = moisture.toFixed(2);
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === -9999) {
            const dist = Math.sqrt(dr * dr + dc * dc);
            grid[nr][nc] = Math.max(0, moisture - dist * 2.5).toFixed(2);
          }
        }
      }
    });
    const header = [`ncols ${cols}`,`nrows ${rows}`,`xllcorner ${bounds.minLon - 0.01}`,`yllcorner ${bounds.minLat - 0.01}`,`cellsize ${cellSizeX.toFixed(6)}`,`NODATA_value -9999`].join("\n");
    const body = grid.map(r => r.join(" ")).join("\n");
    downloadFile(`${header}\n${body}`, `soil_moisture_${format(new Date(), "yyyyMMdd")}.asc`, "text/plain");
    toast({ title: "Downloaded", description: "Esri ASCII Grid file (.asc) exported" });
  };

  const exportShapefile = () => {
    if (filteredData.length === 0) { toast({ title: "No Data", description: "No data available to export", variant: "destructive" }); return; }
    const geojson = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::4326" } },
      features: filteredData.map(item => ({
        type: "Feature",
        properties: {
          id: item.id, name: item.location_name || "Unknown", analyzed_at: item.analyzed_at,
          sm_avg: parseFloat(item.soil_moisture?.average || "0"),
          ndvi: parseFloat(item.vegetation_indices?.ndvi?.average || "0"),
          gp_score: parseInt(item.growth_potential?.score || "0"),
          gp_suit: item.growth_potential?.suitability || "N/A",
          species: (item.growth_potential?.recommendedSpecies || []).join("; "),
        },
        geometry: { type: "Point", coordinates: [item.longitude, item.latitude] },
      })),
    };
    downloadFile(JSON.stringify(geojson, null, 2), `analysis_points_${format(new Date(), "yyyyMMdd")}.geojson`, "application/geo+json");
    toast({ title: "Downloaded", description: "GeoJSON file exported" });
  };

  const generateReport = () => {
    if (filteredData.length === 0) { toast({ title: "No Data", description: "No data available for report", variant: "destructive" }); return; }
    const avgMoisture = (filteredData.reduce((s, d) => s + parseFloat(d.soil_moisture?.average || "0"), 0) / filteredData.length * 100).toFixed(1);
    const avgNdvi = (filteredData.reduce((s, d) => s + parseFloat(d.vegetation_indices?.ndvi?.average || "0"), 0) / filteredData.length).toFixed(3);
    const avgScore = (filteredData.reduce((s, d) => s + parseInt(d.growth_potential?.score || "0"), 0) / filteredData.length).toFixed(0);
    const siteRows = filteredData.map(d => `<tr><td style="padding:8px;border:1px solid #ddd;">${d.location_name || "N/A"}</td><td style="padding:8px;border:1px solid #ddd;">${d.latitude.toFixed(4)}, ${d.longitude.toFixed(4)}</td><td style="padding:8px;border:1px solid #ddd;">${(parseFloat(d.soil_moisture?.average || "0") * 100).toFixed(1)}%</td><td style="padding:8px;border:1px solid #ddd;">${d.vegetation_indices?.ndvi?.average || "N/A"}</td><td style="padding:8px;border:1px solid #ddd;">${d.growth_potential?.score || "N/A"}</td><td style="padding:8px;border:1px solid #ddd;">${d.growth_potential?.suitability || "N/A"}</td><td style="padding:8px;border:1px solid #ddd;">${(d.growth_potential?.recommendedSpecies || []).join(", ")}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Soil Moisture Analysis Report</title><style>body{font-family:Georgia,serif;max-width:900px;margin:40px auto;color:#1a1a1a;line-height:1.6}h1{color:#2d5016;border-bottom:3px solid #2d5016;padding-bottom:10px}h2{color:#3d6b22;margin-top:30px}table{border-collapse:collapse;width:100%;margin:16px 0}th{background:#2d5016;color:#fff;padding:10px;text-align:left}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:20px 0}.stat{background:#f0f7ec;padding:20px;border-radius:8px;text-align:center}.stat .value{font-size:28px;font-weight:bold;color:#2d5016}.stat .label{font-size:12px;color:#666;margin-top:4px}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#999}</style></head><body><h1>🌱 SoilSense — Mine Reclamation Analysis Report</h1><p><strong>Generated:</strong> ${format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}</p><p><strong>Sites Analyzed:</strong> ${filteredData.length} | <strong>Data Source:</strong> ${usingDemo ? "Demo Dataset" : "Sentinel-1/2 + Field Surveys"}</p><h2>Summary Statistics</h2><div class="stat-grid"><div class="stat"><div class="value">${avgMoisture}%</div><div class="label">Mean Soil Moisture</div></div><div class="stat"><div class="value">${avgNdvi}</div><div class="label">Mean NDVI</div></div><div class="stat"><div class="value">${avgScore}</div><div class="label">Mean Growth Score</div></div></div><h2>Site-Level Results</h2><table><thead><tr><th>Location</th><th>Coordinates</th><th>SM</th><th>NDVI</th><th>Score</th><th>Suitability</th><th>Species</th></tr></thead><tbody>${siteRows}</tbody></table><h2>Recommendations</h2><ul>${filteredData.flatMap(d => (d.growth_potential?.recommendations || []).map((r: string) => `<li><strong>${d.location_name}:</strong> ${r}</li>`)).join("")}</ul><div class="footer">Report generated by SoilSense — Mine Reclamation Decision Support System<br>CRS: WGS84 (EPSG:4326) | Model: XGBoost + Sentinel-1/2 fusion</div></body></html>`;
    downloadFile(html, `analysis_report_${format(new Date(), "yyyyMMdd")}.html`, "text/html");
    toast({ title: "Report Generated", description: "HTML report downloaded" });
  };

  const moistureClasses = [
    { range: "< 10%", label: "Very Dry", color: "bg-destructive", suitability: "Low" },
    { range: "10-15%", label: "Dry", color: "bg-chart-5", suitability: "Low-Moderate" },
    { range: "15-20%", label: "Moderate", color: "bg-chart-3", suitability: "Moderate" },
    { range: "20-25%", label: "Moist", color: "bg-primary", suitability: "High" },
    { range: "> 25%", label: "Very Moist", color: "bg-accent", suitability: "Very High" },
  ];

  const speciesSuitability = [
    { species: "Acacia nilotica", moisture: "15-25%", ph: "6.5-8.5", slope: "< 30%", suitableArea: "45%", rating: "High" },
    { species: "Azadirachta indica", moisture: "18-28%", ph: "6.0-8.0", slope: "< 20%", suitableArea: "32%", rating: "High" },
    { species: "Dalbergia sissoo", moisture: "20-30%", ph: "6.5-7.5", slope: "< 15%", suitableArea: "18%", rating: "Moderate" },
    { species: "Leucaena leucocephala", moisture: "12-22%", ph: "5.5-8.5", slope: "< 35%", suitableArea: "52%", rating: "Very High" },
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
    <div className="container py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="mb-1">Analysis Results</Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Predictions & Suitability Maps</h1>
        <p className="text-muted-foreground max-w-3xl">
          Interactive soil moisture predictions and species suitability analysis for mine overburden reclamation planning.
        </p>
      </div>

      {/* Demo Data Banner */}
      {usingDemo && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Viewing Demo Data</p>
                <p className="text-xs text-muted-foreground">
                  Sample analysis results for demonstration. Run an analysis from the Home page to see real data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter and Export Controls */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredData.length}</span> of {analysisData.length} records
              {usingDemo && <Badge variant="secondary" className="ml-2 text-[10px]">Demo</Badge>}
            </div>
            <Button onClick={exportToCSV} size="sm" className="gap-2">
              <FileDown className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Map and Charts */}
      {!loading && filteredData.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Analysis Locations Map
              </CardTitle>
              <CardDescription>Geographic distribution of analyzed mine areas with soil moisture indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisMap analysisPoints={filteredData} />
            </CardContent>
          </Card>
          <MoistureChart data={filteredData} />
        </div>
      )}

      {loading && (
        <Card><CardContent className="py-12"><p className="text-center text-muted-foreground">Loading analysis data...</p></CardContent></Card>
      )}

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
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Soil Moisture Prediction Map</CardTitle>
                  <CardDescription>Predicted surface soil moisture (0-10cm depth) across mine overburden</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="w-full h-80 bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center space-y-2">
                  <MapPin className="h-10 w-10 mx-auto text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Interactive map visualization</p>
                  <p className="text-xs text-muted-foreground">Integrated with Leaflet for production use</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Moisture Classification</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {moistureClasses.map((cls, index) => (
                      <div key={index} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-3 w-3 rounded-sm ${cls.color}`} />
                          <div>
                            <p className="text-sm font-medium">{cls.label}</p>
                            <p className="text-xs text-muted-foreground">{cls.range}</p>
                          </div>
                        </div>
                        <Badge variant={cls.suitability === "High" || cls.suitability === "Very High" ? "default" : "secondary"} className="text-xs">
                          {cls.suitability}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Summary Statistics</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { label: "Mean Moisture", value: "18.5%", highlight: true },
                      { label: "Std. Deviation", value: "±4.2%" },
                      { label: "Min – Max", value: "8.3% – 32.1%" },
                      { label: "Suitable Area", value: "62%", highlight: true },
                      { label: "Mean Uncertainty", value: "±1.8%" },
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between py-1.5 px-2 rounded-md bg-muted/40">
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                        <span className={`text-sm font-semibold ${s.highlight ? "text-primary" : ""}`}>{s.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={downloadGeoTIFF} size="sm" className="gap-2"><Download className="h-4 w-4" />Download GeoTIFF</Button>
                <Button onClick={exportShapefile} size="sm" variant="outline" className="gap-2"><Download className="h-4 w-4" />Export Shapefile</Button>
                <Button onClick={generateReport} size="sm" variant="secondary" className="gap-2"><Download className="h-4 w-4" />Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suitability" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TreePine className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Tree Species Suitability Analysis</CardTitle>
                  <CardDescription>Multi-criteria assessment combining moisture, soil chemistry, and topography</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4">
                {speciesSuitability.map((species, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <TreePine className="h-4 w-4 text-primary" />
                          <span className="font-semibold italic">{species.species}</span>
                        </div>
                        <Badge variant={species.rating === "Very High" || species.rating === "High" ? "default" : "secondary"}>
                          {species.rating} Suitability
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-xs text-muted-foreground">Moisture</p><p className="font-medium">{species.moisture}</p></div>
                        <div><p className="text-xs text-muted-foreground">pH Range</p><p className="font-medium">{species.ph}</p></div>
                        <div><p className="text-xs text-muted-foreground">Max Slope</p><p className="font-medium">{species.slope}</p></div>
                        <div><p className="text-xs text-muted-foreground">Suitable Area</p><p className="font-semibold text-primary">{species.suitableArea}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-accent/30 bg-accent/5">
                <CardHeader className="pb-3"><CardTitle className="text-base">Suitability Criteria (MCDA)</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-3 rounded-lg bg-background">
                      <p className="font-medium mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">Primary Factors (60%)</p>
                      <ul className="space-y-1 text-muted-foreground text-xs">
                        <li>• Soil moisture range (30%)</li>
                        <li>• pH compatibility (15%)</li>
                        <li>• Slope tolerance (15%)</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <p className="font-medium mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">Secondary Factors (40%)</p>
                      <ul className="space-y-1 text-muted-foreground text-xs">
                        <li>• Soil texture (15%)</li>
                        <li>• Contamination level (10%)</li>
                        <li>• Drainage class (10%) • Aspect (5%)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Available Map Layers</CardTitle>
                  <CardDescription>Toggle and export different thematic layers for analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mapLayers.map((layer, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4 rounded border-border" />
                    <div>
                      <p className="text-sm font-medium">{layer.name}</p>
                      <p className="text-xs text-muted-foreground">{layer.description}</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reclamation Recommendations</CardTitle>
              <CardDescription>Data-driven guidance for successful afforestation on mine overburden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><TreePine className="h-4 w-4 text-primary" />Priority Planting Zones</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Zone 1 — High Suitability (Northern benches, 25% of area)</p>
                    <ul className="mt-1 space-y-0.5 text-muted-foreground ml-4">
                      <li>• Soil moisture: 20–28%, ideal for most species</li>
                      <li>• Gentle slopes (&lt;15%), low erosion risk</li>
                      <li>• Recommended: Azadirachta indica, Dalbergia sissoo</li>
                      <li>• Survival probability: &gt;85%</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Zone 2 — Moderate Suitability (Central terraces, 40% of area)</p>
                    <ul className="mt-1 space-y-0.5 text-muted-foreground ml-4">
                      <li>• Soil moisture: 15–20%, adequate with amendments</li>
                      <li>• Moderate slopes (15–25%), requires erosion control</li>
                      <li>• Recommended: Acacia nilotica, Leucaena leucocephala</li>
                      <li>• Survival probability: 65–75%</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-5">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-chart-5" />Management Interventions Required</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Dry Zones (&lt;15% moisture, 20% of area)</p>
                    <ul className="mt-1 space-y-0.5 text-muted-foreground ml-4">
                      <li>• Install drip irrigation for first 2 years</li>
                      <li>• Apply organic mulch (10cm layer) to retain moisture</li>
                      <li>• Use drought-tolerant pioneer species (Leucaena)</li>
                      <li>• Create micro-catchments for rainfall harvesting</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Steep Slopes (&gt;30%, 15% of area)</p>
                    <ul className="mt-1 space-y-0.5 text-muted-foreground ml-4">
                      <li>• Implement bench terracing before planting</li>
                      <li>• Use geotextile erosion control blankets</li>
                      <li>• Plant deep-rooted species for slope stabilization</li>
                      <li>• Establish vegetative barriers at bench edges</li>
                    </ul>
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
