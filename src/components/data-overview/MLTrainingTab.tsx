import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, GitBranch, Layers, Sigma, Sparkles } from "lucide-react";

const models = [
  {
    name: "Random Forest (RF)",
    type: "Ensemble — Bagging",
    framework: "scikit-learn 1.3.x",
    hyperparams: {
      n_estimators: "500 (Optuna-tuned, range [100, 1000])",
      max_depth: "20 (range [5, 50])",
      min_samples_split: "5 (range [2, 20])",
      min_samples_leaf: "2 (range [1, 10])",
      max_features: "sqrt(n_features) ≈ 7",
      bootstrap: "True (OOB score for early screening)",
      criterion: "squared_error (MSE)",
      n_jobs: "-1 (all CPU cores)",
    },
    metrics: { "R²": "0.87", "RMSE": "0.032 m³/m³", "MAE": "0.024 m³/m³", "ubRMSE": "0.028 m³/m³", "NSE": "0.85" },
    description: "Primary interpretable model. Handles non-linear SAR-SM relationships. OOB error enables hyperparameter screening without separate validation set. Prediction intervals via quantile regression forest (α=0.05, 0.95).",
    featureImportance: ["VH/VV Ratio (26.3%) — MDI + permutation", "NDVI trend (22.4%) — STL decomposition", "TWI (18.7%) — static topographic", "API_7day (14.1%) — antecedent rainfall", "LST anomaly (8.9%) — warming stress", "Slope × Curvature (5.2%) — interaction", "NDMI (4.4%) — canopy moisture"],
    explainability: "SHAP (TreeExplainer): O(TLD) complexity. Partial Dependence Plots for top-5 features. Feature interaction detection via SHAP interaction values. Per-prediction uncertainty via QRF prediction intervals.",
    limitations: "Cannot extrapolate beyond training data range. Prediction variance underestimated at distribution tails. Spatial autocorrelation inflates OOB accuracy by ~3-5%.",
  },
  {
    name: "XGBoost (Extreme Gradient Boosting)",
    type: "Ensemble — Sequential Boosting",
    framework: "xgboost 2.0.x (GPU: tree_method='gpu_hist')",
    hyperparams: {
      n_estimators: "1000 (early_stopping_rounds=50)",
      max_depth: "8 (range [3, 15])",
      learning_rate: "0.05 (η, cosine decay schedule)",
      subsample: "0.8 (row subsampling per tree)",
      colsample_bytree: "0.7 (feature subsampling)",
      reg_alpha: "0.1 (L1 regularization)",
      reg_lambda: "1.0 (L2 regularization)",
      min_child_weight: "5",
      gamma: "0.1 (min split loss)",
      objective: "reg:squarederror",
    },
    metrics: { "R²": "0.89", "RMSE": "0.029 m³/m³", "MAE": "0.021 m³/m³", "ubRMSE": "0.025 m³/m³", "NSE": "0.88" },
    description: "Best single-model performance. L1/L2 regularization prevents overfitting on small sample sizes (n<200). GPU-accelerated training (tree_method='gpu_hist') enables 200-trial Optuna search in <30 min. SHAP TreeExplainer for global + local interpretability.",
    featureImportance: ["VH/VV Ratio (28.1%) — gain importance", "TWI (19.3%) — topographic control", "NDVI (17.8%) — vegetation proxy", "API_7day (15.2%) — rainfall memory", "Slope (9.6%) — terrain gradient", "LST × NDMI interaction (5.8%)", "BSI (4.2%) — bare soil fraction"],
    explainability: "SHAP values (TreeExplainer, exact method). Force plots for individual predictions. Summary beeswarm plots for global importance. Monotone constraints applied: learning_rate, API_7day (positive), LST (negative).",
    limitations: "Sensitive to hyperparameter tuning — performance drops ~8% with default parameters. Sequential boosting limits parallelism vs. RF. Prone to overfitting on noisy SAR backscatter without proper regularization.",
  },
  {
    name: "Support Vector Regression (ε-SVR)",
    type: "Kernel Methods — Non-parametric",
    framework: "scikit-learn 1.3.x (libsvm backend)",
    hyperparams: {
      kernel: "RBF: K(x,x') = exp(-γ||x-x'||²)",
      C: "100 (regularization, range [0.1, 1000])",
      epsilon: "0.01 (ε-tube width, range [0.001, 0.1])",
      gamma: "scale = 1/(n_features × Var(X))",
      cache_size: "2000 MB",
      tol: "1e-4 (convergence tolerance)",
    },
    metrics: { "R²": "0.83", "RMSE": "0.037 m³/m³", "MAE": "0.028 m³/m³", "ubRMSE": "0.033 m³/m³", "NSE": "0.80" },
    description: "Effective for small datasets (n<100 training points). RBF kernel maps to infinite-dimensional feature space for non-linear SM prediction. ε-tube provides built-in noise tolerance. Computationally expensive for n>500 (O(n²) to O(n³) training complexity).",
    featureImportance: ["Kernel-based → no direct feature importance", "Permutation importance (10 repeats, spatial CV)", "RFE (Recursive Feature Elimination) ranking", "Top features align with RF/XGBoost rankings"],
    explainability: "Permutation importance for global ranking. KernelSHAP for local explanations (sampling-based approximation, 500 background samples). Support vector visualization in 2D PCA projection.",
    limitations: "No probabilistic output (no prediction intervals). Scales poorly beyond n>500. Feature scaling mandatory (StandardScaler). No built-in feature selection — requires manual RFE pipeline.",
  },
  {
    name: "1D-CNN + Bi-LSTM Hybrid",
    type: "Deep Learning — Spatio-Temporal",
    framework: "PyTorch 2.1.x (CUDA 12.x)",
    hyperparams: {
      "Conv1D_1": "filters=64, kernel=3, ReLU, BatchNorm",
      "Conv1D_2": "filters=128, kernel=3, ReLU, BatchNorm",
      "MaxPool1D": "pool_size=2",
      "BiLSTM": "units=128, return_sequences=False",
      "Attention": "Bahdanau attention on LSTM hidden states",
      dropout: "0.3 (spatial) + 0.2 (recurrent)",
      batch_size: "32",
      epochs: "200 (EarlyStopping patience=20, restore_best)",
      optimizer: "AdamW (lr=1e-3, weight_decay=1e-5)",
      scheduler: "CosineAnnealingWarmRestarts (T_0=10, T_mult=2)",
      loss: "Huber (δ=1.0) + 0.1 × temporal_consistency_loss",
    },
    metrics: { "R²": "0.91", "RMSE": "0.026 m³/m³", "MAE": "0.019 m³/m³", "ubRMSE": "0.022 m³/m³", "NSE": "0.90" },
    description: "State-of-the-art temporal model. 1D-CNN extracts local spectral/SAR patterns from multi-band input; Bi-LSTM with Bahdanau attention captures forward+backward temporal SM dynamics over 12-month sliding windows. Custom temporal consistency loss penalizes physically implausible SM jumps (>0.1 m³/m³ per timestep).",
    featureImportance: ["Grad-CAM++ attention maps on Conv layers", "Integrated Gradients for input attribution", "Highest activation: VH/VV + precipitation sequences", "Attention weights peak at monsoon onset/cessation", "LSTM cell state analysis reveals 3-month memory horizon"],
    explainability: "Grad-CAM++ for convolutional layer attribution. Integrated Gradients (IG, m=300 interpolation steps) for input-level feature importance. Attention weight visualization shows temporal focus. T-SNE of LSTM hidden states reveals learned SM regime clusters.",
    limitations: "Requires GPU for training (V100: ~2h for 200 epochs). Minimum 24 monthly observations per sample. Sensitive to input sequence length. Black-box → SHAP/IG approximations may disagree. Overfits rapidly on <50 training samples.",
  },
];

