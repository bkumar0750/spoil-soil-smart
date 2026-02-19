import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import dataLayersImage from "@/assets/data-layers.jpg";

const derivedIndices = [
  { name: "NDVI", formula: "(NIR - Red) / (NIR + Red)", purpose: "Vegetation health", importance: "22.4%", model: "RF, XGBoost", notes: "Temporal decomposition (STL) into trend + seasonal + residual. Lag-1 autocorrelation used as additional feature." },
  { name: "SAVI", formula: "((NIR - Red) / (NIR + Red + L)) * (1 + L)", purpose: "Soil-adjusted vegetation", importance: "14.1%", model: "RF, SVR", notes: "L=0.5 for intermediate vegetation. Preferred over NDVI in sparse-cover mine sites to reduce soil noise." },
  { name: "SMI", formula: "f(VV, VH, NDVI, Rainfall)", purpose: "Soil Moisture Index", importance: "Target", model: "Multi-output", notes: "Composite target variable combining SAR backscatter with optical & climate drivers. Calibrated against gravimetric SM." },
  { name: "TWI", formula: "ln(α / tan(β))", purpose: "Topographic Wetness", importance: "18.7%", model: "RF, GBM", notes: "Static feature. Higher values = greater moisture accumulation potential. Strongly correlated with SM at 30-60cm depth." },
  { name: "VH/VV Ratio", formula: "VH backscatter / VV backscatter", purpose: "SAR moisture proxy", importance: "26.3%", model: "RF, CNN", notes: "Highest single-feature importance. Sensitive to dielectric constant changes from soil water content variation." },
  { name: "BSI", formula: "(SWIR + Red) - (NIR + Blue) / (SWIR + Red) + (NIR + Blue)", purpose: "Bare Soil Index", importance: "8.9%", model: "RF", notes: "Identifies exposed mine surfaces. Used for land cover stratification in ensemble models." },
  { name: "MNDWI", formula: "(Green - SWIR) / (Green + SWIR)", purpose: "Water detection", importance: "6.2%", model: "RF, SVM", notes: "Masks water bodies from analysis. Threshold-based binary feature for waterlogged area detection." },
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
              <CardTitle>Derived Indices & ML Feature Engineering</CardTitle>
              <CardDescription>Computed parameters with feature importance and model usage</CardDescription>
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
                    <div className="flex gap-2">
                      <Badge>{idx.purpose}</Badge>
                      <Badge variant="secondary">Importance: {idx.importance}</Badge>
                      <Badge variant="outline">{idx.model}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <code className="text-sm bg-muted p-3 rounded block font-mono">{idx.formula}</code>
                  <p className="text-xs text-muted-foreground">{idx.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <img src={dataLayersImage} alt="Data layers visualization" className="rounded-lg shadow-lg w-full h-auto" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DerivedIndicesTab;
