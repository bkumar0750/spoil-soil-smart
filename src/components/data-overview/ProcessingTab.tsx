import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain, Workflow, Shield } from "lucide-react";

const ProcessingTab = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sentinel-2 Optical Processing Pipeline</CardTitle>
          <CardDescription>L1C → L2A surface reflectance with quality assurance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { step: "1", title: "Atmospheric Correction (L2A)", desc: "Sen2Cor v2.11: libRadtran-based radiative transfer. Outputs: BOA reflectance, AOT, WVP, SCL. Alternative: GEE ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')" },
            { step: "2", title: "Cloud & Shadow Masking", desc: "Scene Classification Layer (SCL) + s2cloudless (ML-based, threshold < 10%). Cloud shadow detection via sun-angle geometry. QA60 bitmask for cirrus (B10 > 0.01)." },
            { step: "3", title: "BRDF Normalization", desc: "c-factor correction using Ross-Thick/Li-Sparse kernel BRDF model. Normalizes to nadir view & solar zenith = 45°. Reduces multi-temporal reflectance variation by ~15%." },
            { step: "4", title: "Temporal Compositing", desc: "Monthly median compositing (robust to residual clouds). Quality-weighted: w = (1 - cloud_prob) × (1 / |Δt|). Minimum 3 clear observations per composite required." },
            { step: "5", title: "Spectral Index Computation", desc: "NDVI, EVI, SAVI (L=0.5), NDMI, BSI, MNDWI. Red-edge indices: NDRE = (B8A-B5)/(B8A+B5). Per-pixel uncertainty propagation from reflectance errors." },
            { step: "6", title: "Feature Extraction", desc: "Zonal statistics per sampling unit: mean, std, p10, p25, p50, p75, p90, IQR. Texture metrics: GLCM entropy, contrast, homogeneity (5×5 window). Phenological metrics via TIMESAT." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 shrink-0">{item.step}</Badge>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentinel-1 SAR Processing Pipeline</CardTitle>
          <CardDescription>GRD → Analysis-ready σ⁰ backscatter in dB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { step: "1", title: "Apply Orbit File", desc: "Precise orbit ephemerides (POD) for accurate geolocation. Restituted orbits within 24h; precise orbits after 20 days. Reduces geolocation error from ~5m to <1m." },
            { step: "2", title: "Thermal Noise Removal", desc: "Subtracts additive noise floor from DN values. Critical for inter-swath radiometric consistency in IW mode. Uses noise LUT from product annotation XML." },
            { step: "3", title: "Radiometric Calibration", desc: "DN → β⁰ → σ⁰ (sigma-nought) using calibration LUT. σ⁰ = β⁰ / sin(θ_local). Output in linear scale, converted to dB: 10·log₁₀(σ⁰). Per-pixel incidence angle preserved for normalization." },
            { step: "4", title: "Speckle Filtering", desc: "Refined Lee filter (7×7 window): preserves edges via local coefficient of variation test. ENL (Equivalent Number of Looks) improvement: ~4.4 → ~25. Alternative: multi-temporal averaging (N=6 scenes) for ENL ∝ N." },
            { step: "5", title: "Terrain Correction", desc: "Range-Doppler with SRTM 30m DEM. Bilinear interpolation to 10m output grid. Radiometric terrain flattening: σ⁰_T = σ⁰ × (A_flat / A_slope). Layover/shadow mask generated." },
            { step: "6", title: "Polarimetric Features", desc: "VH/VV ratio (dB), VV-VH difference, Radar Vegetation Index: RVI = 4·σ⁰_VH / (σ⁰_VV + σ⁰_VH). Multi-temporal: mean, std, CV, min, max per polarization over 12 acquisitions. Change detection: Δσ⁰ between consecutive passes." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 shrink-0">{item.step}</Badge>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
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
              <CardTitle>Topographic Processing (DEM Derivatives)</CardTitle>
              <CardDescription>SRTM/ALOS DEM → hydrological and geomorphometric features for static terrain predictors</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium text-sm">Primary Geomorphometric</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Slope (%) — Horn's 3×3 method, log-transformed</li>
                <li>• Aspect (°) — sin(θ)/cos(θ) decomposition for ML</li>
                <li>• Elevation (m) — min-max scaled per study area</li>
                <li>• Profile curvature — flow acceleration (∂²z/∂s²)</li>
                <li>• Plan curvature — flow convergence (∂²z/∂n²)</li>
                <li>• Tangential curvature — flow divergence metric</li>
                <li>• TRI = Σ|z_i - z_center| / 8 — terrain ruggedness</li>
                <li>• TPI = z_center - z̄_neighborhood — topographic position</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Hydrological Derivatives</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Pit removal: Planchon-Darboux algorithm</li>
                <li>• D8 flow direction (steepest descent)</li>
                <li>• D∞ flow direction (Tarboton, proportional)</li>
                <li>• Flow accumulation (log₁₀-scaled pixels)</li>
                <li>• TWI = ln(α / tan(β)) — moisture potential</li>
                <li>• SPI = A × tan(β) — stream power erosion</li>
                <li>• STI = (A/22.13)^0.6 × (sin(β)/0.0896)^1.3 — sediment</li>
                <li>• HAND = height above nearest drainage (m)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Distance & Proximity Metrics</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Euclidean distance to water body (m)</li>
                <li>• Cost-distance to drainage (slope-weighted)</li>
                <li>• Proximity to mine pit boundary (m)</li>
                <li>• Distance to nearest reclaimed patch (m)</li>
                <li>• Upslope contributing area (m²)</li>
                <li>• Valley depth below ridge line (m)</li>
                <li>• Multi-resolution Valley Bottom Flatness (MRVBF)</li>
                <li>• Geomorphon landform classification (10 classes)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Data Fusion & Feature Engineering Pipeline</CardTitle>
              <CardDescription>Multi-source integration: 47 features from 4 sensor platforms + climate reanalysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-sm space-y-2">
              <p className="font-semibold text-primary text-xs">Spatial Alignment</p>
              <p>• All rasters resampled to 10m UTM grid (EPSG:32644)</p>
              <p>• Continuous data: bilinear interpolation</p>
              <p>• Categorical data: nearest-neighbor resampling</p>
              <p>{"• Co-registration accuracy: sub-pixel (RMSE < 0.5 pixel)"}</p>
              <p>• Sentinel-1/2 co-registration via GEE asset alignment</p>
            </div>
            <div className="text-sm space-y-2">
              <p className="font-semibold text-primary text-xs">Temporal Alignment</p>
              <p>• Monthly composites synchronized across all sensors</p>
              <p>• S1-S2 matching: ±3 day acquisition window</p>
              <p>• Climate data: bilinear spatial downscaling → pixel assignment</p>
              <p>• Gap-filling: Whittaker smoother (λ=10⁴, d=2)</p>
              <p>• Temporal interpolation: Akima spline for irregular sampling</p>
            </div>
          </div>
          <div className="border-t pt-4 text-sm space-y-2">
            <p className="font-semibold text-primary text-xs">Feature Engineering Summary</p>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="bg-muted p-3 rounded text-xs space-y-1">
                <p className="font-semibold">SAR Features (12)</p>
                <p className="text-muted-foreground">σ⁰_VV, σ⁰_VH, VH/VV, VV-VH, RVI, multi-temporal stats (mean, std, CV per pol.)</p>
              </div>
              <div className="bg-muted p-3 rounded text-xs space-y-1">
                <p className="font-semibold">Optical Features (15)</p>
                <p className="text-muted-foreground">NDVI, EVI, SAVI, NDMI, BSI, MNDWI, NDRE + STL components (trend, seasonal, residual) + phenology metrics</p>
              </div>
              <div className="bg-muted p-3 rounded text-xs space-y-1">
                <p className="font-semibold">Terrain Features (12)</p>
                <p className="text-muted-foreground">Slope, aspect (sin/cos), elevation, TWI, SPI, TRI, TPI, curvatures (plan, profile), HAND, distance metrics</p>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="bg-muted p-3 rounded text-xs space-y-1">
                <p className="font-semibold">Climate Features (8)</p>
                <p className="text-muted-foreground">API (7, 14, 30-day), precipitation lag-0 to lag-7, LST, LST anomaly, heat wave flag, monsoon onset day</p>
              </div>
              <div className="bg-muted p-3 rounded text-xs space-y-1">
                <p className="font-semibold">Normalization Strategy</p>
                <p className="text-muted-foreground">Tree models: raw features (scale-invariant). SVR/CNN-LSTM: StandardScaler (Z-score) or MinMaxScaler [0,1]. Fitted on train-only to prevent data leakage.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-2 border-secondary/20 bg-secondary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" />
            <CardTitle className="text-lg">Data Quality & Reproducibility</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Version control:</strong> All GEE scripts archived with ee.batch.Export parameters. Processing dates and asset IDs logged.</p>
          <p>• <strong>Checksums:</strong> MD5 hash for all downloaded raster/vector files for integrity verification.</p>
          <p>• <strong>Metadata catalog:</strong> ISO 19115-compliant metadata for each data layer including CRS, resolution, temporal extent, and processing chain.</p>
          <p>• <strong>Provenance tracking:</strong> Complete processing DAG (directed acyclic graph) from raw data → features → model input stored as JSON lineage file.</p>
          <p>• <strong>Missing data report:</strong> Per-pixel missing data fraction logged. Features with greater than 30% missing excluded from model training.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingTab;
