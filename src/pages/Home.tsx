import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Satellite, Droplets, TreeDeciduous, BarChart3, Map, Database } from "lucide-react";
import heroImage from "@/assets/hero-reclamation.jpg";
import { AreaAnalysisForm } from "@/components/AreaAnalysisForm";
import { AnalysisResults } from "@/components/AnalysisResults";

const Home = () => {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const features = [
    {
      icon: Satellite,
      title: "Satellite Data Integration",
      description: "Leverage Sentinel-1 SAR and Sentinel-2 MSI for high-resolution soil moisture estimation and vegetation monitoring.",
    },
    {
      icon: Droplets,
      title: "Soil Moisture Prediction",
      description: "Machine learning models trained on field data to predict soil moisture at multiple depths across mine overburden.",
    },
    {
      icon: TreeDeciduous,
      title: "Species Suitability",
      description: "Multi-criteria analysis combining moisture, soil chemistry, and topography for optimal tree species selection.",
    },
    {
      icon: Map,
      title: "Interactive Mapping",
      description: "Visualize predictions, suitability zones, and uncertainty maps with interactive GIS capabilities.",
    },
    {
      icon: BarChart3,
      title: "Model Performance",
      description: "Track model accuracy, feature importance, and validation metrics with comprehensive analytics.",
    },
    {
      icon: Database,
      title: "Field Data Management",
      description: "Organize and analyze field sampling data, lab results, and ground truth measurements.",
    },
  ];

  const stats = [
    { value: "10m", label: "Spatial Resolution" },
    { value: "R² > 0.85", label: "Model Accuracy" },
    { value: "Multi-depth", label: "Soil Profiling" },
    { value: "Real-time", label: "Predictions" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="container relative py-20 md:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                M.Tech Research Project
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Soil Moisture Prediction for{" "}
                <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  Mine Reclamation
                </span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Advanced remote sensing and machine learning platform for predicting soil moisture and species suitability on mine overburden dumps for successful afforestation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  <Link to="/data">Explore Data</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/predictions">View Predictions</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
              <img
                src={heroImage}
                alt="Mine reclamation site with vegetation"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Comprehensive Platform Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Integrating remote sensing, field data, and machine learning for data-driven reclamation decisions
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Analyze Your Mine Area
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get real-time soil moisture analysis and tree growth predictions for Noamundi mine area using satellite data
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AreaAnalysisForm onAnalysisComplete={setAnalysisData} />
          </div>

          {analysisData && (
            <div className="max-w-6xl mx-auto">
              <AnalysisResults data={analysisData} />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="border-2">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl sm:text-4xl">Explore More Features</CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Access comprehensive datasets, train prediction models, and generate suitability maps for mine reclamation planning
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/data">View Datasets</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/model">Train Models</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/about">Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
