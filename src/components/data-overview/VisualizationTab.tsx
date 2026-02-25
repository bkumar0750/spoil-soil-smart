import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Map, LineChart, BarChart3, Download, Microscope } from "lucide-react";

const VisualizationTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Data Visualization, Diagnostics & Export</CardTitle>
              <CardDescription>Interactive analysis tools, model diagnostics, and multi-format data export capabilities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Time Series Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Multi-panel NDVI, σ⁰_VH/VV, SM trend visualization</p>
                <p>• STL decomposition: trend + seasonal + residual panels</p>
                <p>• Rainfall-SM lag correlation heatmaps (0-30 day lags)</p>
                <p>• Anomaly detection: Z-score highlighting (|Z| &gt; 2)</p>
                <p>• Cross-sensor comparison: S1 vs S2 vs GLDAS SM</p>
                <p>• Phenological curve fitting (double-logistic TIMESAT)</p>
                <p>• Moving-window correlation (30-day, 90-day) for regime shifts</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Spatial Visualization</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Interactive Leaflet maps with multi-layer toggling</p>
                <p>• SM prediction maps: continuous color ramp (RdYlBu)</p>
                <p>• Prediction uncertainty overlay (QRF 90% CI width)</p>
                <p>• Hillshade + contour overlays from DEM</p>
                <p>• Ground truth point display with residual coloring</p>
                <p>• Land cover mask overlay (mine / forest / grassland)</p>
                <p>• Spatial error distribution maps (predicted - observed)</p>
                <p>• Semivariogram visualization for spatial autocorrelation</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">ML Model Diagnostics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Observed vs. predicted scatter (1:1 line + R², RMSE)</p>
                <p>• Residual plots: vs. predicted, vs. each feature</p>
                <p>• SHAP summary beeswarm & force plots (per prediction)</p>
                <p>• Partial Dependence Plots (PDP) + ICE curves (top-5 features)</p>
                <p>• Learning curves: train/val error vs. training set size</p>
                <p>• Feature importance comparison across models (RF, XGB, SVR, DL)</p>
                <p>• Confusion matrix for reclamation suitability classification</p>
                <p>• Prediction interval calibration plot (PICP vs. nominal coverage)</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Statistical Summary & EDA</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Descriptive statistics: mean, std, skewness, kurtosis per feature</p>
                <p>• Distribution histograms with KDE overlay + normality tests (Shapiro-Wilk)</p>
                <p>• Pearson/Spearman correlation matrix heatmap (47×47 features)</p>
                <p>• VIF (Variance Inflation Factor) table for multicollinearity</p>
                <p>• Box plots: SM by landform class, season, depth</p>
                <p>• Pair plots for top-10 features (colored by SM class)</p>
                <p>• PCA biplot: first 3 components (cumulative variance explained)</p>
                <p>• t-SNE / UMAP projections of feature space colored by SM</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg">Data Export & Reproducibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-primary text-xs">Raster Exports</p>
                  <p>• GeoTIFF (Cloud-Optimized, LZW compression)</p>
                  <p>• SM prediction maps at 10m resolution</p>
                  <p>• Uncertainty maps (CI width per pixel)</p>
                  <p>• Multi-band feature stacks (47 bands)</p>
                  <p>• CRS: UTM 44N (EPSG:32644)</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-primary text-xs">Tabular & Vector</p>
                  <p>• CSV: feature matrix, predictions, ground truth</p>
                  <p>• GeoJSON/Shapefile: sampling points with attributes</p>
                  <p>• Parquet: compressed columnar format for large datasets</p>
                  <p>• SHAP values export: per-sample feature attributions</p>
                  <p>• Model performance metrics JSON</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-primary text-xs">Reports & Artifacts</p>
                  <p>• PDF: automated analysis report with charts</p>
                  <p>• HTML: interactive Plotly dashboard export</p>
                  <p>• ONNX: trained model export for edge deployment</p>
                  <p>• MLflow: experiment tracking artifacts & model registry</p>
                  <p>• Docker: reproducible training environment image</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizationTab;
