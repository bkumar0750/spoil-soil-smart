import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Cpu, Zap } from "lucide-react";
import satelliteImage from "@/assets/satellite-moisture.jpg";

const satelliteData = [
  {
    name: "Sentinel-1 SAR (C-Band)",
    resolution: "5×20m → 10m",
    bands: "VV, VH (IW mode)",
    temporal: "6-12 days",
    wavelength: "5.405 GHz (λ=5.547 cm)",
    orbit: "693 km, sun-synchronous, 98.18° inclination",
    mlRole: "Primary backscatter features for SM regression. VV polarization sensitive to surface roughness; VH sensitive to volume scattering (vegetation). VH/VV ratio = strongest single predictor (R²=0.74 alone). Temporal stacking of 12 acquisitions → multi-temporal feature cube.",
    preprocessing: "Apply-Orbit-File → Thermal noise removal → Radiometric calibration (β⁰ → σ⁰) → Refined Lee speckle filter (7×7) → Range-Doppler terrain correction (SRTM 30m) → dB conversion: 10·log₁₀(σ⁰)",
    mlFeatures: [
      "σ⁰_VV (dB), σ⁰_VH (dB) — raw backscatter",
      "VH/VV ratio — cross-pol ratio (importance: 26.3%)",
      "VV-VH difference — depolarization metric",
      "Multi-temporal mean, std, CV for each polarization",
      "Interferometric coherence (6-day baseline) for surface change detection",
    ],
    trainingNotes: "Ascending/descending orbits processed separately to account for look-angle effects. Incidence angle normalization applied: σ⁰_norm = σ⁰ - 0.05·(θ - θ_ref). Temporal autocorrelation removed via first-differencing for stationarity.",
  },
  {
    name: "Sentinel-2 MSI (Optical)",
    resolution: "10m (VNIR), 20m (SWIR), 60m (atm.)",
    bands: "13 spectral bands (443–2190 nm)",
    temporal: "5 days (2-sat constellation)",
    wavelength: "443nm (B1) to 2190nm (B12)",
    orbit: "786 km, sun-synchronous, 10:30 LTAN",
    mlRole: "Optical vegetation indices serve as proxy features for SM via plant water stress detection. NDVI temporal decomposition (STL) extracts trend + seasonal + residual components. EVI preferred over NDVI in high-biomass regions (saturation resistance). SWIR bands (B11, B12) directly sensitive to canopy & soil water content.",
    preprocessing: "L1C → Sen2Cor atmospheric correction (L2A) → SCL cloud/shadow mask (<10% cloud) → BRDF normalization (c-factor) → Monthly median compositing → Pan-sharpening (20m → 10m via B2/B3/B4)",
    mlFeatures: [
      "NDVI = (B8-B4)/(B8+B4) — vegetation vigor",
      "EVI = 2.5·(B8-B4)/(B8+6·B4-7.5·B2+1) — enhanced vegetation",
      "SAVI = ((B8-B4)/(B8+B4+0.5))·1.5 — soil-adjusted",
      "NDMI = (B8-B11)/(B8+B11) — moisture stress index",
      "BSI = ((B11+B4)-(B8+B2))/((B11+B4)+(B8+B2)) — bare soil",
      "STL decomposition: trend, seasonal amplitude, residual variance",
    ],
    trainingNotes: "Cloud-free composite selection prioritizes scenes within ±15 days of SAR acquisition for temporal co-registration. Red-edge bands (B5, B6, B7) improve canopy chlorophyll estimation for sparse mine vegetation. Band reflectance values scaled to [0, 10000] integer for storage efficiency.",
  },
  {
    name: "Landsat 8/9 OLI+TIRS",
    resolution: "30m (MS), 15m (PAN), 100m (TIR)",
    bands: "11 bands + 2 thermal",
    temporal: "16 days (8 days combined)",
    wavelength: "435nm (B1) to 12510nm (B11)",
    orbit: "705 km, sun-synchronous, 10:00 LTAN",
    mlRole: "Historical baseline (1984–present) for long-term land cover change trajectory. LST from thermal bands models SM-temperature coupling (Kashyap & Kuttippurath, 2024: temperature explains 30.76% SM variance). Harmonized Landsat-Sentinel (HLS) products enable dense time-series at 30m.",
    preprocessing: "L2SP surface reflectance (LaSRC) → F-mask cloud/shadow → Thermal radiance → Split-window LST retrieval (Jiménez-Muñoz et al.) → Pan-sharpening (30m → 15m) → Cross-calibration with S2 via linear regression",
    mlFeatures: [
      "LST (°C) — land surface temperature from TIRS",
      "NDVI, EVI, SAVI — cross-calibrated with Sentinel-2",
      "MNDWI = (B3-B6)/(B3+B6) — water body detection",
      "NBR = (B5-B7)/(B5+B7) — burn/disturbance ratio",
      "ΔLC trajectory (1984→present) — land cover change rate",
    ],
    trainingNotes: "Landsat-Sentinel harmonization uses OLS regression on overlapping observations (n>50 per band). Thermal anomaly detection identifies active mine operations. 40-year NDVI trend (Mann-Kendall τ) quantifies reclamation trajectory success/failure.",
  },
  {
    name: "SRTM / ALOS PALSAR DEM",
    resolution: "30m (SRTM) / 12.5m (ALOS)",
    bands: "Elevation (m ASL)",
    temporal: "Static (2000 / 2006-2011)",
    wavelength: "C-band (SRTM) / L-band (ALOS)",
    orbit: "233 km (Shuttle) / 692 km (ALOS)",
    mlRole: "Topographic features are static predictors invariant to weather/season. TWI = ln(α/tan(β)) ranked #3 in RF feature importance (18.7%). Slope × curvature interaction term adds R²+0.04. Aspect encoded as sin/cos for continuity. ALOS preferred in dense vegetation due to L-band canopy penetration.",
    preprocessing: "Void filling (delta surface) → Pit removal (Planchon-Darboux) → Hydrological conditioning → D8 flow direction → Flow accumulation → TWI, SPI, TCI computation → Slope/aspect (Horn's 3×3)",
    mlFeatures: [
      "Slope (%) — Horn's method, log-transformed",
      "Aspect — sin(aspect), cos(aspect) encoding",
      "TWI = ln(contributing_area / tan(slope))",
      "Profile curvature — flow acceleration/deceleration",
      "Plan curvature — flow convergence/divergence",
      "SPI = A·tan(β) — stream power erosion potential",
      "TRI (Terrain Ruggedness Index) — surface heterogeneity",
    ],
    trainingNotes: "Multi-scale analysis: 3×3, 5×5, 7×7 kernel sizes for slope/curvature to capture micro and meso-topography. Distance-to-drainage computed via cost-distance (slope-weighted). Mine pit DEM correction applied where SRTM pre-dates mining activity.",
  },
];

