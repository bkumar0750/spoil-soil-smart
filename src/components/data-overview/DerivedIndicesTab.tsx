import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, TrendingUp } from "lucide-react";
import dataLayersImage from "@/assets/data-layers.jpg";

const derivedIndices = [
  { name: "VH/VV Ratio", formula: "σ⁰_VH / σ⁰_VV (linear scale) or VH_dB - VV_dB (dB scale)", purpose: "SAR moisture proxy", importance: "26.3%", model: "RF, XGBoost, CNN", notes: "Highest single-feature importance. Sensitive to dielectric constant changes from soil water content variation. Cross-polarization ratio reduces surface roughness effects. Temporal coefficient of variation (CV) captures seasonal SM dynamics.", sensitivity: "Δ(VH/VV) ≈ 0.015 per 0.01 m³/m³ SM change", range: "[-15, -5] dB typical for bare/sparse soil" },
  { name: "NDVI", formula: "(B8_NIR - B4_Red) / (B8_NIR + B4_Red)", purpose: "Vegetation health & phenology", importance: "22.4%", model: "RF, XGBoost, CNN-LSTM", notes: "STL temporal decomposition into trend + seasonal + residual. Trend captures long-term reclamation trajectory. Seasonal amplitude correlates with SM availability (r=0.68). Lag-1 autocorrelation used as temporal persistence feature. Saturates at LAI > 3.", sensitivity: "Δ NDVI ≈ 0.04 per 0.05 m³/m³ SM change (sparse vegetation)", range: "[-1, 1], typical mine sites: [0.05, 0.45]" },
  { name: "TWI", formula: "ln(α / tan(β)), α = upslope contributing area (m²/m), β = local slope (radians)", purpose: "Topographic moisture accumulation", importance: "18.7%", model: "RF, XGBoost, GBM", notes: "Static feature — computed once from DEM. Higher TWI = greater moisture accumulation potential. Strongly correlated with SM at 30-60cm depth (r=0.71). Multi-scale TWI computed at 3×3, 5×5, 7×7 kernels. Log-transformed α handles extreme flow accumulation values. D8 flow algorithm used for α computation.", sensitivity: "Static predictor — no temporal sensitivity", range: "[2, 20], mine benches typically [4, 12]" },
  { name: "SAVI", formula: "((B8 - B4) / (B8 + B4 + L)) × (1 + L), L = 0.5", purpose: "Soil-adjusted vegetation index", importance: "14.1%", model: "RF, SVR", notes: "L=0.5 for intermediate vegetation cover typical of mine reclamation sites. Preferred over NDVI in sparse-cover areas to reduce soil background noise. Modified SAVI (MSAVI2) used where vegetation cover < 15%. Soil line parameters (a, b) calibrated from bare-soil pixels in study area.", sensitivity: "Less sensitive to soil brightness than NDVI by ~40%", range: "[-1, 1], improved linearity with vegetation fraction vs NDVI" },
  { name: "SMI (Soil Moisture Index)", formula: "f(σ⁰_VV, σ⁰_VH, NDVI, API, LST, TWI) — multi-variate composite", purpose: "Composite SM target variable", importance: "Target", model: "Multi-output ensemble", notes: "Engineered composite target combining SAR backscatter physics with optical/climate drivers. Calibrated against gravimetric SM measurements (n=150, R²=0.87). Validated using ESA CCI SM product at coarse scale. Three-depth version: SMI_surface (0-10cm), SMI_subsurface (10-30cm), SMI_rootzone (30-60cm).", sensitivity: "Target variable — calibrated to m³/m³", range: "[0.02, 0.45] m³/m³ across mine sites" },
  { name: "BSI (Bare Soil Index)", formula: "((B11_SWIR + B4_Red) - (B8_NIR + B2_Blue)) / ((B11 + B4) + (B8 + B2))", purpose: "Exposed mine surface detection", importance: "8.9%", model: "RF, SVM", notes: "Identifies exposed mine surfaces and overburden dumps. Used for land cover stratification in ensemble models — separate sub-models for bare vs. vegetated pixels. BSI > 0.1 threshold flags active mining disturbance. Temporal BSI decrease trajectory quantifies reclamation progress rate.", sensitivity: "BSI > 0.1 = bare soil; BSI < -0.1 = dense vegetation", range: "[-0.3, 0.4] typical range in mining landscapes" },
  { name: "MNDWI", formula: "(B3_Green - B11_SWIR) / (B3_Green + B11_SWIR)", purpose: "Water body / waterlogging detection", importance: "6.2%", model: "RF, SVM", notes: "Masks permanent water bodies from SM analysis. Threshold-based binary feature: MNDWI > 0.0 = water/waterlogged. Critical for mine pit lake detection and dewatering zone identification. Seasonal MNDWI variation detects ephemeral water accumulation in mine benches.", sensitivity: "MNDWI > 0 = water; MNDWI < 0 = non-water", range: "[-1, 1], water bodies: [0.2, 0.8]" },
  { name: "NDMI (Normalized Difference Moisture Index)", formula: "(B8_NIR - B11_SWIR) / (B8_NIR + B11_SWIR)", purpose: "Canopy & soil water content", importance: "11.3%", model: "RF, XGBoost", notes: "Directly sensitive to leaf and soil water content via SWIR absorption. Better SM predictor than NDVI in moderate vegetation cover (30-60%). Drought stress detection: NDMI anomaly < -0.15 flags water deficit. Combines well with VH/VV for vegetation-soil water partitioning.", sensitivity: "Δ NDMI ≈ 0.06 per 0.05 m³/m³ SM change", range: "[-0.5, 0.6], stressed vegetation: [-0.2, 0.1]" },
  { name: "EVI (Enhanced Vegetation Index)", formula: "2.5 × (B8 - B4) / (B8 + 6×B4 - 7.5×B2 + 1)", purpose: "High-biomass vegetation monitoring", importance: "9.7%", model: "CNN-LSTM, XGBoost", notes: "Resists saturation at high LAI (>3) where NDVI plateaus. Atmospheric correction built into formula (blue band term). Preferred for monsoon-season analysis when atmospheric aerosol load is high. Captures canopy structural differences between native forest and planted reclamation species.", sensitivity: "Linear response to vegetation fraction up to 80% cover", range: "[0, 0.8], mine reclamation typically [0.05, 0.35]" },
];

