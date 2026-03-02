import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Target, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <div className="container py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="mb-1">Research</Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About This Project</h1>
        <p className="text-muted-foreground max-w-3xl">
          M.Tech research platform for soil moisture prediction and species suitability analysis on mine overburden using satellite remote sensing and machine learning.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Research Objectives</CardTitle>
                <CardDescription>Core goals of this M.Tech thesis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "Predict surface soil moisture on mine overburden dumps using multi-sensor satellite data (Sentinel-1 SAR, Sentinel-2 MSI)",
              "Develop and validate ML models (Random Forest, XGBoost) for moisture estimation at 10m resolution",
              "Assess tree species suitability through multi-criteria analysis combining moisture, soil chemistry, and topography",
              "Create actionable reclamation recommendations for successful afforestation planning",
            ].map((obj, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Badge variant="default" className="mt-0.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] shrink-0">{i + 1}</Badge>
                <p>{obj}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Methodology Overview</CardTitle>
                <CardDescription>Integrated approach</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { step: "1. Data Acquisition", desc: "Satellite imagery (Sentinel-1/2, Landsat, SRTM DEM) + field sampling campaigns" },
              { step: "2. Preprocessing & Feature Engineering", desc: "Atmospheric correction, SAR calibration, index computation (NDVI, SMI, TWI)" },
              { step: "3. Model Development", desc: "Train ensemble ML models, validate with spatial cross-validation" },
              { step: "4. Suitability Analysis", desc: "Multi-criteria decision analysis for species-specific reclamation zones" },
            ].map((m, i) => (
              <div key={i}>
                <p className="font-medium">{m.step}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{m.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Key Contributions</CardTitle>
              <CardDescription>Novel aspects of this research</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "High-Resolution Moisture Mapping", desc: "First 10m resolution soil moisture maps specifically for mine overburden, addressing the unique heterogeneity of anthropogenic spoil material." },
              { title: "SAR-Optical Fusion", desc: "Novel integration of Sentinel-1 C-band backscatter with Sentinel-2 vegetation indices for improved moisture prediction on sparse vegetation surfaces." },
              { title: "Species-Specific Suitability", desc: "Tailored multi-criteria suitability models for 4+ native tree species, considering local soil contamination and climate constraints." },
              { title: "Uncertainty Quantification", desc: "Pixel-wise uncertainty maps using bootstrap aggregation, identifying high-confidence vs. uncertain zones for adaptive planning." },
            ].map((c, i) => (
              <Card key={i} className="border">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{c.title}</CardTitle></CardHeader>
                <CardContent><p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p></CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <CardTitle>M.Tech Thesis Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            {[
              { label: "Program", value: "M.Tech in Remote Sensing / Environmental Engineering" },
              { label: "Research Domain", value: "Mine Reclamation, Geospatial Analysis, Machine Learning" },
              { label: "Study Area", value: "Jharia Coalfield, Jharkhand, India" },
              { label: "Duration", value: "2-year research project" },
            ].map((d, i) => (
              <div key={i}>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{d.label}</p>
                <p className="mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tools & Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { category: "Remote Sensing", tools: ["Sentinel-1", "Sentinel-2", "Landsat", "SRTM", "Google Earth Engine"] },
              { category: "Machine Learning", tools: ["Python", "scikit-learn", "XGBoost", "TensorFlow", "Pandas"] },
              { category: "GIS & Visualization", tools: ["QGIS", "GDAL", "Leaflet", "Recharts", "React"] },
            ].map((g, i) => (
              <div key={i} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.tools.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Outcomes & Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: "Scientific Contributions", items: ["Novel methodology for mine spoil moisture estimation using SAR-optical fusion", "Calibrated ML models (R² > 0.96) validated with field measurements", "Open-source workflow for replication in other mine sites", "Publication potential in remote sensing and environmental science journals"] },
            { title: "Practical Applications", items: ["Data-driven reclamation planning for mining companies", "Reduced seedling mortality through optimal species-site matching", "Cost savings by targeting high-suitability zones for intervention", "Continuous monitoring framework using freely available satellite data"] },
            { title: "Environmental Impact", items: ["Accelerated ecosystem restoration on degraded mine lands", "Improved carbon sequestration through successful tree establishment", "Enhanced biodiversity and soil health in reclaimed areas", "Scalable approach for landscape-level reclamation monitoring"] },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/40">
              <p className="font-medium text-sm mb-2">{s.title}</p>
              <ul className="space-y-1">
                {s.items.map((item, j) => (
                  <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          <Card className="border-2 border-primary/15 bg-primary/5">
            <CardContent className="pt-4 text-sm">
              <p className="font-medium">Kashyap, R., & Kuttippurath, J. (2024)</p>
              <p className="text-muted-foreground text-xs mt-1">
                Warming-induced soil moisture stress threatens food security in India. <em>Environmental Science and Pollution Research</em>, 31, 59202–59218.
              </p>
              <a href="https://doi.org/10.1007/s11356-024-35107-7" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs mt-2 inline-block">
                https://doi.org/10.1007/s11356-024-35107-7
              </a>
              <div className="mt-2 flex flex-wrap gap-1">
                {["Soil Moisture Drying", "Random Forest", "CMIP6", "Food Security", "India"].map(t => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            {[
              { author: "Humphrey, V., et al. (2021)", title: "Soil moisture–atmosphere feedback dominates land carbon uptake variability. Nature." },
              { author: "Lal, R., et al. (2023)", title: "Global soil moisture drying trends and driving mechanisms in recent decades." },
              { author: "Green, J.K., et al. (2019)", title: "Large influence of soil moisture on long-term terrestrial carbon uptake. Nature." },
              { author: "Krishnamurthy, R.P.K., et al. (2022)", title: "The role of soil moisture in crop yield variability and food security." },
            ].map((r, i) => (
              <Card key={i} className="border">
                <CardContent className="pt-4">
                  <p className="font-medium text-xs">{r.author}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">{r.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