const climateDataSources = [
  { name: "ESA CCI Soil Moisture v08.1", resolution: "0.25°", source: "esa-soilmoisture-cci.org", description: "Merged active+passive MW (1978–present)", mlRole: "Coarse-scale SM target for transfer learning pre-training. Combined product (ACTIVE+PASSIVE) used for bias correction of point-scale predictions.", encoding: "Daily, m³/m³, quality flag filtering (flag ≤ 1)" },
  { name: "MODIS MCD12Q1 / MOD13A2 / MOD17A2H", resolution: "500m", source: "lpdaacsvc.cr.usgs.gov", description: "LULC (annual), NDVI (16-day), GPP (8-day)", mlRole: "LULC for model stratification (mine vs. forest vs. grassland). GPP as productivity proxy — 1-month lag correlation with SM (r=0.68, Kashyap 2024).", encoding: "LULC: one-hot (17 classes → 6 aggregated). GPP: cumulative 30-day sum. NDVI: harmonic regression coefficients." },
  { name: "GPM IMERG v07 (Level-3)", resolution: "0.1° / 30min", source: "gpm.nasa.gov", description: "Multi-satellite merged precipitation", mlRole: "Antecedent Precipitation Index: API_t = Σ(k^i · P_{t-i}), k=0.85, i=1..30. Lag-0 to lag-7 day precipitation as dynamic input features. 90th percentile exceedance for extreme event flagging.", encoding: "mm/day, log(1+P) transformed. Cumulative 7, 14, 30-day sums. Binary extreme flag (>95th percentile)." },
  { name: "GLDAS Noah v2.1", resolution: "0.25° / 3-hourly", source: "ldas.gsfc.nasa.gov", description: "Land surface model: SM (4 layers), LST, ET, runoff", mlRole: "SM at 0-10, 10-40, 40-100, 100-200cm as physics-based baseline. Residual = observed - GLDAS used to train bias-correction model. LST for energy-balance SM estimation.", encoding: "SM: kg/m², converted to m³/m³ via ρ_bulk. LST: K → °C. Anomalies computed as Z-score from 2000-2020 climatology." },
  { name: "FLDAS Noah v1", resolution: "0.1°", source: "ldas.gsfc.nasa.gov", description: "Famine early-warning: SM, soil heat flux, ET", mlRole: "Ground heat flux (G) for energy partitioning: G/Rn ratio indicates SM-limited evaporation. SM profile for root-zone moisture availability scoring.", encoding: "W/m², daily mean aggregation. G/Rn ratio as derived feature." },
  { name: "IMD Gridded Rainfall v2023", resolution: "0.25° daily", source: "imdpune.gov.in", description: "India-specific merged station+satellite rainfall", mlRole: "Regional precipitation superior to GPM over India (lower bias). Monsoon onset date detection (cumulative rainfall threshold). Dry-spell length as categorical stress indicator.", encoding: "mm/day. Monsoon onset: Julian day. Dry spell: consecutive days <2.5mm." },
  { name: "IMD Gridded Temperature v2023", resolution: "1° daily", source: "imdpune.gov.in", description: "India-specific Tmax, Tmin station interpolation", mlRole: "Temperature anomaly = T - T_clim (1981-2010 baseline). Warming stress: SM loss ≈ 3% per °C above 28°C threshold (Kashyap & Kuttippurath, 2024). Diurnal range (Tmax-Tmin) as atmospheric demand proxy.", encoding: "°C. Anomaly: deviation from 30-year mean. Heat wave flag: Tmax > μ + 2σ for ≥3 consecutive days." },
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
              <CardTitle>Satellite Data Sources & ML Feature Extraction</CardTitle>
              <CardDescription>Multi-sensor remote sensing data with preprocessing pipelines, ML training roles, and feature engineering details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <img src={satelliteImage} alt="Satellite moisture visualization" className="rounded-lg shadow-lg w-full h-auto" />
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Multi-Sensor Fusion Strategy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• <strong>SAR + Optical synergy:</strong> SAR provides all-weather SM sensitivity; optical provides vegetation state context</p>
                <p>• <strong>Active-passive downscaling:</strong> Coarse MW SM (25km) disaggregated using 10m SAR/optical features</p>
                <p>• <strong>Temporal alignment:</strong> ±3 day matching window between S1 and S2 acquisitions</p>
                <p>• <strong>Feature space:</strong> 47 engineered features from 4 sensor platforms</p>
                <p>• <strong>Multi-scale features:</strong> Point (10m), neighborhood (90m window), landscape (500m aggregation)</p>
                <p>• <strong>Coordinate system:</strong> UTM Zone 44N (EPSG:32644) for metric spatial operations</p>
              </CardContent>
            </Card>
          </div>

          {satelliteData.map((data, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-lg">{data.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge>{data.resolution}</Badge>
                    <Badge variant="secondary">{data.temporal}</Badge>
                    <Badge variant="outline">{data.wavelength}</Badge>
                  </div>
                </div>
                <CardDescription>{data.orbit}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">Bands / Channels</p>
                    <p className="text-sm">{data.bands}</p>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xs font-semibold text-primary mb-1">ML Training Role</p>
                      <p className="text-xs text-muted-foreground">{data.mlRole}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">Preprocessing Pipeline</p>
                    <code className="text-[10px] bg-muted p-2 rounded block font-mono text-muted-foreground leading-relaxed">{data.preprocessing}</code>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-primary mb-2">Extracted ML Features</p>
                    <ul className="space-y-1">
                      {data.mlFeatures.map((f, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                          <code className="font-mono">{f}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">Training Notes</p>
                    <p className="text-xs text-muted-foreground italic">{data.trainingNotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Climate & Reanalysis Data Sources</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Auxiliary datasets for climate-SM coupling analysis. Feature engineering includes temporal aggregation, anomaly computation, and lag-correlation features per Kashyap & Kuttippurath (2024).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Dataset</th>
                    <th className="text-left p-3 font-medium">Resolution</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">ML Role & Feature Engineering</th>
                    <th className="text-left p-3 font-medium">Encoding</th>
                    <th className="text-left p-3 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {climateDataSources.map((ds, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-3 font-medium">{ds.name}</td>
                      <td className="p-3"><Badge variant="outline">{ds.resolution}</Badge></td>
                      <td className="p-3 text-muted-foreground text-xs">{ds.description}</td>
                      <td className="p-3 text-xs text-muted-foreground">{ds.mlRole}</td>
                      <td className="p-3"><code className="text-[10px] bg-muted p-1 rounded font-mono">{ds.encoding}</code></td>
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