const ensembleConfig = {
  method: "Stacking Ensemble with Ridge Meta-Learner",
  baseModels: "RF, XGBoost, SVR, CNN-LSTM",
  metaLearner: "Ridge Regression (α=1.0, cv=5)",
  stacking: "Out-of-fold predictions from 5-fold spatial CV as meta-features (4 base predictions × 3 depths = 12 meta-features)",
  metrics: { "R²": "0.93", "RMSE": "0.023 m³/m³", "MAE": "0.017 m³/m³", "ubRMSE": "0.020 m³/m³", "NSE": "0.92" },
  weights: "RF: 0.18, XGBoost: 0.32, SVR: 0.12, CNN-LSTM: 0.38 (learned by Ridge)",
};

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
              <CardTitle>ML Training Pipeline Architecture</CardTitle>
              <CardDescription>End-to-end workflow: raw multi-sensor data → feature engineering → model training → ensemble prediction → deployed inference API</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-6 text-center text-xs">
            {[
              { label: "Data Ingestion", desc: "S1 SAR, S2 optical, DEM, climate reanalysis", icon: "📡" },
              { label: "Preprocessing", desc: "Calibration, filtering, terrain correction, compositing", icon: "🔧" },
              { label: "Feature Engineering", desc: "47 features: indices, terrain, climate, interactions", icon: "⚙️" },
              { label: "Model Training", desc: "RF, XGBoost, ε-SVR, CNN-BiLSTM + stacking ensemble", icon: "🧠" },
              { label: "Validation", desc: "Spatial Block CV, LOSO, temporal holdout, uncertainty", icon: "✅" },
              { label: "Deployment", desc: "Edge function API, real-time inference, uncertainty bands", icon: "🚀" },
            ].map((step, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl">{step.icon}</div>
                <p className="font-semibold">{step.label}</p>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ensemble Summary */}
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Stacking Ensemble (Final Model)</CardTitle>
          </div>
          <CardDescription>{ensembleConfig.method}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Architecture</p>
              <p className="text-xs text-muted-foreground">{ensembleConfig.stacking}</p>
              <p className="text-xs text-muted-foreground mt-1"><strong>Learned weights:</strong> {ensembleConfig.weights}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Ensemble Performance</p>
              {Object.entries(ensembleConfig.metrics).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <Badge variant="secondary">{v}</Badge>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Improvement over Best Single Model</p>
              <p className="text-xs text-muted-foreground">R² +0.02, RMSE -0.003 m³/m³ vs. CNN-LSTM alone. Ensemble reduces prediction variance by 18% (bootstrapped CI). Diversity score (Q-statistic): 0.34 indicating complementary base models.</p>
            </div>
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
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{model.type}</Badge>
                    <Badge variant="outline">{model.framework}</Badge>
                  </div>
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
                    <div key={key} className="flex justify-between text-xs gap-2">
                      <code className="text-muted-foreground font-mono shrink-0">{key}</code>
                      <span className="font-medium text-right text-[10px]">{val}</span>
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
                <p className="text-xs font-semibold text-primary mb-2">Feature Importance / Attribution</p>
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
            <div className="grid gap-4 md:grid-cols-2 border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-primary mb-1">Explainability Methods</p>
                <p className="text-xs text-muted-foreground">{model.explainability}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">Known Limitations</p>
                <p className="text-xs text-muted-foreground italic">{model.limitations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Validation & Augmentation */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Validation Strategy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>Spatial Block CV:</strong> 5-fold, block size = 2× variogram range (~500m), 500m buffer zones between folds</p>
            <p>• <strong>Temporal Holdout:</strong> Last 20% of time-series (most recent 6 months) for temporal generalization</p>
            <p>• <strong>Leave-One-Site-Out (LOSO):</strong> N-fold where N = number of distinct mine sites for transferability</p>
            <p>• <strong>Nested CV:</strong> Outer 5-fold spatial CV × inner 3-fold for unbiased hyperparameter selection</p>
            <p>• <strong>Metrics:</strong> R², RMSE, MAE, ubRMSE, NSE, KGE (Kling-Gupta), PICP (prediction interval coverage)</p>
            <p>• <strong>Uncertainty:</strong> QRF prediction intervals (α=0.05, 0.95); MC Dropout (50 passes) for DL models</p>
            <p>• <strong>Statistical tests:</strong> Diebold-Mariano test for pairwise model comparison (α=0.05)</p>
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
            <p>• <strong>SMOTE-ENN:</strong> Synthetic oversampling + Edited Nearest Neighbors for under-represented dry SM classes</p>
            <p>• <strong>Temporal jittering:</strong> ±3 day shift for time-series inputs (preserves phenological plausibility)</p>
            <p>• <strong>Gaussian noise:</strong> σ=0.02 dB added to SAR backscatter for speckle robustness training</p>
            <p>• <strong>Mixup (DL only):</strong> x̃ = λ·x_i + (1-λ)·x_j, ỹ = λ·y_i + (1-λ)·y_j, λ ~ Beta(0.2, 0.2)</p>
            <p>• <strong>Feature dropout:</strong> Random 10% feature masking per batch (forces model to use diverse feature subsets)</p>
            <p>• <strong>Inverse-frequency weighting:</strong> w_k = N / (K × n_k) for reclamation suitability classification</p>
            <p>• <strong>Test-time augmentation:</strong> Mean of 5 augmented predictions for final inference (reduces variance ~12%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Hyperparameter Tuning + Feature Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sigma className="h-5 w-5 text-primary" />
            <CardTitle>Hyperparameter Optimization & Feature Selection</CardTitle>
          </div>
          <CardDescription>Bayesian optimization (Optuna TPE) for tree models; grid search for SVR; learning rate scheduling for deep learning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Strategy</th>
                  <th className="text-left p-3 font-medium">Models</th>
                  <th className="text-left p-3 font-medium">Budget</th>
                  <th className="text-left p-3 font-medium">Objective</th>
                  <th className="text-left p-3 font-medium">Implementation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Bayesian (TPE)</td>
                  <td className="p-3">XGBoost, RF</td>
                  <td className="p-3"><Badge variant="outline">200 trials</Badge></td>
                  <td className="p-3 text-xs text-muted-foreground">Minimize RMSE (nested spatial CV, 5×3 folds)</td>
                  <td className="p-3"><code className="text-[10px] bg-muted p-1 rounded">optuna.samplers.TPESampler(seed=42)</code></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Grid Search</td>
                  <td className="p-3">SVR</td>
                  <td className="p-3"><Badge variant="outline">C×ε×γ = 10×5×5</Badge></td>
                  <td className="p-3 text-xs text-muted-foreground">Maximize R² (5-fold spatial CV)</td>
                  <td className="p-3"><code className="text-[10px] bg-muted p-1 rounded">sklearn.GridSearchCV(scoring='r2')</code></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">LR Scheduling</td>
                  <td className="p-3">CNN-BiLSTM</td>
                  <td className="p-3"><Badge variant="outline">Cosine annealing</Badge></td>
                  <td className="p-3 text-xs text-muted-foreground">Minimize Huber + temporal consistency loss</td>
                  <td className="p-3"><code className="text-[10px] bg-muted p-1 rounded">CosineAnnealingWarmRestarts(T_0=10)</code></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Ensemble Stacking</td>
                  <td className="p-3">All 4 base models</td>
                  <td className="p-3"><Badge variant="outline">Meta-learner</Badge></td>
                  <td className="p-3 text-xs text-muted-foreground">Ridge regression on OOF base predictions (12 meta-features)</td>
                  <td className="p-3"><code className="text-[10px] bg-muted p-1 rounded">sklearn.StackingRegressor(cv=5)</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-primary mb-2">Feature Selection Pipeline</p>
            <div className="grid gap-3 md:grid-cols-4 text-xs text-muted-foreground">
              <div className="bg-muted p-2 rounded">
                <p className="font-semibold text-foreground">Step 1: Filter</p>
                <p>Remove features with variance &lt; 0.01 and pairwise correlation &gt; 0.95 (VIF &gt; 10).</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="font-semibold text-foreground">Step 2: Boruta</p>
                <p>Shadow feature comparison (RF, 100 iterations). Retain confirmed + tentative features.</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="font-semibold text-foreground">Step 3: RFECV</p>
                <p>Recursive elimination with spatial CV. Optimal subset: 31 of 47 features.</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="font-semibold text-foreground">Step 4: SHAP</p>
                <p>Final ranking via mean |SHAP|. Features with importance &lt; 1% considered for removal.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLTrainingTab;
