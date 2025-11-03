import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, LineChart, Target, TrendingUp, Zap } from "lucide-react";

const ModelTraining = () => {
  const models = [
    { name: "Random Forest", type: "Ensemble", r2: 0.87, rmse: 2.3, mae: 1.8, status: "Trained" },
    { name: "Gradient Boosting", type: "Ensemble", r2: 0.89, rmse: 2.1, mae: 1.6, status: "Trained" },
    { name: "XGBoost", type: "Ensemble", r2: 0.91, rmse: 1.9, mae: 1.4, status: "Best" },
    { name: "Linear Regression", type: "Baseline", r2: 0.72, rmse: 3.5, mae: 2.8, status: "Baseline" },
  ];

  const featureImportance = [
    { feature: "SAR VH Backscatter", importance: 0.28, category: "Remote Sensing" },
    { feature: "NDVI", importance: 0.18, category: "Vegetation" },
    { feature: "Antecedent Rainfall", importance: 0.15, category: "Climate" },
    { feature: "Slope", importance: 0.12, category: "Topography" },
    { feature: "VH/VV Ratio", importance: 0.11, category: "Remote Sensing" },
    { feature: "Topographic Wetness Index", importance: 0.09, category: "Topography" },
    { feature: "Soil Texture (Clay %)", importance: 0.07, category: "Soil" },
  ];

  const validationMetrics = [
    { metric: "R² Score", value: "0.91", description: "Coefficient of determination" },
    { metric: "RMSE", value: "1.9%", description: "Root mean square error" },
    { metric: "MAE", value: "1.4%", description: "Mean absolute error" },
    { metric: "Cross-validation", value: "5-fold", description: "Spatial CV strategy" },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Model Training & Performance</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Machine learning models for soil moisture prediction using ensemble methods trained on multi-source satellite and field data.
        </p>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Trained Models Comparison</CardTitle>
                  <CardDescription>Performance metrics across different ML algorithms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {models.map((model, index) => (
                  <Card key={index} className={model.status === "Best" ? "border-2 border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <Badge variant="outline">{model.type}</Badge>
                        </div>
                        <Badge variant={model.status === "Best" ? "default" : model.status === "Trained" ? "secondary" : "outline"}>
                          {model.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">R² Score</p>
                          <p className="text-2xl font-bold text-primary">{model.r2}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">RMSE</p>
                          <p className="text-2xl font-bold">{model.rmse}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">MAE</p>
                          <p className="text-2xl font-bold">{model.mae}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Model Accuracy</span>
                          <span className="font-medium">{(model.r2 * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={model.r2 * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Best Model: XGBoost</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• <strong>Algorithm:</strong> Extreme Gradient Boosting (XGBoost)</p>
              <p>• <strong>Hyperparameters:</strong> max_depth=6, learning_rate=0.1, n_estimators=200</p>
              <p>• <strong>Training samples:</strong> 45 ground-truth points with 3-depth measurements</p>
              <p>• <strong>Features:</strong> 12 predictor variables (SAR, optical, topographic, climate)</p>
              <p>• <strong>Target variable:</strong> Soil moisture (%) at 0-10cm depth</p>
              <p>• <strong>Validation strategy:</strong> Spatial 5-fold cross-validation</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Feature Importance Analysis</CardTitle>
                  <CardDescription>Relative contribution of predictor variables to model performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {featureImportance.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{index + 1}. {feature.feature}</span>
                        <Badge variant="outline" className="text-xs">{feature.category}</Badge>
                      </div>
                      <span className="font-bold text-primary">{(feature.importance * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={feature.importance * 100} className="h-2" />
                  </div>
                ))}
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>1. SAR Backscatter Dominates:</strong> VH backscatter from Sentinel-1 is the most important predictor (28%), 
                    confirming the strong sensitivity of C-band SAR to surface moisture in bare/sparse vegetation areas typical of mine overburden.
                  </p>
                  <p>
                    <strong>2. Vegetation Indices:</strong> NDVI contributes 18%, indicating that vegetation presence affects moisture retention 
                    and is a strong indirect indicator of suitable moisture conditions.
                  </p>
                  <p>
                    <strong>3. Rainfall & Topography:</strong> Antecedent rainfall (15%) and slope (12%) are critical, with topographic wetness 
                    index (9%) helping identify moisture accumulation zones.
                  </p>
                  <p>
                    <strong>4. Polarization Ratios:</strong> VH/VV ratio (11%) provides complementary information about surface roughness and 
                    dielectric properties affecting backscatter.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Validation Metrics</CardTitle>
                    <CardDescription>Model performance evaluation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{metric.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Cross-Validation Results</CardTitle>
                    <CardDescription>Spatial fold performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { fold: "Fold 1", r2: 0.92, rmse: 1.8 },
                  { fold: "Fold 2", r2: 0.89, rmse: 2.1 },
                  { fold: "Fold 3", r2: 0.91, rmse: 1.9 },
                  { fold: "Fold 4", r2: 0.93, rmse: 1.7 },
                  { fold: "Fold 5", r2: 0.90, rmse: 2.0 },
                ].map((fold, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{fold.fold}</span>
                      <div className="flex gap-4">
                        <span>R²: <strong className="text-primary">{fold.r2}</strong></span>
                        <span>RMSE: <strong>{fold.rmse}%</strong></span>
                      </div>
                    </div>
                    <Progress value={fold.r2 * 100} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-accent/30">
            <CardHeader>
              <CardTitle>Uncertainty Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Prediction uncertainty is estimated using the standard deviation of predictions from 100 bootstrap samples. 
                Higher uncertainty areas typically correspond to:
              </p>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">High Uncertainty Zones:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Steep slopes with high erosion</li>
                    <li>• Areas with coarse rock fragments</li>
                    <li>• Zones with sparse field samples</li>
                    <li>• Edge effects and boundaries</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Low Uncertainty Zones:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Flat benches and terraces</li>
                    <li>• Areas with dense sampling</li>
                    <li>• Uniform soil texture zones</li>
                    <li>• Central study area</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Methodology</CardTitle>
              <CardDescription>Complete workflow from data preparation to model deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  step: "1. Data Preparation",
                  tasks: [
                    "Co-register satellite imagery to same grid (10m resolution)",
                    "Extract predictor values at ground-truth locations",
                    "Handle missing data and outliers",
                    "Normalize features using StandardScaler",
                  ],
                },
                {
                  step: "2. Feature Engineering",
                  tasks: [
                    "Compute vegetation indices (NDVI, EVI, SAVI)",
                    "Calculate SAR ratios (VH/VV, delta backscatter)",
                    "Derive topographic features (slope, TWI, curvature)",
                    "Add temporal features (antecedent rainfall, day of year)",
                  ],
                },
                {
                  step: "3. Model Selection & Training",
                  tasks: [
                    "Split data: 70% training, 30% testing (spatial split)",
                    "Train multiple algorithms: RF, GBM, XGBoost, Linear",
                    "Hyperparameter tuning using GridSearchCV",
                    "Select best model based on cross-validation R²",
                  ],
                },
                {
                  step: "4. Validation & Testing",
                  tasks: [
                    "Spatial 5-fold cross-validation to avoid autocorrelation",
                    "Evaluate on hold-out test set",
                    "Generate prediction vs observed plots",
                    "Calculate residual statistics and uncertainty",
                  ],
                },
                {
                  step: "5. Deployment & Mapping",
                  tasks: [
                    "Apply trained model to full study area rasters",
                    "Generate soil moisture prediction maps",
                    "Compute pixel-wise uncertainty maps",
                    "Export GeoTIFF and visualization layers",
                  ],
                },
              ].map((phase, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{phase.step}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {phase.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelTraining;
