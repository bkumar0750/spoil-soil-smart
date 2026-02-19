import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

const fieldParameters = [
  {
    category: "Soil Physical",
    params: ["Moisture (0-10cm, 10-30cm, 30-60cm)", "Texture (sand/silt/clay %)", "Bulk density", "Porosity", "Infiltration rate"],
    mlTraining: "Primary target variable (SM at 3 depths). Texture & bulk density used for pedotransfer functions to estimate hydraulic conductivity. Feature importance: Texture ~18%, Porosity ~12%.",
    encoding: "Continuous numeric. Texture percentages normalized to [0,1]. Multi-output regression for depth-wise SM prediction.",
  },
  {
    category: "Soil Chemical",
    params: ["pH", "Electrical conductivity", "Organic carbon", "N, P, K", "Heavy metals"],
    mlTraining: "Secondary features for reclamation suitability classification. SOC strongly correlated with water-holding capacity (r=0.72). EC used as salinity stress indicator.",
    encoding: "Log-transformed (EC, heavy metals) for normality. pH kept raw. NPK standardized with Z-score normalization.",
  },
  {
    category: "Topographic",
    params: ["Slope (%)", "Aspect", "Elevation", "Micro-topography", "Drainage"],
    mlTraining: "Static terrain features. TWI = ln(α/tan(β)) ranked #3 in RF importance. Aspect encoded as sin/cos for cyclical continuity. Slope × curvature interaction term improves R² by 0.04.",
    encoding: "Aspect: sin/cos decomposition. Slope: continuous. Elevation: min-max scaled. Drainage: ordinal (1-5).",
  },
  {
    category: "Vegetation",
    params: ["NDVI", "EVI", "SAVI", "Cover %", "Species present"],
    mlTraining: "Temporal vegetation indices as dynamic features. NDVI time-series decomposed via STL for trend/seasonal components. Species encoded via one-hot for reclamation suitability.",
    encoding: "NDVI/EVI/SAVI: [-1,1] range kept raw. Cover %: continuous [0,100]. Species: one-hot categorical encoding.",
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
              <CardTitle>Field Measurements & Ground Truth</CardTitle>
              <CardDescription>In-situ sampling with ML feature engineering details</CardDescription>
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
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {category.params.map((param, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{param}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-primary">ML Training Role</p>
                      <p className="text-xs text-muted-foreground mt-1">{category.mlTraining}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">Feature Encoding</p>
                      <code className="text-[10px] bg-muted p-1.5 rounded block font-mono text-muted-foreground mt-1">{category.encoding}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Sampling Strategy & Data Splitting</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Stratified sampling by slope, aspect, texture, and landform</p>
              <p>• 20-50 ground-truth points across study area</p>
              <p>• Multi-depth measurements (0-10cm, 10-30cm, 30-60cm)</p>
              <p>• Seasonal sampling (post-monsoon and dry season)</p>
              <p>• GPS coordinates (±5m accuracy) with photographs</p>
              <div className="border-t pt-3 mt-3 space-y-1">
                <p className="font-semibold text-primary text-xs">ML Data Split Protocol</p>
                <p className="text-xs text-muted-foreground">• Train/Val/Test: 70% / 15% / 15% with spatial blocking to prevent data leakage</p>
                <p className="text-xs text-muted-foreground">• Temporal holdout: last 20% of time-series for temporal generalization test</p>
                <p className="text-xs text-muted-foreground">• 5-fold spatial cross-validation with block size = 2× autocorrelation range</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDataTab;
