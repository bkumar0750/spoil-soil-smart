import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Target, Users } from "lucide-react";

const About = () => {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About This Project</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          M.Tech research platform for soil moisture prediction and species suitability analysis on mine overburden using 
          satellite remote sensing and machine learning.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Research Objectives</CardTitle>
                <CardDescription>Core goals of this M.Tech thesis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="default" className="mt-0.5">1</Badge>
              <p>Predict surface soil moisture on mine overburden dumps using multi-sensor satellite data (Sentinel-1 SAR, Sentinel-2 MSI)</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="default" className="mt-0.5">2</Badge>
              <p>Develop and validate machine learning models (Random Forest, XGBoost) for moisture estimation at 10m resolution</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="default" className="mt-0.5">3</Badge>
              <p>Assess tree species suitability through multi-criteria analysis combining moisture, soil chemistry, and topography</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="default" className="mt-0.5">4</Badge>
              <p>Create actionable reclamation recommendations for successful afforestation planning</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Methodology Overview</CardTitle>
                <CardDescription>Integrated approach</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">1. Data Acquisition</p>
              <p className="text-muted-foreground">Satellite imagery (Sentinel-1/2, Landsat, SRTM DEM) + field sampling campaigns</p>
            </div>
            <div>
              <p className="font-medium">2. Preprocessing & Feature Engineering</p>
              <p className="text-muted-foreground">Atmospheric correction, SAR calibration, index computation (NDVI, SMI, TWI)</p>
            </div>
            <div>
              <p className="font-medium">3. Model Development</p>
              <p className="text-muted-foreground">Train ensemble ML models, validate with spatial cross-validation</p>
            </div>
            <div>
              <p className="font-medium">4. Suitability Analysis</p>
              <p className="text-muted-foreground">Multi-criteria decision analysis for species-specific reclamation zones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Contributions</CardTitle>
          <CardDescription>Novel aspects of this research</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">High-Resolution Moisture Mapping</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                First 10m resolution soil moisture maps specifically for mine overburden in this region, 
                addressing the unique heterogeneity of anthropogenic spoil material.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">SAR-Optical Fusion</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Novel integration of Sentinel-1 C-band backscatter with Sentinel-2 vegetation indices 
                for improved moisture prediction on sparse vegetation surfaces.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Species-Specific Suitability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Tailored multi-criteria suitability models for 4+ native tree species, considering 
                local soil contamination and climate constraints.
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Uncertainty Quantification</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Pixel-wise uncertainty maps using bootstrap aggregation, identifying high-confidence 
                vs. uncertain zones for adaptive reclamation planning.
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <CardTitle>M.Tech Thesis Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="font-medium">Program</p>
              <p className="text-muted-foreground">M.Tech in Remote Sensing / Environmental Engineering</p>
            </div>
            <div>
              <p className="font-medium">Research Domain</p>
              <p className="text-muted-foreground">Mine Reclamation, Geospatial Analysis, Machine Learning</p>
            </div>
            <div>
              <p className="font-medium">Study Area</p>
              <p className="text-muted-foreground">Mine overburden dump site (specify location)</p>
            </div>
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-muted-foreground">2-year research project</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Tools & Technologies</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <p className="font-medium">Remote Sensing</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Sentinel-1</Badge>
                <Badge variant="secondary">Sentinel-2</Badge>
                <Badge variant="secondary">Landsat</Badge>
                <Badge variant="secondary">SRTM</Badge>
                <Badge variant="secondary">Google Earth Engine</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-medium">Machine Learning</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">scikit-learn</Badge>
                <Badge variant="secondary">XGBoost</Badge>
                <Badge variant="secondary">TensorFlow</Badge>
                <Badge variant="secondary">Pandas</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-medium">GIS & Visualization</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">QGIS</Badge>
                <Badge variant="secondary">GDAL</Badge>
                <Badge variant="secondary">Leaflet</Badge>
                <Badge variant="secondary">Matplotlib</Badge>
                <Badge variant="secondary">Streamlit</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Outcomes & Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium mb-2">Scientific Contributions</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Novel methodology for mine spoil moisture estimation using SAR-optical fusion</li>
                <li>• Calibrated ML models (R² &gt; 0.90) validated with field measurements</li>
                <li>• Open-source workflow for replication in other mine sites</li>
                <li>• Publication potential in remote sensing and environmental science journals</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium mb-2">Practical Applications</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Data-driven reclamation planning for mining companies</li>
                <li>• Reduced seedling mortality through optimal species-site matching</li>
                <li>• Cost savings by targeting high-suitability zones for intervention</li>
                <li>• Continuous monitoring framework using freely available satellite data</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium mb-2">Environmental Impact</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Accelerated ecosystem restoration on degraded mine lands</li>
                <li>• Improved carbon sequestration through successful tree establishment</li>
                <li>• Enhanced biodiversity and soil health in reclaimed areas</li>
                <li>• Scalable approach for landscape-level reclamation monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Key References</CardTitle>
              <CardDescription>Literature supporting this research</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-4 text-sm">
              <p className="font-medium">Kashyap, R., & Kuttippurath, J. (2024)</p>
              <p className="text-muted-foreground mt-1">
                Warming-induced soil moisture stress threatens food security in India. <em>Environmental Science and Pollution Research</em>, 31, 59202–59218.
              </p>
              <a href="https://doi.org/10.1007/s11356-024-35107-7" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs mt-2 inline-block">
                https://doi.org/10.1007/s11356-024-35107-7
              </a>
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="secondary">Soil Moisture Drying</Badge>
                <Badge variant="secondary">Random Forest</Badge>
                <Badge variant="secondary">CMIP6</Badge>
                <Badge variant="secondary">Food Security</Badge>
                <Badge variant="secondary">India</Badge>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                <strong>Key findings used:</strong> Temperature is the dominant driver of SM variability (30.76%), monsoon SM declined 4.5%, 
                warming rate of 0.59°C/decade, and 1-month Granger causality lag between SM stress and productivity loss.
              </p>
            </CardContent>
          </Card>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Card className="border">
              <CardContent className="pt-4">
                <p className="font-medium">Humphrey, V., et al. (2021)</p>
                <p className="text-muted-foreground text-xs mt-1">Soil moisture–atmosphere feedback dominates land carbon uptake variability. <em>Nature</em>.</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="pt-4">
                <p className="font-medium">Lal, R., et al. (2023)</p>
                <p className="text-muted-foreground text-xs mt-1">Global soil moisture drying trends and driving mechanisms in recent decades.</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="pt-4">
                <p className="font-medium">Green, J.K., et al. (2019)</p>
                <p className="text-muted-foreground text-xs mt-1">Large influence of soil moisture on long-term terrestrial carbon uptake. <em>Nature</em>.</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="pt-4">
                <p className="font-medium">Krishnamurthy, R.P.K., et al. (2022)</p>
                <p className="text-muted-foreground text-xs mt-1">The role of soil moisture in crop yield variability and food security.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
