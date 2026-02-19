import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, GitBranch, Layers } from "lucide-react";

const models = [
  {
    name: "Random Forest (RF)",
    type: "Ensemble — Bagging",
    hyperparams: {
      n_estimators: "500",
      max_depth: "20",
      min_samples_split: "5",
      min_samples_leaf: "2",
      max_features: "sqrt(n_features)",
      bootstrap: "True",
      oob_score: "True",
    },
    metrics: { R2: "0.87", RMSE: "0.032 m³/m³", MAE: "0.024 m³/m³" },
    description: "Primary model. Handles non-linear relationships between SAR backscatter and SM. OOB error used for early hyperparameter screening.",
    featureImportance: ["VH/VV Ratio (26.3%)", "NDVI (22.4%)", "TWI (18.7%)", "Precipitation lag-1 (14.1%)", "Temperature (8.9%)"],
  },
  {
    name: "XGBoost (Gradient Boosted Trees)",
    type: "Ensemble — Boosting",
    hyperparams: {
      n_estimators: "1000",
      max_depth: "8",
      learning_rate: "0.05",
      subsample: "0.8",
      colsample_bytree: "0.7",
      reg_alpha: "0.1",
      reg_lambda: "1.0",
      early_stopping_rounds: "50",
    },
    metrics: { R2: "0.89", RMSE: "0.029 m³/m³", MAE: "0.021 m³/m³" },
    description: "Best performing model. L1/L2 regularization prevents overfitting on small sample sizes. SHAP values used for explainability.",
    featureImportance: ["VH/VV Ratio (28.1%)", "TWI (19.3%)", "NDVI (17.8%)", "API-7day (15.2%)", "Slope (9.6%)"],
  },
  {
    name: "Support Vector Regression (SVR)",
    type: "Kernel Methods",
    hyperparams: {
      kernel: "RBF",
      C: "100",
      epsilon: "0.01",
      gamma: "scale (1/n_features × σ²)",
    },
    metrics: { R2: "0.83", RMSE: "0.037 m³/m³", MAE: "0.028 m³/m³" },
    description: "Effective for small datasets. RBF kernel captures non-linearity. GridSearchCV for C-epsilon-gamma optimization.",
    featureImportance: ["Kernel-based (no direct feature importance)", "Permutation importance used post-hoc"],
  },
  {
    name: "1D-CNN + LSTM Hybrid",
    type: "Deep Learning — Temporal",
    hyperparams: {
      conv_filters: "64, 128",
      kernel_size: "3",
      lstm_units: "128",
      dropout: "0.3",
      batch_size: "32",
      epochs: "200 (early stop patience=20)",
      optimizer: "Adam (lr=1e-3, weight_decay=1e-5)",
      loss: "Huber (δ=1.0)",
    },
    metrics: { R2: "0.91", RMSE: "0.026 m³/m³", MAE: "0.019 m³/m³" },
    description: "Temporal sequence model. CNN extracts spatial features from multi-band input; LSTM captures temporal SM dynamics over 12-month windows.",
    featureImportance: ["Grad-CAM attention maps", "Highest activation on VH/VV + precipitation sequences"],
  },
];

