import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, AlertTriangle, Target } from "lucide-react";

const fieldParameters = [
  {
    category: "Soil Physical Properties",
    params: [
      "Gravimetric SM θ_g (0-10cm, 10-30cm, 30-60cm) — oven-dry 105°C/24h",
      "Volumetric SM θ_v = θ_g × ρ_b/ρ_w (TDR validation)",
      "Texture: Sand/Silt/Clay % (hydrometer + sieve method)",
      "Bulk density ρ_b (core method, 100cm³ rings)",
      "Porosity φ = 1 - (ρ_b/ρ_s), ρ_s ≈ 2.65 g/cm³",
      "Saturated hydraulic conductivity K_sat (constant-head permeameter)",
      "Infiltration rate (double-ring infiltrometer, Horton model fit)",
    ],
    mlTraining: "Primary target variable: θ_v at 3 depths → multi-output regression. Pedotransfer functions (Saxton & Rawls, 2006) estimate K_sat and field capacity from texture inputs. Feature importance: Texture ~18%, Porosity ~12%, ρ_b ~8%. Depth-wise prediction enables root-zone SM profiling critical for reclamation vegetation survival assessment.",
    encoding: "θ_v: continuous [0, φ]. Texture: compositional (sums to 100%), log-ratio transformed for normality. ρ_b: continuous, standardized. K_sat: log₁₀-transformed (spans orders of magnitude). Multi-output target matrix: Y ∈ ℝ^(n×3) for 3-depth prediction.",
    qualityControl: "Duplicate samples (10% of total). Outlier detection: Z > 3 removed. Instrument calibration: TDR vs. gravimetric R² > 0.92.",
  },
  {
    category: "Soil Chemical Properties",
    params: [
      "pH (1:2.5 soil:water suspension, glass electrode)",
      "Electrical conductivity EC (1:5 extract, dS/m)",
      "Soil organic carbon SOC (Walkley-Black / dry combustion)",
      "Total N (Kjeldahl method), Available P (Olsen), Exchangeable K (NH₄OAc)",
      "Heavy metals: Fe, Mn, Cu, Zn, Pb, Cd (DTPA extraction, AAS/ICP-OES)",
      "Cation Exchange Capacity CEC (NH₄OAc pH 7.0)",
      "Base saturation % = (Ca+Mg+K+Na)/CEC × 100",
    ],
    mlTraining: "Secondary features for reclamation suitability classification. SOC strongly correlated with water-holding capacity (Pearson r=0.72) and θ_v at field capacity. EC as salinity stress indicator — threshold >4 dS/m flags sodic conditions inhibiting plant establishment. Heavy metal toxicity index (HMI) = Σ(C_i/MAC_i) as composite risk feature. CEC proxy for nutrient retention capacity.",
    encoding: "pH: raw (already ~normal). EC, heavy metals: log₁₀-transformed for right-skew correction. SOC: arcsine-sqrt for proportional data. NPK: Z-score standardized. HMI: derived composite, continuous. CEC: min-max [0,1]. Missing values: multiple imputation (MICE, 5 iterations).",
    qualityControl: "Certified reference materials (CRM) for AAS validation. Method detection limits: Cd=0.01, Pb=0.05 mg/kg. Inter-lab comparison for 5% of samples.",
  },
  {
    category: "Topographic & Geomorphic",
    params: [
      "Slope (%) — RTK-GPS survey + DEM extraction",
      "Aspect (degrees) — sin/cos decomposition for ML",
      "Elevation (m ASL) — RTK-GPS (±2cm vertical)",
      "Micro-topography: surface roughness (chain method, RR index)",
      "Drainage class (1-5 ordinal: excessive → very poor)",
      "Landform: ridge / slope / valley / bench / pit floor (categorical)",
      "Distance to nearest water body / drainage channel (m)",
    ],
    mlTraining: "Static terrain features — computed once from DEM, invariant across time. TWI = ln(α/tan(β)) ranked #3 in RF importance (18.7%). Slope × plan_curvature interaction term improves R² by +0.04 in XGBoost. Aspect encoded as sin(θ)/cos(θ) for cyclical continuity (avoids 0°/360° discontinuity). Landform stratification enables ensemble model switching: separate RF sub-models per landform class.",
    encoding: "Aspect: [sin(θ), cos(θ)] — 2 continuous features. Slope: continuous, log-transformed for extreme values. Elevation: min-max scaled per study area. Drainage: ordinal (1-5). Landform: one-hot (5 classes). Distance metrics: Euclidean (flat terrain) or cost-distance (slope-weighted). Surface roughness: continuous RR index.",
    qualityControl: "RTK-GPS accuracy: horizontal ±1cm, vertical ±2cm. DEM validation: RMSE < 2m vs. GPS checkpoints (n=30). Cross-slope transect surveys for micro-topography calibration.",
  },
  {
    category: "Vegetation & Ecology",
    params: [
      "NDVI in-situ (handheld spectroradiometer, ASD FieldSpec)",
      "EVI, SAVI — computed from field spectra",
      "Canopy cover % (hemispherical photography, Gap Light Analyzer)",
      "Basal area (m²/ha, point-centered quarter method)",
      "Species richness & Shannon diversity index H'",
      "Leaf Area Index LAI (LAI-2200C plant canopy analyzer)",
      "Aboveground biomass AGB (allometric equations by species)",
    ],
    mlTraining: "Temporal vegetation indices as dynamic features capturing seasonal phenology. NDVI time-series decomposed via STL (Seasonal-Trend-Loess) for trend + seasonal + residual components — each becomes a separate feature. Species diversity (H') as reclamation success metric for classification target. LAI correlates with transpiration demand → inverse SM predictor. AGB estimated via species-specific allometric equations for carbon stock assessment.",
    encoding: "NDVI/EVI/SAVI: [-1,1] range, raw values retained. Cover %: continuous [0,100], arcsine-sqrt transformed. Species: one-hot (top-10 species) + 'other' bin. H': continuous [0, ln(S)]. LAI: continuous [0,8]. AGB: log-transformed (kg/m²). Phenological metrics: green-up date, peak date, senescence date as Julian day features.",
    qualityControl: "Spectroradiometer calibrated with Spectralon panel (99% reflectance). Hemispherical photos taken at overcast conditions or dawn/dusk. Plot size: 10×10m (herbs), 20×20m (trees). Minimum 3 replicates per sampling unit.",
  },
];

const FieldDataTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Field Measurements & Ground Truth Collection</CardTitle>
              <CardDescription>In-situ sampling protocols with ML feature engineering, encoding strategies, and quality control</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {fieldParameters.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1.5">
                    {category.params.map((param, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <code className="font-mono text-xs">{param}</code>
                      </li>
                    ))}
                  </ul>
                  <div className="grid gap-4 md:grid-cols-3 border-t pt-4">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">ML Training Role</p>
                      <p className="text-xs text-muted-foreground">{category.mlTraining}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Feature Encoding</p>
                      <code className="text-[10px] bg-muted p-2 rounded block font-mono text-muted-foreground leading-relaxed">{category.encoding}</code>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">Quality Control</p>
                      <p className="text-xs text-muted-foreground italic">{category.qualityControl}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Sampling Strategy & Data Splitting Protocol</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-semibold text-primary text-xs">Spatial Sampling Design</p>
                  <p>• <strong>Stratified random:</strong> Strata = slope class × texture × landform (3×3×5 = 45 strata)</p>
                  <p>• <strong>Sample size:</strong> 20-50 ground-truth points (minimum 3 per stratum)</p>
                  <p>• <strong>Multi-depth:</strong> 0-10cm (surface), 10-30cm (subsurface), 30-60cm (root zone)</p>
                  <p>• <strong>Seasonal coverage:</strong> Post-monsoon (Oct), winter (Jan), pre-monsoon (Apr), monsoon (Jul)</p>
                  <p>• <strong>GPS recording:</strong> RTK-DGPS (±2cm horizontal, ±5cm vertical) with photo documentation</p>
                  <p>• <strong>Spatial autocorrelation range:</strong> Estimated via semivariogram (Matérn model) — typically 200-500m</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-primary text-xs">ML Data Split Protocol</p>
                  <p>• <strong>Train / Val / Test:</strong> 70% / 15% / 15% with spatial blocking (block size = 2× autocorrelation range)</p>
                  <p>• <strong>Temporal holdout:</strong> Last 20% of time-series reserved for temporal generalization test</p>
                  <p>• <strong>Spatial CV:</strong> 5-fold spatial block CV with 500m buffer zones to prevent leakage</p>
                  <p>• <strong>Leave-One-Site-Out:</strong> For multi-site transferability assessment (LOSO-CV)</p>
                  <p>• <strong>Stratified splits:</strong> Ensures equal representation of SM classes (dry/moderate/wet) in each fold</p>
                  <p>• <strong>Leakage prevention:</strong> No spatial neighbors within buffer zone across train/test boundary</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 border-2 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Known Data Limitations & Bias Sources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• <strong>Spatial bias:</strong> Accessible areas over-sampled; steep slopes and active pits under-represented</p>
              <p>• <strong>Temporal bias:</strong> Dry-season sampling gaps in some years due to access restrictions</p>
              <p>• <strong>Scale mismatch:</strong> Point measurements (10cm core) vs. pixel footprint (10×10m) — upscaling uncertainty</p>
              <p>• <strong>Measurement uncertainty:</strong> Gravimetric SM precision ±0.02 m³/m³; TDR ±0.03 m³/m³ in high-clay soils</p>
              <p>• <strong>Covariate shift:</strong> Mine reclamation sites may differ from natural soil distributions → domain adaptation needed</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDataTab;