const featureInteractions = [
  { pair: "VH/VV × NDVI", effect: "Separates vegetation water content from soil water signal", importance: "+3.2% ensemble R²" },
  { pair: "TWI × Slope", effect: "Captures non-linear moisture accumulation on gentle slopes", importance: "+2.1% RF R²" },
  { pair: "API_7day × BSI", effect: "Rainfall impact differs on bare vs. vegetated surfaces", importance: "+1.8% XGBoost R²" },
  { pair: "LST × NDMI", effect: "Temperature-moisture stress coupling (Kashyap 2024)", importance: "+2.7% ensemble R²" },
  { pair: "Slope × Curvature", effect: "Flow acceleration in concave positions", importance: "+1.4% RF R²" },
];

const DerivedIndicesTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Derived Indices & Feature Engineering</CardTitle>
              <CardDescription>Spectral indices with formulas, sensitivity analysis, ML importance scores, and value ranges</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {derivedIndices.map((idx, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-lg">{idx.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge>{idx.purpose}</Badge>
                      <Badge variant="secondary">Importance: {idx.importance}</Badge>
                      <Badge variant="outline">{idx.model}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <code className="text-sm bg-muted p-3 rounded block font-mono">{idx.formula}</code>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">ML Notes</p>
                      <p className="text-xs text-muted-foreground">{idx.notes}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Sensitivity</p>
                      <code className="text-[10px] bg-muted p-1.5 rounded block font-mono text-muted-foreground">{idx.sensitivity}</code>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Value Range</p>
                      <code className="text-[10px] bg-muted p-1.5 rounded block font-mono text-muted-foreground">{idx.range}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-accent/20 bg-accent/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Feature Interaction Terms</CardTitle>
              </div>
              <CardDescription>Multiplicative interactions that improve model performance beyond individual features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Interaction Pair</th>
                      <th className="text-left p-3 font-medium">Physical Effect</th>
                      <th className="text-left p-3 font-medium">R² Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureInteractions.map((fi, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-3"><code className="font-mono text-xs bg-muted p-1 rounded">{fi.pair}</code></td>
                        <td className="p-3 text-muted-foreground text-xs">{fi.effect}</td>
                        <td className="p-3"><Badge variant="secondary">{fi.importance}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <img src={dataLayersImage} alt="Data layers visualization" className="rounded-lg shadow-lg w-full h-auto" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DerivedIndicesTab;