const MLTrainingTab = () => {
  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>ML Training Pipeline</CardTitle>
              <CardDescription>End-to-end workflow from raw data to deployed predictions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-6 text-center text-xs">
            {[
              { label: "Raw Data", desc: "Sentinel-1/2, DEM, Climate", icon: "📡" },
              { label: "Preprocessing", desc: "Calibration, masking, compositing", icon: "🔧" },
              { label: "Feature Eng.", desc: "47 features extracted & encoded", icon: "⚙️" },
              { label: "Training", desc: "RF, XGBoost, SVR, CNN-LSTM", icon: "🧠" },
              { label: "Validation", desc: "Spatial CV, temporal holdout", icon: "✅" },
              { label: "Deployment", desc: "Edge function inference API", icon: "🚀" },
            ].map((step, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl">{step.icon}</div>
                <p className="font-semibold">{step.label}</p>
                <p className="text-muted-foreground">{step.desc}</p>
                {i < 5 && <div className="hidden md:block text-muted-foreground absolute right-0 top-1/2">→</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Cards */}
      {models.map((model, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>{model.name}</CardTitle>
                  <Badge variant="secondary">{model.type}</Badge>
                </div>
                <CardDescription>{model.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Hyperparameters */}
              <div>
                <p className="text-xs font-semibold text-primary mb-2">Hyperparameters</p>
                <div className="space-y-1">
                  {Object.entries(model.hyperparams).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <code className="text-muted-foreground font-mono">{key}</code>
                      <span className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div>
                <p className="text-xs font-semibold text-primary mb-2">Performance Metrics</p>
                <div className="space-y-2">
                  {Object.entries(model.metrics).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{key}</span>
                      <Badge variant="outline">{val}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Importance */}
              <div>
                <p className="text-xs font-semibold text-primary mb-2">Feature Importance</p>
                <ul className="space-y-1">
                  {model.featureImportance.map((f, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Training Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Validation Strategy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>Spatial Block CV:</strong> 5-fold with 500m buffer zones to prevent spatial autocorrelation leakage</p>
            <p>• <strong>Temporal Holdout:</strong> Last 20% of time-series reserved for generalization testing</p>
            <p>• <strong>Leave-One-Site-Out:</strong> For multi-site generalization assessment</p>
            <p>• <strong>Metrics:</strong> R², RMSE, MAE, ubRMSE (unbiased), Nash-Sutcliffe Efficiency (NSE)</p>
            <p>• <strong>Uncertainty:</strong> Prediction intervals via quantile regression forests (α=0.05, 0.95)</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Data Augmentation & Balancing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>SMOTE:</strong> Synthetic oversampling for under-represented SM classes (dry extremes)</p>
            <p>• <strong>Temporal augmentation:</strong> ±3 day jittering for time-series inputs</p>
            <p>• <strong>Noise injection:</strong> Gaussian noise (σ=0.02) to SAR backscatter for robustness</p>
            <p>• <strong>Mixup:</strong> Linear interpolation of feature-label pairs (α=0.2) for CNN-LSTM</p>
            <p>• <strong>Class weighting:</strong> Inverse-frequency weighting for reclamation suitability classification</p>
          </CardContent>
        </Card>
      </div>

      {/* Hyperparameter Tuning */}
      <Card>
        <CardHeader>
          <CardTitle>Hyperparameter Optimization Protocol</CardTitle>
          <CardDescription>Bayesian optimization with Optuna for efficient search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Strategy</th>
                  <th className="text-left p-3 font-medium">Models</th>
                  <th className="text-left p-3 font-medium">Trials</th>
                  <th className="text-left p-3 font-medium">Objective</th>
                  <th className="text-left p-3 font-medium">Sampler</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Bayesian (TPE)</td>
                  <td className="p-3">XGBoost, RF</td>
                  <td className="p-3"><Badge variant="outline">200 trials</Badge></td>
                  <td className="p-3 text-muted-foreground">Minimize RMSE (spatial CV)</td>
                  <td className="p-3"><code className="text-xs bg-muted p-1 rounded">TPESampler</code></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Grid Search</td>
                  <td className="p-3">SVR</td>
                  <td className="p-3"><Badge variant="outline">C×ε×γ grid</Badge></td>
                  <td className="p-3 text-muted-foreground">Maximize R² (5-fold CV)</td>
                  <td className="p-3"><code className="text-xs bg-muted p-1 rounded">GridSearchCV</code></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Learning Rate Schedule</td>
                  <td className="p-3">CNN-LSTM</td>
                  <td className="p-3"><Badge variant="outline">Cosine annealing</Badge></td>
                  <td className="p-3 text-muted-foreground">Minimize Huber loss</td>
                  <td className="p-3"><code className="text-xs bg-muted p-1 rounded">CosineAnnealingLR</code></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Ensemble Stacking</td>
                  <td className="p-3">All models</td>
                  <td className="p-3"><Badge variant="outline">Meta-learner</Badge></td>
                  <td className="p-3 text-muted-foreground">Ridge regression on base predictions</td>
                  <td className="p-3"><code className="text-xs bg-muted p-1 rounded">StackingRegressor</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLTrainingTab;
